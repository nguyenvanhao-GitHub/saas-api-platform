package com.saas.api.modules.aicopilot.repository;

import com.saas.api.modules.aicopilot.domain.AiChatLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AiChatLogRepository extends JpaRepository<AiChatLogEntity, UUID> {
    List<AiChatLogEntity> findTop20ByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(UUID userId);
}