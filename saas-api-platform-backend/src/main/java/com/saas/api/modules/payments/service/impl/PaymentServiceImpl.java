package com.saas.api.modules.payments.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.modules.invoices.domain.InvoiceEntity;
import com.saas.api.modules.invoices.repository.InvoiceRepository;
import com.saas.api.modules.payments.domain.PaymentTransactionEntity;
import com.saas.api.modules.payments.dto.request.CardPaymentRequest;
import com.saas.api.modules.payments.dto.request.PaymentIntentRequest;
import com.saas.api.modules.payments.dto.response.PaymentIntentResponse;
import com.saas.api.modules.payments.dto.response.VietQrResponse;
import com.saas.api.modules.payments.repository.PaymentTransactionRepository;
import com.saas.api.modules.payments.service.PaymentService;
import com.saas.api.modules.users.domain.UserEntity;
import com.saas.api.modules.users.repository.UserRepository;
import com.saas.api.modules.webhooks.service.WebhookService;
import com.saas.api.modules.invoices.service.PdfInvoiceService;
import com.saas.api.modules.notifications.service.EmailService;
import com.saas.api.modules.notifications.service.NotificationService;
import com.saas.api.modules.payments.dto.request.VietQrCallbackRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentTransactionRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final WebhookService webhookService;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final PdfInvoiceService pdfInvoiceService;

    @Override
    @Transactional
    public PaymentIntentResponse createPaymentIntent(UUID userId, PaymentIntentRequest request) {
        log.info("Tạo Payment Intent cho Hóa đơn {} của User {}", request.getInvoiceId(), userId);

        UserEntity user = userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy User"));

        InvoiceEntity invoice = invoiceRepository.findById(request.getInvoiceId())
                .filter(i -> i.getUser().getId().equals(userId))
                .orElseThrow(() -> new BusinessException(ErrorCode.INVOICE_NOT_FOUND));

        String txRef = "pi_" + UUID.randomUUID().toString().replace("-", "");
        String clientSecret = txRef + "_secret_" + UUID.randomUUID().toString().substring(0, 8);
        String mockPaymentUrl = "https://checkout.saas-platform.com/pay/" + txRef;

        PaymentTransactionEntity transaction = PaymentTransactionEntity.builder()
                .user(user)
                .invoice(invoice)
                .paymentMethod(request.getPaymentMethod())
                .amount(invoice.getAmount())
                .currency("USD")
                .transactionReference(txRef)
                .status("PENDING")
                .paymentGatewayResponse("{\"client_secret\": \"" + clientSecret + "\"}")
                .build();

        PaymentTransactionEntity saved = paymentRepository.save(transaction);

        return PaymentIntentResponse.builder()
                .transactionId(saved.getId())
                .transactionReference(txRef)
                .invoiceId(invoice.getId())
                .amount(invoice.getAmount())
                .currency("USD")
                .clientSecret(clientSecret)
                .paymentUrl(mockPaymentUrl)
                .status("PENDING")
                .build();
    }

    @Override
    @Transactional
    public PaymentIntentResponse payWithCard(UUID userId, CardPaymentRequest request) {
        log.info("Xử lý thanh toán thẻ Quốc Tế (Stripe / Visa / Mastercard) cho Hóa đơn {}", request.getInvoiceId());

        UserEntity user = userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHENTICATED, "User không tồn tại"));

        InvoiceEntity invoice = invoiceRepository.findById(request.getInvoiceId())
                .filter(i -> !i.isDeleted())
                .filter(i -> i.getUser().getId().equals(userId))
                .orElseThrow(() -> new BusinessException(ErrorCode.INVOICE_NOT_FOUND));

        if ("PAID".equals(invoice.getStatus())) {
            throw new BusinessException(ErrorCode.INVALID_KEY, "Hóa đơn này đã được thanh toán trước đó");
        }

        String txRef = "ch_" + UUID.randomUUID().toString().replace("-", "");
        String maskedCard = request.getCardNumber().length() > 4 
                ? "**** **** **** " + request.getCardNumber().substring(request.getCardNumber().length() - 4) 
                : "**** 4242";

        PaymentTransactionEntity transaction = PaymentTransactionEntity.builder()
                .user(user)
                .invoice(invoice)
                .paymentMethod("STRIPE_CARD")
                .amount(invoice.getAmount())
                .currency("USD")
                .transactionReference(txRef)
                .status("SUCCESS")
                .paymentGatewayResponse(String.format("{\"stripe_charge_id\": \"%s\", \"card_holder\": \"%s\", \"card_last4\": \"%s\", \"paid\": true}",
                        txRef, request.getCardHolder(), maskedCard))
                .build();

        paymentRepository.save(transaction);

        invoice.setStatus("PAID");
        invoiceRepository.save(invoice);

        // Bắn Webhook Event "invoice.paid"
        webhookService.dispatchEventAsync("invoice.paid", Map.of(
                "invoiceNumber", invoice.getInvoiceNumber(),
                "amount", invoice.getAmount(),
                "status", "PAID",
                "paymentMethod", "STRIPE_CREDIT_CARD",
                "card", maskedCard,
                "transactionReference", txRef
        ));

        // Gửi In-App Notification
        notificationService.createNotification(
                user.getId(),
                "Thanh toán Thẻ Quốc Tế thành công",
                "Hóa đơn " + invoice.getInvoiceNumber() + " ($" + invoice.getAmount() + " USD) đã được thanh toán thành công qua thẻ " + maskedCard + ".",
                "BILLING"
        );

        // Gửi Email hóa đơn kèm PDF đính kèm
        try {
            byte[] pdfBytes = pdfInvoiceService.generateInvoicePdf(invoice);
            emailService.sendInvoicePaidEmail(user.getEmail(), user.getFullName(), invoice.getInvoiceNumber(), invoice.getAmount(), pdfBytes);
        } catch (Exception e) {
            log.warn("Failed to dispatch card invoice email: {}", e.getMessage());
        }

        return PaymentIntentResponse.builder()
                .transactionId(transaction.getId())
                .transactionReference(txRef)
                .invoiceId(invoice.getId())
                .amount(transaction.getAmount())
                .currency("USD")
                .status("SUCCESS")
                .build();
    }

    @Override
    @Transactional
    public PaymentIntentResponse confirmPaymentWebhook(String transactionReference) {
        log.info("Nhận Webhook Callback thanh toán thành công cho mã giao dịch: {}", transactionReference);

        PaymentTransactionEntity transaction = paymentRepository.findByTransactionReference(transactionReference)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy giao dịch thanh toán"));

        transaction.setStatus("SUCCESS");
        transaction.setPaymentGatewayResponse("{\"paid\": true, \"settled_at\": \"" + System.currentTimeMillis() + "\"}");
        paymentRepository.save(transaction);

        InvoiceEntity invoice = transaction.getInvoice();
        if (invoice != null) {
            invoice.setStatus("PAID");
            invoiceRepository.save(invoice);

            // Bắn Webhook Event "invoice.paid" tự động cho Developer
            webhookService.dispatchEventAsync("invoice.paid", Map.of(
                    "invoiceNumber", invoice.getInvoiceNumber(),
                    "amount", invoice.getAmount(),
                    "status", "PAID",
                    "transactionReference", transactionReference
            ));

            // Gửi In-App Notification cho người dùng
            notificationService.createNotification(
                    invoice.getUser().getId(),
                    "Hóa đơn đã được thanh toán",
                    "Hóa đơn " + invoice.getInvoiceNumber() + " số tiền " + invoice.getAmount() + " USD đã được thanh toán thành công qua " + transaction.getPaymentMethod() + ".",
                    "BILLING"
            );

            // Gửi Email hóa đơn kèm PDF đính kèm
            try {
                byte[] pdfBytes = pdfInvoiceService.generateInvoicePdf(invoice);
                emailService.sendInvoicePaidEmail(invoice.getUser().getEmail(), invoice.getUser().getFullName(), invoice.getInvoiceNumber(), invoice.getAmount(), pdfBytes);
            } catch (Exception e) {
                log.warn("Failed to dispatch invoice email: {}", e.getMessage());
            }
        }

        return PaymentIntentResponse.builder()
                .transactionId(transaction.getId())
                .transactionReference(transactionReference)
                .invoiceId(invoice != null ? invoice.getId() : null)
                .amount(transaction.getAmount())
                .currency(transaction.getCurrency())
                .status("SUCCESS")
                .build();
    }

    @Override
    @Transactional
    public PaymentIntentResponse processVietQrCallback(VietQrCallbackRequest request) {
        log.info("Nhận VietQR Bank Transfer Callback: ref={}, amount={}, content={}",
                request.getTransactionReference(), request.getAmount(), request.getContent());

        // Phân tích nội dung chuyển khoản để tìm mã hóa đơn (ví dụ: SAAS INV-2026-0001 hoặc INV-2026-0001)
        String content = request.getContent() != null ? request.getContent().toUpperCase() : "";
        Pattern pattern = Pattern.compile("INV-[0-9]{4}-[0-9]+");
        Matcher matcher = pattern.matcher(content);

        String invoiceNumber = null;
        if (matcher.find()) {
            invoiceNumber = matcher.group();
        } else if (content.contains("INV-")) {
            invoiceNumber = content.substring(content.indexOf("INV-")).trim();
        }

        if (invoiceNumber == null) {
            throw new BusinessException(ErrorCode.INVALID_KEY, "Không nhận diện được mã hóa đơn trong nội dung chuyển khoản: " + content);
        }

        final String finalInvoiceNumber = invoiceNumber;
        InvoiceEntity invoice = invoiceRepository.findByInvoiceNumberAndIsDeletedFalse(finalInvoiceNumber)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVOICE_NOT_FOUND, "Không tìm thấy hóa đơn khớp với nội dung chuyển khoản: " + finalInvoiceNumber));

        String txRef = request.getTransactionReference() != null ? request.getTransactionReference() : "vietqr_" + UUID.randomUUID().toString().substring(0, 12);

        PaymentTransactionEntity transaction = PaymentTransactionEntity.builder()
                .user(invoice.getUser())
                .invoice(invoice)
                .paymentMethod("VIETQR_BANK_TRANSFER")
                .amount(invoice.getAmount())
                .currency("VND")
                .transactionReference(txRef)
                .status("SUCCESS")
                .paymentGatewayResponse(String.format("{\"bank\": \"%s\", \"rawContent\": \"%s\", \"receivedAmount\": %s}",
                        request.getBankName(), request.getContent(), request.getAmount()))
                .build();

        paymentRepository.save(transaction);

        invoice.setStatus("PAID");
        invoiceRepository.save(invoice);

        // Bắn Webhook Event "invoice.paid"
        webhookService.dispatchEventAsync("invoice.paid", Map.of(
                "invoiceNumber", invoice.getInvoiceNumber(),
                "amount", invoice.getAmount(),
                "status", "PAID",
                "paymentMethod", "VIETQR",
                "transactionReference", txRef
        ));

        // Gửi Notification & Email kèm PDF
        notificationService.createNotification(
                invoice.getUser().getId(),
                "Thanh toán VietQR thành công",
                "Hóa đơn " + invoice.getInvoiceNumber() + " đã được gạch nợ tự động thành công qua VietQR.",
                "BILLING"
        );

        try {
            byte[] pdfBytes = pdfInvoiceService.generateInvoicePdf(invoice);
            emailService.sendInvoicePaidEmail(invoice.getUser().getEmail(), invoice.getUser().getFullName(), invoice.getInvoiceNumber(), invoice.getAmount(), pdfBytes);
        } catch (Exception e) {
            log.warn("Failed to dispatch VietQR invoice email: {}", e.getMessage());
        }

        return PaymentIntentResponse.builder()
                .transactionId(transaction.getId())
                .transactionReference(txRef)
                .invoiceId(invoice.getId())
                .amount(invoice.getAmount())
                .currency("VND")
                .status("SUCCESS")
                .build();
    }

    @Override
    public VietQrResponse generateVietQrForInvoice(UUID invoiceId) {
        InvoiceEntity invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVOICE_NOT_FOUND));

        long amountVnd = invoice.getAmount().multiply(BigDecimal.valueOf(25450)).longValue();
        String bankId = "vietcombank";
        String bankName = "Vietcombank (Ngân hàng Ngoại thương Việt Nam)";
        String accountNumber = "9988776655";
        String accountHolderName = "SMARTGATE SAAS PLATFORM";
        String memo = invoice.getInvoiceNumber();

        String qrImageUrl = String.format(
                "https://img.vietqr.io/image/%s-%s-compact2.png?amount=%d&addInfo=%s&accountName=%s",
                bankId, accountNumber, amountVnd, memo, accountHolderName.replace(" ", "%20")
        );

        String deepLink = String.format(
                "https://api.vietqr.io/v2/pay?bank=%s&acc=%s&amount=%d&desc=%s",
                bankId, accountNumber, amountVnd, memo
        );

        return VietQrResponse.builder()
                .invoiceNumber(invoice.getInvoiceNumber())
                .amountUsd(invoice.getAmount())
                .amountVnd(amountVnd)
                .bankId(bankId)
                .bankName(bankName)
                .accountNumber(accountNumber)
                .accountHolderName(accountHolderName)
                .transferMemo(memo)
                .qrImageUrl(qrImageUrl)
                .quickPaymentDeepLink(deepLink)
                .build();
    }
}
