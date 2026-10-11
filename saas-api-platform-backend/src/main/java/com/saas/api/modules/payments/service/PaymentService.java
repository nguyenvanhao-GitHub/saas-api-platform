package com.saas.api.modules.payments.service;

import com.saas.api.modules.payments.dto.request.CardPaymentRequest;
import com.saas.api.modules.payments.dto.request.PaymentIntentRequest;
import com.saas.api.modules.payments.dto.request.VietQrCallbackRequest;
import com.saas.api.modules.payments.dto.response.PaymentIntentResponse;
import com.saas.api.modules.payments.dto.response.VietQrResponse;

import java.util.UUID;

public interface PaymentService {

    PaymentIntentResponse createPaymentIntent(UUID userId, PaymentIntentRequest request);

    PaymentIntentResponse payWithCard(UUID userId, CardPaymentRequest request);

    PaymentIntentResponse confirmPaymentWebhook(String transactionReference);

    PaymentIntentResponse processVietQrCallback(VietQrCallbackRequest request);

    VietQrResponse generateVietQrForInvoice(UUID invoiceId);
}
