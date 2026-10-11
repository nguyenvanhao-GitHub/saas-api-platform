package com.saas.api.modules.analytics.service;

import com.saas.api.modules.analytics.dto.AnalyticsOverviewDto;

import java.util.UUID;

public interface AnalyticsService {
    AnalyticsOverviewDto getDeveloperAnalytics(UUID userId);
}
