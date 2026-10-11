package com.saas.api.modules.mockapis.repository;

import com.saas.api.modules.mockapis.domain.MockEndpointEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MockEndpointRepository extends JpaRepository<MockEndpointEntity, UUID> {
    List<MockEndpointEntity> findByUserIdAndIsDeletedFalse(UUID userId);
    Optional<MockEndpointEntity> findByUserIdAndPathAndHttpMethodAndIsDeletedFalse(UUID userId, String path, String httpMethod);
    Optional<MockEndpointEntity> findFirstByPathAndHttpMethodAndIsActiveTrueAndIsDeletedFalse(String path, String httpMethod);
}