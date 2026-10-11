package com.saas.api.modules.teams.domain;

import com.saas.api.core.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "team_members")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberEntity extends BaseEntity {

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "invited_email", nullable = false)
    private String invitedEmail;

    @Column(name = "role", nullable = false, length = 30)
    @Builder.Default
    private String role = "DEVELOPER"; // OWNER, ADMIN, DEVELOPER, VIEWER

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "PENDING"; // ACTIVE, PENDING, REVOKED
}
