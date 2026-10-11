package com.saas.api.modules.health;

import com.saas.api.core.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health Check", description = "API kiểm tra trạng thái hoạt động hệ thống")
public class HealthController {

    @GetMapping
    @Operation(summary = "Kiểm tra hệ thống", description = "Trả về thông tin trạng thái hoạt động hiện tại của SaaS API Platform")
    public ApiResponse<Map<String, Object>> checkHealth() {
        return ApiResponse.success("Hệ thống SaaS API Platform đang hoạt động bình thường", Map.of(
                "status", "UP",
                "version", "0.1.0",
                "timestamp", System.currentTimeMillis()
        ));
    }
}
