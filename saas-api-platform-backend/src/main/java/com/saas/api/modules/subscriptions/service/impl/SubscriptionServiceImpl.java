package com.saas.api.modules.subscriptions.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.core.model.PageResponse;
import com.saas.api.modules.apiproducts.domain.ApiProductEntity;
import com.saas.api.modules.apiproducts.repository.ApiProductRepository;
import com.saas.api.modules.subscriptions.domain.SubscriptionEntity;
import com.saas.api.modules.subscriptions.dto.response.SubscriptionResponse;
import com.saas.api.modules.subscriptions.mapper.SubscriptionMapper;
import com.saas.api.modules.subscriptions.repository.SubscriptionRepository;
import com.saas.api.modules.subscriptions.service.SubscriptionService;
import com.saas.api.modules.subscriptions.strategy.BillingCalculatorStrategy;
import com.saas.api.modules.users.domain.UserEntity;
import com.saas.api.modules.users.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final ApiProductRepository productRepository;
    private final SubscriptionMapper subscriptionMapper;
    private final BillingCalculatorStrategy meteredStrategy;
    private final BillingCalculatorStrategy fixedStrategy;

    public SubscriptionServiceImpl(
            SubscriptionRepository subscriptionRepository,
            UserRepository userRepository,
            ApiProductRepository productRepository,
            SubscriptionMapper subscriptionMapper,
            @Qualifier("meteredPlanStrategy") BillingCalculatorStrategy meteredStrategy,
            @Qualifier("fixedPlanStrategy") BillingCalculatorStrategy fixedStrategy
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.subscriptionMapper = subscriptionMapper;
        this.meteredStrategy = meteredStrategy;
        this.fixedStrategy = fixedStrategy;
    }

    @Override
    @Transactional
    public SubscriptionResponse subscribe(UUID userId, UUID productId) {
        log.info("Xử lý đăng ký gói API {} cho User {}", productId, userId);

        UserEntity user = userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy User"));
        ApiProductEntity product = productRepository.findById(productId)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

        subscriptionRepository.findByUserIdAndProductId(userId, productId).ifPresent(s -> {
            if ("ACTIVE".equals(s.getStatus())) {
                throw new BusinessException(ErrorCode.SUBSCRIPTION_ALREADY_EXISTS);
            }
        });

        SubscriptionEntity subscription = SubscriptionEntity.builder()
                .user(user)
                .product(product)
                .status("ACTIVE")
                .totalRequestsUsed(0)
                .build();

        SubscriptionEntity saved = subscriptionRepository.save(subscription);
        return subscriptionMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getUserActiveSubscriptions(UUID userId) {
        return subscriptionRepository.findActiveSubscriptionsByUserIdWithProduct(userId).stream()
                .map(subscriptionMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void cancelSubscription(UUID userId, UUID subscriptionId) {
        log.info("Hủy gói đăng ký {} của User {}", subscriptionId, userId);
        SubscriptionEntity subscription = subscriptionRepository.findById(subscriptionId)
                .filter(s -> s.getUser().getId().equals(userId))
                .orElseThrow(() -> new BusinessException(ErrorCode.SUBSCRIPTION_NOT_FOUND));

        subscription.setStatus("CANCELLED");
        subscriptionRepository.save(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<SubscriptionResponse> getAllSubscriptions(Pageable pageable) {
        Page<SubscriptionEntity> page = subscriptionRepository.findAll(pageable);
        return PageResponse.from(page.map(subscriptionMapper::toResponse));
    }

    @Override
    public BigDecimal calculateBilling(SubscriptionEntity subscription) {
        ApiProductEntity product = subscription.getProduct();
        BillingCalculatorStrategy strategy = "FIXED".equalsIgnoreCase(product.getPlanType()) ? fixedStrategy : meteredStrategy;

        BigDecimal fee = strategy.calculateTotalFee(product.getBasePrice(), subscription.getTotalRequestsUsed());
        log.info("Tính phí cho User {} với Gói {}: Strategy = {}, Tổng phí = {} USD",
                subscription.getUser().getEmail(), product.getCode(), strategy.getPlanType(), fee);
        return fee;
    }
}
