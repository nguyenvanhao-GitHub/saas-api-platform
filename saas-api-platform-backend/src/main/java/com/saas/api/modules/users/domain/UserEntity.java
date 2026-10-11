package com.saas.api.modules.users.domain;

import com.saas.api.core.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity extends BaseEntity {

    @Column(nullable = false, unique = true, length = 64)
    private String email;

    @Column(nullable = false, length = 128)
    private String passwordHash;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 32)
    @Builder.Default
    private String role = "ROLE_DEVELOPER"; // ROLE_DEVELOPER, ROLE_ADMIN

    @Column(unique = true, length = 64)
    private String apiKey;

    @Column(nullable = false, length = 32)
    @Builder.Default
    private String status = "ACTIVE";
}
