package com.saas.api.modules.reports.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.reports.dto.response.AdminDashboardResponse;
import com.saas.api.modules.reports.dto.response.DeveloperDashboardResponse;
import com.saas.api.modules.reports.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reports & Analytics", description = "API Thống kê & Báo cáo Dashboard cho Admin và Developer")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xem tổng quan Dashboard Quản trị viên (Admin)", description = "Yêu cầu quyền ROLE_ADMIN")
    public ApiResponse<AdminDashboardResponse> getAdminDashboard() {
        return ApiResponse.success(reportService.getAdminDashboard());
    }

    @GetMapping("/developer/dashboard")
    @Operation(summary = "Xem Dashboard Lập trình viên (Developer)", description = "Thống kê chi phí, gói dịch vụ và mức tiêu thụ API cá nhân")
    public ApiResponse<DeveloperDashboardResponse> getDeveloperDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(reportService.getDeveloperDashboard(principal.getId()));
    }
}
