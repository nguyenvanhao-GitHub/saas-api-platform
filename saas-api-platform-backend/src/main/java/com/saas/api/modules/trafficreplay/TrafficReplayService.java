package com.saas.api.modules.trafficreplay;

import java.util.List;
import java.util.UUID;

public interface TrafficReplayService {
    List<TrafficReplayJob> getAllJobs();
    TrafficReplayJob createAndRunJob(CreateReplayJobDto dto);
    void deleteJob(UUID id);
}