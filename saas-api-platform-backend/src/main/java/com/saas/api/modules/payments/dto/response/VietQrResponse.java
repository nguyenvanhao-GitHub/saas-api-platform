package com.saas.api.modules.payments.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VietQrResponse {
    private String invoiceNumber;
    private BigDecimal amountUsd;
    private long amountVnd;
    private String bankId;
    private String bankName;
    private String accountNumber;
    private String accountHolderName;
    private String transferMemo;
    private String qrImageUrl;
    private String quickPaymentDeepLink;
}
