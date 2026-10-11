package com.saas.api.modules.users.domain;

import com.saas.api.core.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "api_key_rotations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiKeyRotationEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "old_api_key_masked", nullable = false, length = 64)
    private String oldApiKeyMasked;

    @Column(name = "reason", length = 255)
    @Builder.Default
    private String reason = "User requested key rotation";

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "rotated_at", nullable = false)
    @Builder.Default
    private Instant rotatedAt = Instant.now();
}
