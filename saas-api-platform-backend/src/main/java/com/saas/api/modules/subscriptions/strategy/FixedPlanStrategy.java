package com.saas.api.modules.subscriptions.strategy;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component("fixedPlanStrategy")
public class FixedPlanStrategy implements BillingCalculatorStrategy {

    @Override
    public BigDecimal calculateTotalFee(BigDecimal basePrice, long requestCount) {
        // Gói Cố Định: Giá cố định hàng tháng không phụ thuộc số request
        return basePrice;
    }

    @Override
    public String getPlanType() {
        return "FIXED";
    }
}
