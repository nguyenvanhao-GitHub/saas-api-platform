package com.saas.api.modules.usage.service;

import com.saas.api.modules.usage.dto.response.UsageStatsResponse;

import java.util.Map;
import java.util.UUID;

public interface UsageService {

    Map<String, Object> recordAndRateLimitApiUsage(String apiKey, String endpoint);

    UsageStatsResponse getUserStats(UUID userId);
}
