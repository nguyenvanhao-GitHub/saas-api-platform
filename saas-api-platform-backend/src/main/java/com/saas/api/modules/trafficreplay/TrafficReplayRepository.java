package com.saas.api.modules.trafficreplay;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrafficReplayRepository extends JpaRepository<TrafficReplayJob, UUID> {
    List<TrafficReplayJob> findTop50ByOrderByCreatedAtDesc();
}