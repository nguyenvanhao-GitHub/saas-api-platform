package com.saas.api.modules.firewall.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFirewallRuleRequest {

    @NotBlank(message = "Loại quy tắc không được để trống")
    private String ruleType; // ALLOW, DENY

    @NotBlank(message = "Địa chỉ IP hoặc dải CIDR không được để trống")
    private String cidrIp; // e.g. 192.168.1.0/24

    private String description;
}