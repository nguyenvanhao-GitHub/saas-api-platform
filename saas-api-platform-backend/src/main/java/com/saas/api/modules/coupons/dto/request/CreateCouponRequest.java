package com.saas.api.modules.coupons.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCouponRequest {

    @NotBlank(message = "Mã giảm giá không được để trống")
    private String code;

    @NotBlank(message = "Loại giảm giá (PERCENTAGE/FIXED_AMOUNT) không được để trống")
    private String discountType;

    @NotNull(message = "Giá trị giảm không được để trống")
    @Min(value = 0, message = "Giá trị giảm phải lớn hơn hoặc bằng 0")
    private BigDecimal discountValue;

    @Min(value = 1, message = "Số lượt dùng tối đa phải từ 1 trở lên")
    @Builder.Default
    private int maxUses = 100;

    private Instant expiresAt;
}
