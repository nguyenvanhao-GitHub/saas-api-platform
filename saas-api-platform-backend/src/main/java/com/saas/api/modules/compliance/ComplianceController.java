package com.saas.api.modules.compliance;

import com.saas.api.modules.users.domain.UserEntity;
import com.saas.api.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/compliance")
@RequiredArgsConstructor
public class ComplianceController {

    private final ComplianceService service;
    private final UserRepository userRepository;

    @GetMapping("/export")
    public ResponseEntity<Map<String, Object>> exportMyData(Authentication auth) {
        UUID userId = resolveUserId(auth);
        return ResponseEntity.ok(service.exportUserData(userId));
    }

    @PostMapping("/request-deletion")
    public ResponseEntity<Map<String, String>> requestDeletion(Authentication auth) {
        UUID userId = resolveUserId(auth);
        return ResponseEntity.ok(service.requestDataDeletion(userId));
    }

    private UUID resolveUserId(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return userRepository.findAll().stream().findFirst().map(UserEntity::getId).orElse(UUID.randomUUID());
        }
        return userRepository.findByEmail(auth.getName())
                .map(UserEntity::getId)
                .orElseGet(() -> userRepository.findAll().stream().findFirst().map(UserEntity::getId).orElse(UUID.randomUUID()));
    }
}