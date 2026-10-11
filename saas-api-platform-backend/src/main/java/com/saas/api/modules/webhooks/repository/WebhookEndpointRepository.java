package com.saas.api.modules.webhooks.repository;

import com.saas.api.modules.webhooks.domain.WebhookEndpointEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WebhookEndpointRepository extends JpaRepository<WebhookEndpointEntity, UUID> {
    List<WebhookEndpointEntity> findByUserIdAndIsDeletedFalse(UUID userId);
    List<WebhookEndpointEntity> findByStatusAndIsDeletedFalse(String status);
}
