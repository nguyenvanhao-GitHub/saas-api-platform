package com.saas.api.modules.slaprobes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SlaProbeRepository extends JpaRepository<SlaProbe, UUID> {
    List<SlaProbe> findAllByOrderByCreatedAtDesc();
}