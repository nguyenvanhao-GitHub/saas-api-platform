package com.saas.api.modules.teams.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberResponse {
    private UUID id;
    private UUID organizationId;
    private UUID userId;
    private String invitedEmail;
    private String role;
    private String status;
    private Instant createdAt;
}
