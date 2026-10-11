package com.saas.api.modules.alerts.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.modules.alerts.domain.UsageAlertEntity;
import com.saas.api.modules.alerts.dto.CreateAlertRequest;
import com.saas.api.modules.alerts.dto.UsageAlertResponse;
import com.saas.api.modules.alerts.repository.UsageAlertRepository;
import com.saas.api.modules.alerts.service.UsageAlertService;
import com.saas.api.modules.notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UsageAlertServiceImpl implements UsageAlertService {

    private final UsageAlertRepository usageAlertRepository;
    private final NotificationService notificationService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    @Transactional(readOnly = true)
    public List<UsageAlertResponse> getMyAlerts(UUID userId) {
        return usageAlertRepository.findByUserIdAndIsDeletedFalse(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UsageAlertResponse createAlert(UUID userId, CreateAlertRequest request) {
        UsageAlertEntity entity = UsageAlertEntity.builder()
                .userId(userId)
                .thresholdPercentage(request.getThresholdPercentage())
                .channel(request.getChannel().toUpperCase())
                .destination(request.getDestination())
                .isTriggered(false)
                .build();

        return mapToResponse(usageAlertRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteAlert(UUID userId, UUID alertId) {
        UsageAlertEntity entity = usageAlertRepository.findById(alertId)
                .filter(a -> !a.isDeleted() && a.getUserId().equals(userId))
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy cấu hình cảnh báo"));

        entity.setDeleted(true);
        usageAlertRepository.save(entity);
    }

    @Override
    @Transactional
    public void testAlert(UUID userId, UUID alertId) {
        UsageAlertEntity entity = usageAlertRepository.findById(alertId)
                .filter(a -> !a.isDeleted() && a.getUserId().equals(userId))
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy cấu hình cảnh báo"));

        dispatchNotification(entity, 85.0, 8500, 10000, true);
    }

    @Override
    @Transactional
    public void checkAndTriggerAlerts(UUID userId, double percentageUsed, long currentRequests, long limit) {
        List<UsageAlertEntity> alerts = usageAlertRepository.findByUserIdAndIsDeletedFalse(userId);

        for (UsageAlertEntity alert : alerts) {
            if (percentageUsed >= alert.getThresholdPercentage() && Boolean.FALSE.equals(alert.getIsTriggered())) {
                dispatchNotification(alert, percentageUsed, currentRequests, limit, false);
                alert.setIsTriggered(true);
                alert.setLastTriggeredAt(Instant.now());
                usageAlertRepository.save(alert);
            } else if (percentageUsed < alert.getThresholdPercentage() && Boolean.TRUE.equals(alert.getIsTriggered())) {
                // Reset when usage resets in new billing cycle
                alert.setIsTriggered(false);
                usageAlertRepository.save(alert);
            }
        }
    }

    private void dispatchNotification(UsageAlertEntity alert, double percentage, long current, long limit, boolean isTest) {
        String title = isTest ? "🧪 [TEST] Cảnh báo hạn mức API" : String.format("⚠️ Cảnh báo: Đã sử dụng %.1f%% hạn mức API", percentage);
        String message = String.format("Tài khoản của bạn đã tiêu thụ %d / %d requests (%.1f%%). Hãy nâng cấp gói hoặc kiểm tra lưu lượng.", current, limit, percentage);

        try {
            switch (alert.getChannel().toUpperCase()) {
                case "IN_APP":
                    notificationService.createNotification(alert.getUserId(), title, message, "SYSTEM_ALERT");
                    break;
                case "SLACK":
                    if (alert.getDestination() != null && alert.getDestination().startsWith("http")) {
                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_JSON);
                        Map<String, String> payload = Map.of("text", String.format("🚨 *%s*\n%s", title, message));
                        restTemplate.postForEntity(alert.getDestination(), new HttpEntity<>(payload, headers), String.class);
                    }
                    notificationService.createNotification(alert.getUserId(), title, "[Slack Dispatched] " + message, "SYSTEM_ALERT");
                    break;
                case "DISCORD":
                    if (alert.getDestination() != null && alert.getDestination().startsWith("http")) {
                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_JSON);
                        Map<String, String> payload = Map.of("content", String.format("🚨 **%s**\n%s", title, message));
                        restTemplate.postForEntity(alert.getDestination(), new HttpEntity<>(payload, headers), String.class);
                    }
                    notificationService.createNotification(alert.getUserId(), title, "[Discord Dispatched] " + message, "SYSTEM_ALERT");
                    break;
                case "EMAIL":
                default:
                    notificationService.createNotification(alert.getUserId(), title, "[Email Simulated] " + message, "SYSTEM_ALERT");
                    break;
            }
        } catch (Exception e) {
            log.error("Failed to dispatch usage alert to channel {}: {}", alert.getChannel(), e.getMessage());
        }
    }

    private UsageAlertResponse mapToResponse(UsageAlertEntity entity) {
        return UsageAlertResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .thresholdPercentage(entity.getThresholdPercentage())
                .channel(entity.getChannel())
                .destination(entity.getDestination())
                .isTriggered(entity.getIsTriggered())
                .lastTriggeredAt(entity.getLastTriggeredAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
