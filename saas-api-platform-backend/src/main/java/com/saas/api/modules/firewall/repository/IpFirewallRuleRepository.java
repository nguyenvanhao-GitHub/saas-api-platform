package com.saas.api.modules.firewall.repository;

import com.saas.api.modules.firewall.domain.IpFirewallRuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IpFirewallRuleRepository extends JpaRepository<IpFirewallRuleEntity, UUID> {
    List<IpFirewallRuleEntity> findByIsDeletedFalseOrderByCreatedAtDesc();
}