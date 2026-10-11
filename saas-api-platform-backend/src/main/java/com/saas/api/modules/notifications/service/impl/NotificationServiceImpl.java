package com.saas.api.modules.notifications.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.core.model.PageResponse;
import com.saas.api.core.security.SecurityUtils;
import com.saas.api.modules.notifications.domain.NotificationEntity;
import com.saas.api.modules.notifications.dto.response.NotificationResponse;
import com.saas.api.modules.notifications.dto.response.UnreadCountResponse;
import com.saas.api.modules.notifications.repository.NotificationRepository;
import com.saas.api.modules.notifications.service.NotificationService;
import com.saas.api.modules.users.domain.UserEntity;
import com.saas.api.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getMyNotifications(int page, int size) {
        UUID userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));

        Page<NotificationEntity> notifPage = notificationRepository
                .findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId, PageRequest.of(page, size));

        return PageResponse.from(notifPage.map(this::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount() {
        UUID userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));

        long count = notificationRepository.countByUserIdAndIsReadFalseAndIsDeletedFalse(userId);
        return new UnreadCountResponse(count);
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(UUID notificationId) {
        UUID userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));

        NotificationEntity entity = notificationRepository.findByIdAndUserIdAndIsDeletedFalse(notificationId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy thông báo"));

        if (!entity.isRead()) {
            entity.setRead(true);
            entity.setReadAt(Instant.now());
            entity = notificationRepository.save(entity);
        }

        return toResponse(entity);
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        UUID userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));

        notificationRepository.markAllAsReadByUserId(userId, Instant.now());
    }

    @Override
    @Transactional
    public void createNotification(UUID userId, String title, String content, String type) {
        try {
            UserEntity user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                log.warn("Cannot create notification for non-existing user: {}", userId);
                return;
            }

            NotificationEntity notif = NotificationEntity.builder()
                    .user(user)
                    .title(title)
                    .content(content)
                    .type(type != null ? type : "INFO")
                    .isRead(false)
                    .build();

            notificationRepository.save(notif);
            log.info("In-App Notification created for user {}: [{}] {}", userId, type, title);
        } catch (Exception e) {
            log.error("Failed to create notification for user {}: {}", userId, e.getMessage());
        }
    }

    private NotificationResponse toResponse(NotificationEntity entity) {
        return NotificationResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .type(entity.getType())
                .isRead(entity.isRead())
                .readAt(entity.getReadAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
