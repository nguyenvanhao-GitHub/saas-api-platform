package com.saas.api.modules.usage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsageStatsResponse {

    private UUID userId;
    private String email;
    private String apiKey;
    private long totalRequestsUsed;
    private long requestsThisMinute;
    private int rateLimitPerMinute;
    private long remainingQuotaThisMinute;
}
