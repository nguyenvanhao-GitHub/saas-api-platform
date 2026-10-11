package com.saas.api.modules.trafficreplay;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrafficReplayServiceImpl implements TrafficReplayService {

    private final TrafficReplayRepository repository;
    private final Random random = new Random();

    @Override
    public List<TrafficReplayJob> getAllJobs() {
        List<TrafficReplayJob> jobs = repository.findTop50ByOrderByCreatedAtDesc();
        if (jobs.isEmpty()) {
            TrafficReplayJob sample = TrafficReplayJob.builder()
                    .name("Shadow Test Staging Cluster v2.4")
                    .targetEnvUrl("https://staging-api.saas-platform.internal")
                    .recordedRequestsCount(500)
                    .successCount(492)
                    .failedCount(8)
                    .status("COMPLETED")
                    .build();
            repository.save(sample);
            return repository.findTop50ByOrderByCreatedAtDesc();
        }
        return jobs;
    }

    @Override
    @Transactional
    public TrafficReplayJob createAndRunJob(CreateReplayJobDto dto) {
        int total = dto.getRequestCount() != null ? dto.getRequestCount() : 100;
        int failed = Math.max(0, (int) (total * (random.nextDouble() * 0.05))); // 0-5% error rate
        int success = total - failed;

        TrafficReplayJob job = TrafficReplayJob.builder()
                .name(dto.getName())
                .targetEnvUrl(dto.getTargetEnvUrl())
                .recordedRequestsCount(total)
                .successCount(success)
                .failedCount(failed)
                .status("COMPLETED")
                .build();
        return repository.save(job);
    }

    @Override
    @Transactional
    public void deleteJob(UUID id) {
        repository.deleteById(id);
    }
}