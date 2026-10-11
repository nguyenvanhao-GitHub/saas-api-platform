package com.saas.api.modules.payments.repository;

import com.saas.api.modules.payments.domain.PaymentTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransactionEntity, UUID> {
    Optional<PaymentTransactionEntity> findByTransactionReference(String transactionReference);
    List<PaymentTransactionEntity> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
