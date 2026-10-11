package com.saas.api.modules.payments.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class CardPaymentRequest {

    @NotNull(message = "ID hóa đơn không được để trống")
    private UUID invoiceId;

    @NotBlank(message = "Số thẻ không được để trống")
    private String cardNumber;

    @NotBlank(message = "Tên chủ thẻ không được để trống")
    private String cardHolder;

    @NotBlank(message = "Hạn thẻ không được để trống (MM/YY)")
    private String expiry;

    @NotBlank(message = "Mã bảo mật CVC không được để trống")
    private String cvc;

    private String stripePaymentMethodId;
}
