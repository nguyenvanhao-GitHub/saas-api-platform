package com.saas.api.modules.coupons.domain;

import com.saas.api.core.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponEntity extends BaseEntity {

    @Column(nullable = false, unique = true, length = 32)
    private String code;

    @Column(nullable = false, length = 16)
    @Builder.Default
    private String discountType = "PERCENTAGE"; // PERCENTAGE, FIXED_AMOUNT

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discountValue;

    @Column(nullable = false)
    @Builder.Default
    private int maxUses = 100;

    @Column(nullable = false)
    @Builder.Default
    private int timesUsed = 0;

    @Column
    private Instant expiresAt;

    @Column(nullable = false, length = 32)
    @Builder.Default
    private String status = "ACTIVE";
}
