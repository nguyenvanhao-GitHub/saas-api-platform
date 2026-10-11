package com.saas.api.modules.invoices.service;

import com.saas.api.modules.invoices.domain.InvoiceEntity;

public interface PdfInvoiceService {

    byte[] generateInvoicePdf(InvoiceEntity invoice);

    String generateAndUploadInvoicePdf(InvoiceEntity invoice);
}
