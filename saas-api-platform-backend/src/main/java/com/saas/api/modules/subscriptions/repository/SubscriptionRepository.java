package com.saas.api.modules.subscriptions.repository;

import com.saas.api.modules.subscriptions.domain.SubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity, UUID> {
    List<SubscriptionEntity> findByUserId(UUID userId);

    @Query("SELECT s FROM SubscriptionEntity s JOIN FETCH s.product WHERE s.user.id = :userId AND s.status = 'ACTIVE'")
    List<SubscriptionEntity> findActiveSubscriptionsByUserIdWithProduct(@Param("userId") UUID userId);

    Optional<SubscriptionEntity> findByUserIdAndProductId(UUID userId, UUID productId);
}
