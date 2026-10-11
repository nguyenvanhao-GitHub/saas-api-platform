package com.saas.api.modules.teams.repository;

import com.saas.api.modules.teams.domain.TeamMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMemberEntity, UUID> {
    List<TeamMemberEntity> findByOrganizationIdAndIsDeletedFalse(UUID organizationId);
    Optional<TeamMemberEntity> findByOrganizationIdAndInvitedEmailAndIsDeletedFalse(UUID organizationId, String email);
}
