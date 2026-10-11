package com.saas.api.modules.tracing;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/traces")
@RequiredArgsConstructor
public class TraceController {

    private final TraceService service;

    @GetMapping
    public ResponseEntity<List<RequestTrace>> getRecentTraces() {
        return ResponseEntity.ok(service.getRecentTraces());
    }

    @GetMapping("/{traceId}/waterfall")
    public ResponseEntity<TraceWaterfallDto> getWaterfall(@PathVariable String traceId) {
        return ResponseEntity.ok(service.getTraceWaterfall(traceId));
    }
}