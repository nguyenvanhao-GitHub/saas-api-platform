package com.saas.api.modules.subscriptions.domain;

import com.saas.api.core.model.BaseEntity;
import com.saas.api.modules.apiproducts.domain.ApiProductEntity;
import com.saas.api.modules.users.domain.UserEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private ApiProductEntity product;

    @Column(nullable = false, length = 32)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, CANCELLED

    @Column(nullable = false)
    @Builder.Default
    private long totalRequestsUsed = 0;
}
