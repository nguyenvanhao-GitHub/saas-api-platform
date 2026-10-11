package com.saas.api.modules.payments.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VietQrCallbackRequest {

    @Schema(description = "Mã giao dịch ngân hàng", example = "FT26091012345678")
    private String transactionReference;

    @Schema(description = "Số tiền chuyển khoản (VND hoặc USD)", example = "254500")
    private BigDecimal amount;

    @Schema(description = "Nội dung chuyển khoản (chứa mã hóa đơn)", example = "SAAS INV-2026-0001")
    private String content;

    @Schema(description = "Tên ngân hàng chuyển", example = "Vietcombank")
    private String bankName;
}
