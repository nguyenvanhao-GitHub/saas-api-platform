package com.saas.api.modules.subscriptions.service;

import com.saas.api.core.model.PageResponse;
import com.saas.api.modules.subscriptions.domain.SubscriptionEntity;
import com.saas.api.modules.subscriptions.dto.response.SubscriptionResponse;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface SubscriptionService {

    SubscriptionResponse subscribe(UUID userId, UUID productId);

    List<SubscriptionResponse> getUserActiveSubscriptions(UUID userId);

    void cancelSubscription(UUID userId, UUID subscriptionId);

    PageResponse<SubscriptionResponse> getAllSubscriptions(Pageable pageable);

    BigDecimal calculateBilling(SubscriptionEntity subscription);
}
