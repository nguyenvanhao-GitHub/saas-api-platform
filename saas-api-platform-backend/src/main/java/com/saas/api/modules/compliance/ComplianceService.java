package com.saas.api.modules.compliance;

import java.util.Map;
import java.util.UUID;

public interface ComplianceService {
    Map<String, Object> exportUserData(UUID userId);
    Map<String, String> requestDataDeletion(UUID userId);
}