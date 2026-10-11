package com.saas.api.modules.invoices.dto.response;

import com.saas.api.modules.users.dto.response.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {

    private UUID id;
    private String invoiceNumber;
    private UserResponse user;
    private BigDecimal amount;
    private String s3PdfUrl;
    private String status;
    private Instant createdAt;
}
