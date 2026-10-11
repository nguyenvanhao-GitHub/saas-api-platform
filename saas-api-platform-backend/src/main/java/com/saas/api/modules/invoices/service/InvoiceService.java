package com.saas.api.modules.invoices.service;

import com.saas.api.core.model.PageResponse;
import com.saas.api.modules.invoices.dto.response.InvoiceResponse;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface InvoiceService {

    InvoiceResponse createInvoice(UUID userId, BigDecimal amount);

    InvoiceResponse generateInvoiceFromUsage(UUID userId);

    List<InvoiceResponse> getUserInvoices(UUID userId);

    PageResponse<InvoiceResponse> getAllInvoices(Pageable pageable);

    InvoiceResponse payInvoice(UUID userId, UUID invoiceId);

    byte[] getInvoicePdfBytes(UUID userId, UUID invoiceId);

    void sendInvoiceEmailAsync(String toEmail, String invoiceNo, BigDecimal amount, String pdfUrl);
}
