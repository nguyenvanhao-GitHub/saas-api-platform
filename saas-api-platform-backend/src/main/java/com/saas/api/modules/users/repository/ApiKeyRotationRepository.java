package com.saas.api.modules.users.repository;

import com.saas.api.modules.users.domain.ApiKeyRotationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApiKeyRotationRepository extends JpaRepository<ApiKeyRotationEntity, UUID> {

    List<ApiKeyRotationEntity> findByUserIdOrderByRotatedAtDesc(UUID userId);
}
