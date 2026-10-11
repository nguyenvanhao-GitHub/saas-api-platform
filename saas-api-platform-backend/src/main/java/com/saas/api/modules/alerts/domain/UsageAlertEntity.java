package com.saas.api.modules.alerts.domain;

import com.saas.api.core.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "usage_alerts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsageAlertEntity extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "threshold_percentage", nullable = false)
    @Builder.Default
    private Integer thresholdPercentage = 80;

    @Column(name = "channel", nullable = false, length = 30)
    @Builder.Default
    private String channel = "IN_APP"; // IN_APP, EMAIL, SLACK, DISCORD

    @Column(name = "destination", length = 500)
    private String destination;

    @Column(name = "is_triggered", nullable = false)
    @Builder.Default
    private Boolean isTriggered = false;

    @Column(name = "last_triggered_at")
    private Instant lastTriggeredAt;
}
