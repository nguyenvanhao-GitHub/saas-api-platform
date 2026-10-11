package com.saas.api.modules.firewall.service;

import com.saas.api.modules.firewall.dto.CreateFirewallRuleRequest;
import com.saas.api.modules.firewall.dto.IpFirewallRuleResponse;

import java.util.List;
import java.util.UUID;

public interface IpFirewallService {
    List<IpFirewallRuleResponse> getAllRules();
    IpFirewallRuleResponse createRule(CreateFirewallRuleRequest request);
    IpFirewallRuleResponse toggleRule(UUID id);
    void deleteRule(UUID id);
    boolean isIpBlocked(String clientIp);
}