package com.saas.api.modules.audit.domain;

import com.saas.api.core.model.BaseEntity;
import com.saas.api.modules.users.domain.UserEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(length = 64)
    private String userEmail;

    @Column(nullable = false, length = 64)
    private String action;

    @Column(nullable = false, length = 64)
    private String resourceType;

    @Column(length = 64)
    private String resourceId;

    @Column(length = 45)
    private String clientIp;

    @Column(length = 255)
    private String userAgent;

    @Column(columnDefinition = "TEXT")
    private String description;
}
