package com.saas.api.modules.payments.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentIntentRequest {

    @NotNull(message = "ID Hóa đơn không được để trống")
    private UUID invoiceId;

    @Builder.Default
    private String paymentMethod = "CREDIT_CARD";
}
