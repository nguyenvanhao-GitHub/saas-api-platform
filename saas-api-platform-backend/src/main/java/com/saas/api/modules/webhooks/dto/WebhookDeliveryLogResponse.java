package com.saas.api.modules.webhooks.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebhookDeliveryLogResponse {
    private UUID id;
    private UUID webhookId;
    private String eventType;
    private String payload;
    private String endpointUrl;
    private Integer httpStatus;
    private String responseBody;
    private Long latencyMs;
    private Integer retryCount;
    private String status;
    private Instant createdAt;
}
