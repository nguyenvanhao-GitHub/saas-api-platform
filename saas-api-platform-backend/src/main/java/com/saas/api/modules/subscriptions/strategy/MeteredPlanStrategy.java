package com.saas.api.modules.subscriptions.strategy;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component("meteredPlanStrategy")
@Primary // Mặc định chọn MeteredPlanStrategy nếu không dùng @Qualifier
public class MeteredPlanStrategy implements BillingCalculatorStrategy {

    @Override
    public BigDecimal calculateTotalFee(BigDecimal basePrice, long requestCount) {
        // Gói Đo Lưu Lượng: 0.001 USD trên mỗi API request + giá cơ sở
        BigDecimal perRequestFee = BigDecimal.valueOf(0.001);
        BigDecimal totalUsageFee = perRequestFee.multiply(BigDecimal.valueOf(requestCount));
        return basePrice.add(totalUsageFee);
    }

    @Override
    public String getPlanType() {
        return "METERED";
    }
}
