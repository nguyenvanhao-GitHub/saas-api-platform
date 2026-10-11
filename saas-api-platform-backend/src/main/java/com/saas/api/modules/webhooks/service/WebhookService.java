package com.saas.api.modules.webhooks.service;

import com.saas.api.modules.webhooks.dto.request.CreateWebhookRequest;
import com.saas.api.modules.webhooks.dto.response.WebhookDeliveryLogResponse;
import com.saas.api.modules.webhooks.dto.response.WebhookResponse;

import java.util.List;
import java.util.UUID;

public interface WebhookService {

    WebhookResponse registerEndpoint(UUID userId, CreateWebhookRequest request);

    List<WebhookResponse> getUserEndpoints(UUID userId);

    void deleteEndpoint(UUID userId, UUID endpointId);

    WebhookDeliveryLogResponse testEndpoint(UUID userId, UUID endpointId);

    List<WebhookDeliveryLogResponse> getEndpointDeliveryLogs(UUID userId, UUID endpointId);

    void dispatchEventAsync(String eventType, Object payloadData);
}
