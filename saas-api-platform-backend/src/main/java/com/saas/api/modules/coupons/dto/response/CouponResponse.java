package com.saas.api.modules.coupons.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponResponse {

    private UUID id;
    private String code;
    private String discountType;
    private BigDecimal discountValue;
    private int maxUses;
    private int timesUsed;
    private Instant expiresAt;
    private String status;
    private BigDecimal discountedAmount;
    private BigDecimal finalPrice;
}
