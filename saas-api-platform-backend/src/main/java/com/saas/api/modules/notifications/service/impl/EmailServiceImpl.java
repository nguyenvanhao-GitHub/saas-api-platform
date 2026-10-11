package com.saas.api.modules.notifications.service.impl;

import com.saas.api.modules.notifications.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username:no-reply@saasplatform.com}")
    private String fromEmail;

    @Async
    @Override
    public void sendWelcomeEmail(String toEmail, String fullName, String apiKey) {
        try {
            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("apiKey", apiKey);
            context.setVariable("dashboardUrl", "http://localhost:4200/dashboard");

            String htmlContent = templateEngine.process("mail/welcome-email", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail.isEmpty() ? "no-reply@saasplatform.com" : fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🚀 Chào mừng bạn gia nhập SaaS API Platform");
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Welcome email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    @Override
    public void sendInvoicePaidEmail(String toEmail, String fullName, String invoiceNumber, BigDecimal amount, byte[] invoicePdfBytes) {
        try {
            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("invoiceNumber", invoiceNumber);
            context.setVariable("paidAt", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));
            context.setVariable("amountFormatted", String.format("$%.2f USD", amount != null ? amount.doubleValue() : 0.0));

            String htmlContent = templateEngine.process("mail/invoice-paid", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail.isEmpty() ? "no-reply@saasplatform.com" : fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("✅ Hóa đơn thanh toán thành công: " + invoiceNumber);
            helper.setText(htmlContent, true);

            if (invoicePdfBytes != null && invoicePdfBytes.length > 0) {
                helper.addAttachment("Invoice-" + invoiceNumber + ".pdf", new ByteArrayResource(invoicePdfBytes), "application/pdf");
            }

            mailSender.send(message);
            log.info("Invoice paid email with PDF attachment sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send invoice paid email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    @Override
    public void sendQuotaAlertEmail(String toEmail, String fullName, String productName, int currentUsage, int limit) {
        try {
            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("productName", productName);
            context.setVariable("currentUsage", currentUsage);
            context.setVariable("limit", limit);

            String htmlContent = templateEngine.process("mail/quota-alert", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail.isEmpty() ? "no-reply@saasplatform.com" : fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("⚠️ Cảnh báo: Sắp chạm hạn mức sử dụng API " + productName);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Quota alert email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send quota alert email to {}: {}", toEmail, e.getMessage());
        }
    }
}
