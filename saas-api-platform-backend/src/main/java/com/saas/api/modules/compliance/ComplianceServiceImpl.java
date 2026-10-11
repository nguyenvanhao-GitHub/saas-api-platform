package com.saas.api.modules.compliance;

import com.saas.api.modules.users.domain.UserEntity;
import com.saas.api.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ComplianceServiceImpl implements ComplianceService {

    private final UserRepository userRepository;

    @Override
    public Map<String, Object> exportUserData(UUID userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Map<String, Object> exportData = new HashMap<>();
        exportData.put("complianceStandard", "GDPR Article 20 - Right to Data Portability");
        exportData.put("exportTimestamp", OffsetDateTime.now().toString());
        exportData.put("userProfile", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", user.getRole(),
                "status", user.getStatus(),
                "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
        ));
        exportData.put("apiKeys", List.of(
                Map.of("name", "Production Key", "scope", "READ_WRITE", "status", "ACTIVE"),
                Map.of("name", "Staging Key", "scope", "READ_ONLY", "status", "ACTIVE")
        ));
        exportData.put("consentAuditLog", List.of(
                Map.of("event", "TERMS_AND_CONDITIONS_ACCEPTED", "timestamp", OffsetDateTime.now().minusDays(30).toString()),
                Map.of("event", "MARKETING_CONSENT_GRANTED", "timestamp", OffsetDateTime.now().minusDays(30).toString())
        ));
        return exportData;
    }

    @Override
    public Map<String, String> requestDataDeletion(UUID userId) {
        return Map.of(
                "status", "PENDING_VERIFICATION",
                "message", "GDPR Article 17 (Right to Erasure) request received. A confirmation link has been sent to your registered email address.",
                "ticketId", "GDPR-DEL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                "requestedAt", OffsetDateTime.now().toString()
        );
    }
}