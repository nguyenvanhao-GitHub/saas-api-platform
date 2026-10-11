package com.saas.api.modules.auth.repository;

import com.saas.api.modules.auth.domain.ApiKeyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKeyEntity, UUID> {
    List<ApiKeyEntity> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(UUID userId);
    Optional<ApiKeyEntity> findByApiKeyAndIsDeletedFalse(String apiKey);
    Optional<ApiKeyEntity> findByIdAndUserIdAndIsDeletedFalse(UUID id, UUID userId);
    long countByUserIdAndIsDeletedFalse(UUID userId);
}
