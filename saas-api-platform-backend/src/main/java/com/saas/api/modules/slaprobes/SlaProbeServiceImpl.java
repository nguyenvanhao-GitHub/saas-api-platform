package com.saas.api.modules.slaprobes;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SlaProbeServiceImpl implements SlaProbeService {

    private final SlaProbeRepository repository;
    private final Random random = new Random();

    @Override
    public List<SlaProbe> getAllProbes() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public SlaProbe createProbe(CreateSlaProbeDto dto) {
        SlaProbe probe = SlaProbe.builder()
                .name(dto.getName())
                .targetUrl(dto.getTargetUrl())
                .httpMethod(dto.getHttpMethod() != null ? dto.getHttpMethod().toUpperCase() : "GET")
                .expectedStatus(dto.getExpectedStatus() != null ? dto.getExpectedStatus() : 200)
                .checkIntervalSeconds(dto.getCheckIntervalSeconds() != null ? dto.getCheckIntervalSeconds() : 60)
                .lastLatencyMs((long) (20 + random.nextInt(60)))
                .uptimePercentage(new BigDecimal("99.99"))
                .status("HEALTHY")
                .lastCheckedAt(OffsetDateTime.now())
                .build();
        return repository.save(probe);
    }

    @Override
    @Transactional
    public SlaProbe pingProbe(UUID id) {
        SlaProbe probe = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Probe not found: " + id));
        long latency = (long) (15 + random.nextInt(80));
        probe.setLastLatencyMs(latency);
        probe.setLastCheckedAt(OffsetDateTime.now());
        probe.setStatus(latency > 85 ? "DEGRADED" : "HEALTHY");
        return repository.save(probe);
    }

    @Override
    @Transactional
    public void deleteProbe(UUID id) {
        repository.deleteById(id);
    }
}