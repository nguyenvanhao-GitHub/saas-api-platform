package com.saas.api.modules.alerts.service;

import com.saas.api.modules.alerts.dto.CreateAlertRequest;
import com.saas.api.modules.alerts.dto.UsageAlertResponse;

import java.util.List;
import java.util.UUID;

public interface UsageAlertService {
    List<UsageAlertResponse> getMyAlerts(UUID userId);
    UsageAlertResponse createAlert(UUID userId, CreateAlertRequest request);
    void deleteAlert(UUID userId, UUID alertId);
    void testAlert(UUID userId, UUID alertId);
    void checkAndTriggerAlerts(UUID userId, double percentageUsed, long currentRequests, long limit);
}
