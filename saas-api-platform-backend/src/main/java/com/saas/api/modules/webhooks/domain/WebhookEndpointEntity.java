package com.saas.api.modules.webhooks.domain;

import com.saas.api.core.model.BaseEntity;
import com.saas.api.modules.users.domain.UserEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "webhook_endpoints")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebhookEndpointEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false, length = 255)
    private String targetUrl;

    @Column(nullable = false, length = 64)
    private String secretKey;

    @Column(nullable = false, length = 255)
    @Builder.Default
    private String events = "invoice.paid,subscription.created";

    @Column(nullable = false, length = 32)
    @Builder.Default
    private String status = "ACTIVE";
}
