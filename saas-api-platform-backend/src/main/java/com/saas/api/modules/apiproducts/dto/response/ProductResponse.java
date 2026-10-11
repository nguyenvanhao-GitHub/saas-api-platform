package com.saas.api.modules.apiproducts.dto.response;

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
public class ProductResponse {

    private UUID id;
    private String code;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private String planType;
    private int rateLimitPerMinute;
    private Instant createdAt;
}
