package com.saas.api.modules.payments.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentIntentResponse {

    private UUID transactionId;
    private String transactionReference;
    private UUID invoiceId;
    private BigDecimal amount;
    private String currency;
    private String clientSecret;
    private String paymentUrl;
    private String status;
}
