package com.saas.api.modules.firewall.dto;

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
public class IpFirewallRuleResponse {
    private UUID id;
    private String ruleType;
    private String cidrIp;
    private String description;
    private Boolean isActive;
    private Long blockedHits;
    private Instant createdAt;
}