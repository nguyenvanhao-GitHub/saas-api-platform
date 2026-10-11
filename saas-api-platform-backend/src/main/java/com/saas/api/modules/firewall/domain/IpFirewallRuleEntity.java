package com.saas.api.modules.firewall.domain;

import com.saas.api.core.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "ip_firewall_rules")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IpFirewallRuleEntity extends BaseEntity {

    @Column(name = "rule_type", nullable = false, length = 20)
    @Builder.Default
    private String ruleType = "DENY"; // ALLOW, DENY

    @Column(name = "cidr_ip", nullable = false, length = 50)
    private String cidrIp; // e.g. 192.168.1.0/24 or 203.0.113.5/32

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "blocked_hits", nullable = false)
    @Builder.Default
    private Long blockedHits = 0L;
}