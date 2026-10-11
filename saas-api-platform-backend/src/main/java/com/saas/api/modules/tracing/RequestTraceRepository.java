package com.saas.api.modules.tracing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RequestTraceRepository extends JpaRepository<RequestTrace, UUID> {
    List<RequestTrace> findTop50ByOrderByTimestampDesc();
    List<RequestTrace> findByTraceIdOrderByTimestampAsc(String traceId);
}