package com.saas.api.modules.trafficshaping;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/endpoint-policies")
@RequiredArgsConstructor
public class EndpointPolicyController {

    private final EndpointPolicyService service;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EndpointPolicy>> getAllPolicies() {
        return ResponseEntity.ok(service.getAllPolicies());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EndpointPolicy> createPolicy(@Valid @RequestBody CreateEndpointPolicyDto dto) {
        return ResponseEntity.ok(service.createPolicy(dto));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EndpointPolicy> togglePolicy(@PathVariable UUID id) {
        return ResponseEntity.ok(service.togglePolicy(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePolicy(@PathVariable UUID id) {
        service.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/mask-preview")
    public ResponseEntity<Map<String, String>> maskPreview(@RequestBody Map<String, String> body) {
        String raw = body.getOrDefault("payload", "");
        String masked = service.maskPiiData(raw);
        return ResponseEntity.ok(Map.of("raw", raw, "masked", masked));
    }
}