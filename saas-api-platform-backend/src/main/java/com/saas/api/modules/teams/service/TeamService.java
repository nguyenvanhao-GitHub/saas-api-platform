package com.saas.api.modules.teams.service;

import com.saas.api.modules.teams.dto.OrganizationResponse;
import com.saas.api.modules.teams.dto.TeamInviteRequest;
import com.saas.api.modules.teams.dto.TeamMemberResponse;

import java.util.UUID;

public interface TeamService {
    OrganizationResponse getMyOrganization(UUID userId, String userEmail);
    TeamMemberResponse inviteMember(UUID userId, String userEmail, TeamInviteRequest request);
    TeamMemberResponse updateMemberRole(UUID userId, UUID memberId, String newRole);
    void removeMember(UUID userId, UUID memberId);
}
