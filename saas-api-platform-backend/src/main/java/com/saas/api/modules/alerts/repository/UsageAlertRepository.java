package com.saas.api.modules.alerts.repository;

import com.saas.api.modules.alerts.domain.UsageAlertEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UsageAlertRepository extends JpaRepository<UsageAlertEntity, UUID> {
    List<UsageAlertEntity> findByUserIdAndIsDeletedFalse(UUID userId);
}
