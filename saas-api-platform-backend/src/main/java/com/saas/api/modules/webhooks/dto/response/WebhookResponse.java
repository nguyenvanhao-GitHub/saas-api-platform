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
public class WebhookResponse {

    private UUID id;
    private String targetUrl;
    private String secretKey;
    private String events;
    private String status;
    private Instant createdAt;
}
