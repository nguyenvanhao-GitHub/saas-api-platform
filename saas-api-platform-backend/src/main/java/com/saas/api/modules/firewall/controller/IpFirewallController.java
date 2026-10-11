package com.saas.api.modules.firewall.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.modules.firewall.dto.CreateFirewallRuleRequest;
import com.saas.api.modules.firewall.dto.IpFirewallRuleResponse;
import com.saas.api.modules.firewall.service.IpFirewallService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/firewall")
@RequiredArgsConstructor
@Tag(name = "IP Firewall Management", description = "Tường lửa quản lý danh sách IP Blacklist / Whitelist theo chuẩn CIDR")
public class IpFirewallController {

    private final IpFirewallService ipFirewallService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy danh sách luật tường lửa IP")
    public ApiResponse<List<IpFirewallRuleResponse>> getAllRules() {
        return ApiResponse.success(ipFirewallService.getAllRules());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Tạo mới luật tường lửa IP")
    public ApiResponse<IpFirewallRuleResponse> createRule(@Valid @RequestBody CreateFirewallRuleRequest request) {
        return ApiResponse.success("Tạo quy tắc tường lửa thành công", ipFirewallService.createRule(request));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Bật / Tắt quy tắc tường lửa")
    public ApiResponse<IpFirewallRuleResponse> toggleRule(@PathVariable UUID id) {
        return ApiResponse.success("Thay đổi trạng thái thành công", ipFirewallService.toggleRule(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa quy tắc tường lửa")
    public ApiResponse<Void> deleteRule(@PathVariable UUID id) {
        ipFirewallService.deleteRule(id);
        return ApiResponse.success("Đã xóa quy tắc tường lửa", null);
    }
}