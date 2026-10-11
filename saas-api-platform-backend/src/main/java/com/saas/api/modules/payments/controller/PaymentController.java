package com.saas.api.modules.payments.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.payments.dto.request.CardPaymentRequest;
import com.saas.api.modules.payments.dto.request.PaymentIntentRequest;
import com.saas.api.modules.payments.dto.response.PaymentIntentResponse;
import com.saas.api.modules.payments.dto.response.VietQrResponse;
import com.saas.api.modules.payments.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payments & Settlement", description = "API Tạo Phiên Thanh Toán & Webhook Callback")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-intent")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Tạo phiên thanh toán (Payment Intent)", description = "Sinh link thanh toán và Client Secret cho Hóa đơn")
    public ApiResponse<PaymentIntentResponse> createPaymentIntent(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PaymentIntentRequest request
    ) {
        return ApiResponse.success("Khởi tạo phiên thanh toán thành công", paymentService.createPaymentIntent(principal.getId(), request));
    }

    @PostMapping("/card/pay")
    @Operation(summary = "Thanh toán bằng Thẻ Quốc Tế (Stripe / Visa / Mastercard)", description = "Xử lý giao dịch thanh toán thẻ quốc tế và gạch nợ tự động")
    public ApiResponse<PaymentIntentResponse> payWithCard(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CardPaymentRequest request
    ) {
        return ApiResponse.success("Thanh toán thẻ thành công", paymentService.payWithCard(principal.getId(), request));
    }

    @GetMapping("/vietqr/{invoiceId}")
    @Operation(summary = "Sinh mã QR Chuyển khoản Ngân hàng VietQR Động", description = "Trả về thông tin số tài khoản, mã hóa đơn và ảnh mã QR VietQR")
    public ApiResponse<VietQrResponse> getVietQrPayment(@PathVariable UUID invoiceId) {
        return ApiResponse.success("Sinh mã VietQR thành công", paymentService.generateVietQrForInvoice(invoiceId));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Webhook Callback nhận thông báo thanh toán thành công", description = "Tự động gạch nợ hóa đơn và bắn Webhook invoice.paid cho Developer")
    public ApiResponse<PaymentIntentResponse> confirmPaymentWebhook(@RequestParam String transactionReference) {
        return ApiResponse.success("Xác nhận thanh toán thành công", paymentService.confirmPaymentWebhook(transactionReference));
    }

    @PostMapping("/vietqr/callback")
    @Operation(summary = "VietQR Bank Transfer Callback", description = "Nhận bản tin chuyển khoản ngân hàng, tự động nhận diện mã hóa đơn, gạch nợ và thông báo")
    public ApiResponse<PaymentIntentResponse> processVietQrCallback(@Valid @RequestBody com.saas.api.modules.payments.dto.request.VietQrCallbackRequest request) {
        return ApiResponse.success("Gạch nợ VietQR tự động thành công", paymentService.processVietQrCallback(request));
    }
}
