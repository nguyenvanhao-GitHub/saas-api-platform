package com.saas.api.modules.slaprobes;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sla-probes")
@RequiredArgsConstructor
public class SlaProbeController {

    private final SlaProbeService service;

    @GetMapping
    public ResponseEntity<List<SlaProbe>> getAllProbes() {
        return ResponseEntity.ok(service.getAllProbes());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SlaProbe> createProbe(@Valid @RequestBody CreateSlaProbeDto dto) {
        return ResponseEntity.ok(service.createProbe(dto));
    }

    @PostMapping("/{id}/ping")
    public ResponseEntity<SlaProbe> pingProbe(@PathVariable UUID id) {
        return ResponseEntity.ok(service.pingProbe(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProbe(@PathVariable UUID id) {
        service.deleteProbe(id);
        return ResponseEntity.noContent().build();
    }
}