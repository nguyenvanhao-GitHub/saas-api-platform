package com.saas.api.modules.apiproducts.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductRequest {

    @NotBlank(message = "Tên gói API không được để trống")
    private String name;

    private String description;

    @NotNull(message = "Giá cơ sở không được để trống")
    @Min(value = 0, message = "Giá cơ sở phải lớn hơn hoặc bằng 0")
    private BigDecimal basePrice;

    @NotBlank(message = "Loại gói (FIXED/METERED) không được để trống")
    private String planType;

    @Min(value = 1, message = "Hạn mức Rate Limit phải từ 1 req/min trở lên")
    @Builder.Default
    private int rateLimitPerMinute = 60;
}
