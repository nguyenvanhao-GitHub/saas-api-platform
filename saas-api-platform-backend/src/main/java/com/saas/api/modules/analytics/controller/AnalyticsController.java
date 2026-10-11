package com.saas.api.modules.analytics.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.analytics.dto.AnalyticsOverviewDto;
import com.saas.api.modules.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics & Telemetry", description = "Số liệu phân tích lưu lượng, chuỗi thời gian 24h và top endpoint tiêu thụ")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    @Operation(summary = "Lấy báo cáo phân tích lưu lượng tổng quan")
    public ApiResponse<AnalyticsOverviewDto> getAnalyticsOverview(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(analyticsService.getDeveloperAnalytics(principal.getId()));
    }
}
