package com.saas.api.modules.notifications.service;

import java.math.BigDecimal;

public interface EmailService {

    void sendWelcomeEmail(String toEmail, String fullName, String apiKey);

    void sendInvoicePaidEmail(String toEmail, String fullName, String invoiceNumber, BigDecimal amount, byte[] invoicePdfBytes);

    void sendQuotaAlertEmail(String toEmail, String fullName, String productName, int currentUsage, int limit);
}
