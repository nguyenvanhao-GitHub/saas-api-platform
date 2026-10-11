package com.saas.api.modules.alerts.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.alerts.dto.CreateAlertRequest;
import com.saas.api.modules.alerts.dto.UsageAlertResponse;
import com.saas.api.modules.alerts.service.UsageAlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/alerts")
@RequiredArgsConstructor
@Tag(name = "Usage Alerts & Budget Quotas", description = "Quản lý cảnh báo hạn mức API tự động qua In-App, Email, Slack và Discord")
public class UsageAlertController {

    private final UsageAlertService usageAlertService;

    @GetMapping
    @Operation(summary = "Lấy danh sách cấu hình cảnh báo")
    public ApiResponse<List<UsageAlertResponse>> getMyAlerts(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(usageAlertService.getMyAlerts(principal.getId()));
    }

    @PostMapping
    @Operation(summary = "Tạo mới quy tắc cảnh báo hạn mức")
    public ApiResponse<UsageAlertResponse> createAlert(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateAlertRequest request
    ) {
        return ApiResponse.success("Tạo cảnh báo hạn mức thành công", usageAlertService.createAlert(principal.getId(), request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa quy tắc cảnh báo")
    public ApiResponse<Void> deleteAlert(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        usageAlertService.deleteAlert(principal.getId(), id);
        return ApiResponse.success("Xóa cấu hình cảnh báo thành công", null);
    }

    @PostMapping("/{id}/test")
    @Operation(summary = "Bắn tín hiệu kiểm thử cảnh báo (Test Alert)")
    public ApiResponse<Void> testAlert(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        usageAlertService.testAlert(principal.getId(), id);
        return ApiResponse.success("Đã bắn tín hiệu kiểm thử cảnh báo", null);
    }
}
