package com.saas.api.modules.subscriptions.strategy;

import java.math.BigDecimal;

public interface BillingCalculatorStrategy {
    BigDecimal calculateTotalFee(BigDecimal basePrice, long requestCount);
    String getPlanType();
}
