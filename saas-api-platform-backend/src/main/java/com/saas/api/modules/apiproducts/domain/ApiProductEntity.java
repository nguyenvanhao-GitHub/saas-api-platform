package com.saas.api.modules.apiproducts.domain;

import com.saas.api.core.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "api_products")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiProductEntity extends BaseEntity {

    @Column(nullable = false, unique = true, length = 64)
    private String code;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Column(nullable = false, length = 32)
    @Builder.Default
    private String planType = "METERED"; // FIXED, METERED

    @Column(nullable = false)
    @Builder.Default
    private int rateLimitPerMinute = 60;
}
