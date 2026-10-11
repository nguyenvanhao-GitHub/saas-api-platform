package com.saas.api.modules.usage.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.usage.dto.response.UsageStatsResponse;
import com.saas.api.modules.usage.service.UsageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/gateway")
@RequiredArgsConstructor
@Tag(name = "SaaS Gateway & Rate Limiting", description = "API Gateway mô phỏng gọi API có kiểm tra Redis Rate Limit")
public class UsageController {

    private final UsageService usageService;

    @PostMapping("/execute")
    @Operation(summary = "Mô phỏng gọi API Gateway (X-API-KEY)", description = "Truyền Header X-API-KEY để kiểm tra Redis Rate Limit (Tối đa 60 req/min)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeApi(
            @RequestHeader("X-API-KEY") String apiKey,
            @RequestParam(defaultValue = "/v1/data/query") String endpoint
    ) {
        Map<String, Object> result = usageService.recordAndRateLimitApiUsage(apiKey, endpoint);
        
        long remaining = result.get("remainingQuota") instanceof Number ? ((Number) result.get("remainingQuota")).longValue() : 59;
        long resetSeconds = 60 - ((System.currentTimeMillis() / 1000) % 60);
        String requestId = "req_" + UUID.randomUUID().toString().replace("-", "");

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Request-Id", requestId);
        headers.add("X-RateLimit-Limit", "60");
        headers.add("X-RateLimit-Remaining", String.valueOf(Math.max(0, remaining)));
        headers.add("X-RateLimit-Reset-Seconds", String.valueOf(resetSeconds));

        return ResponseEntity.ok()
                .headers(headers)
                .body(ApiResponse.success("Giao dịch API thành công", result));
    }

    @GetMapping("/stats/me")
    @Operation(summary = "Thống kê lưu lượng API thời gian thực", description = "Lấy số liệu tiêu thụ API và hạn mức còn lại từ Redis")
    public ApiResponse<UsageStatsResponse> getMyStats(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(usageService.getUserStats(principal.getId()));
    }
}
