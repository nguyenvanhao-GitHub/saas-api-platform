package com.saas.api.modules.trafficreplay;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/traffic-replay")
@RequiredArgsConstructor
public class TrafficReplayController {

    private final TrafficReplayService service;

    @GetMapping
    public ResponseEntity<List<TrafficReplayJob>> getAllJobs() {
        return ResponseEntity.ok(service.getAllJobs());
    }

    @PostMapping
    public ResponseEntity<TrafficReplayJob> createJob(@Valid @RequestBody CreateReplayJobDto dto) {
        return ResponseEntity.ok(service.createAndRunJob(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable UUID id) {
        service.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}