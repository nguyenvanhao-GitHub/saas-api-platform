package com.saas.api.modules.invoices.repository;

import com.saas.api.modules.invoices.domain.InvoiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<InvoiceEntity, UUID> {
    List<InvoiceEntity> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<InvoiceEntity> findByInvoiceNumberAndIsDeletedFalse(String invoiceNumber);
}
