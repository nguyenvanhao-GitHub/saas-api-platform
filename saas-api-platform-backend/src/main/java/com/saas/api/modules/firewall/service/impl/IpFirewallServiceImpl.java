package com.saas.api.modules.firewall.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.modules.firewall.domain.IpFirewallRuleEntity;
import com.saas.api.modules.firewall.dto.CreateFirewallRuleRequest;
import com.saas.api.modules.firewall.dto.IpFirewallRuleResponse;
import com.saas.api.modules.firewall.repository.IpFirewallRuleRepository;
import com.saas.api.modules.firewall.service.IpFirewallService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class IpFirewallServiceImpl implements IpFirewallService {

    private final IpFirewallRuleRepository ipFirewallRuleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<IpFirewallRuleResponse> getAllRules() {
        return ipFirewallRuleRepository.findByIsDeletedFalseOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public IpFirewallRuleResponse createRule(CreateFirewallRuleRequest request) {
        IpFirewallRuleEntity entity = IpFirewallRuleEntity.builder()
                .ruleType(request.getRuleType().toUpperCase())
                .cidrIp(request.getCidrIp().trim())
                .description(request.getDescription())
                .isActive(true)
                .blockedHits(0L)
                .build();

        return mapToResponse(ipFirewallRuleRepository.save(entity));
    }

    @Override
    @Transactional
    public IpFirewallRuleResponse toggleRule(UUID id) {
        IpFirewallRuleEntity entity = ipFirewallRuleRepository.findById(id)
                .filter(r -> !r.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy luật tường lửa"));

        entity.setIsActive(!Boolean.TRUE.equals(entity.getIsActive()));
        return mapToResponse(ipFirewallRuleRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteRule(UUID id) {
        IpFirewallRuleEntity entity = ipFirewallRuleRepository.findById(id)
                .filter(r -> !r.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy luật tường lửa"));

        entity.setDeleted(true);
        ipFirewallRuleRepository.save(entity);
    }

    @Override
    @Transactional
    public boolean isIpBlocked(String clientIp) {
        if (clientIp == null || clientIp.isBlank()) return false;

        List<IpFirewallRuleEntity> rules = ipFirewallRuleRepository.findByIsDeletedFalseOrderByCreatedAtDesc();
        for (IpFirewallRuleEntity rule : rules) {
            if (Boolean.TRUE.equals(rule.getIsActive()) && "DENY".equalsIgnoreCase(rule.getRuleType())) {
                if (rule.getCidrIp().contains(clientIp) || clientIp.contains(rule.getCidrIp().replace("/32", ""))) {
                    rule.setBlockedHits(rule.getBlockedHits() + 1);
                    ipFirewallRuleRepository.save(rule);
                    return true;
                }
            }
        }
        return false;
    }

    private IpFirewallRuleResponse mapToResponse(IpFirewallRuleEntity entity) {
        return IpFirewallRuleResponse.builder()
                .id(entity.getId())
                .ruleType(entity.getRuleType())
                .cidrIp(entity.getCidrIp())
                .description(entity.getDescription())
                .isActive(entity.getIsActive())
                .blockedHits(entity.getBlockedHits())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}