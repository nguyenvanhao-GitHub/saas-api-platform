package com.saas.api.modules.teams.repository;

import com.saas.api.modules.teams.domain.OrganizationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrganizationRepository extends JpaRepository<OrganizationEntity, UUID> {
    Optional<OrganizationEntity> findByOwnerIdAndIsDeletedFalse(UUID ownerId);
    Optional<OrganizationEntity> findBySlugAndIsDeletedFalse(String slug);
}
