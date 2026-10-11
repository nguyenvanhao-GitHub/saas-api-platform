package com.saas.api.modules.invoices.domain;

import com.saas.api.core.model.BaseEntity;
import com.saas.api.modules.users.domain.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceEntity extends BaseEntity {

    @Column(nullable = false, unique = true, length = 64)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "s3_pdf_url", length = 255)
    private String s3PdfUrl; // Đường dẫn hóa đơn PDF trên AWS S3 / MinIO

    @Column(nullable = false, length = 32)
    @Builder.Default
    private String status = "PAID"; // PENDING, PAID, FAILED
}
