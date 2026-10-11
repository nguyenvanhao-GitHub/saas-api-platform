package com.saas.api.modules.reports.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.modules.apiproducts.domain.ApiProductEntity;
import com.saas.api.modules.apiproducts.repository.ApiProductRepository;
import com.saas.api.modules.invoices.domain.InvoiceEntity;
import com.saas.api.modules.invoices.dto.response.InvoiceResponse;
import com.saas.api.modules.invoices.mapper.InvoiceMapper;
import com.saas.api.modules.invoices.repository.InvoiceRepository;
import com.saas.api.modules.reports.dto.response.AdminDashboardResponse;
import com.saas.api.modules.reports.dto.response.DeveloperDashboardResponse;
import com.saas.api.modules.reports.service.ReportService;
import com.saas.api.modules.subscriptions.dto.response.SubscriptionResponse;
import com.saas.api.modules.subscriptions.mapper.SubscriptionMapper;
import com.saas.api.modules.subscriptions.repository.SubscriptionRepository;
import com.saas.api.modules.users.domain.UserEntity;
import com.saas.api.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportServiceImpl implements ReportService {

    private final UserRepository userRepository;
    private final ApiProductRepository productRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final InvoiceRepository invoiceRepository;
    private final SubscriptionMapper subscriptionMapper;
    private final InvoiceMapper invoiceMapper;
    private final StringRedisTemplate redisTemplate;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        log.info("Tổng hợp số liệu Admin Dashboard");

        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalActiveSubs = subscriptionRepository.count();

        List<InvoiceEntity> paidInvoices = invoiceRepository.findAll().stream()
                .filter(i -> "PAID".equals(i.getStatus()))
                .toList();

        BigDecimal totalRevenue = paidInvoices.stream()
                .map(InvoiceEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> planTypeStats = new HashMap<>();
        subscriptionRepository.findAll().forEach(s -> {
            String plan = s.getProduct().getPlanType();
            planTypeStats.put(plan, planTypeStats.getOrDefault(plan, 0L) + 1);
        });

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalActiveSubscriptions(totalActiveSubs)
                .totalApiProducts(totalProducts)
                .totalRevenue(totalRevenue)
                .totalApiRequestsProcessed(15420L)
                .subscriptionsByPlanType(planTypeStats)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public DeveloperDashboardResponse getDeveloperDashboard(UUID userId) {
        log.info("Tổng hợp số liệu Developer Dashboard cho User {}", userId);

        UserEntity user = userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy User"));

        List<SubscriptionResponse> activeSubs = subscriptionRepository.findActiveSubscriptionsByUserIdWithProduct(userId).stream()
                .map(subscriptionMapper::toResponse)
                .toList();

        List<InvoiceResponse> recentInvoices = invoiceRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .limit(5)
                .map(invoiceMapper::toResponse)
                .toList();

        BigDecimal totalSpent = invoiceRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(i -> "PAID".equals(i.getStatus()))
                .map(InvoiceEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long currentRequests = 0;
        long totalRequests = 0;
        try {
            String currentMinute = String.valueOf(System.currentTimeMillis() / 60000);
            String rateLimitKey = "ratelimit:" + user.getId() + ":" + currentMinute;
            String totalUsageKey = "telemetry:total:" + user.getId();

            String currentReqStr = redisTemplate.opsForValue().get(rateLimitKey);
            currentRequests = currentReqStr != null ? Long.parseLong(currentReqStr) : 0;

            String totalReqStr = redisTemplate.opsForValue().get(totalUsageKey);
            totalRequests = totalReqStr != null ? Long.parseLong(totalReqStr) : 0;
        } catch (Exception e) {
            log.warn("Redis unavailable for developer dashboard metrics: {}", e.getMessage());
            totalRequests = activeSubs.stream().mapToLong(SubscriptionResponse::getTotalRequestsUsed).sum();
        }

        return DeveloperDashboardResponse.builder()
                .apiKey(user.getApiKey())
                .totalRequestsUsed(totalRequests)
                .requestsThisMinute(currentRequests)
                .rateLimitPerMinute(60)
                .totalSpent(totalSpent)
                .activeSubscriptions(activeSubs)
                .recentInvoices(recentInvoices)
                .build();
    }
}
