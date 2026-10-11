package com.saas.api.modules.webhooks.repository;

import com.saas.api.modules.webhooks.domain.WebhookDeliveryLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WebhookDeliveryLogRepository extends JpaRepository<WebhookDeliveryLogEntity, UUID> {
    List<WebhookDeliveryLogEntity> findByEndpointIdOrderByCreatedAtDesc(UUID endpointId);
    List<WebhookDeliveryLogEntity> findTop20ByEndpointIdOrderByCreatedAtDesc(UUID endpointId);
}
