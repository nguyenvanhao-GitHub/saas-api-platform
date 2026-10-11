package com.saas.api.modules.webhooks.dto.response;

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
    private String eventType;
    private String payload;
    private Integer responseStatus;
    private String responseBody;
    private Long latencyMs;
    private Integer retryCount;
    private String status;
    private boolean success;
    private Instant createdAt;
}
