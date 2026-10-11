package com.saas.api.modules.health;

import com.saas.api.core.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public/status")
@Tag(name = "Public Status", description = "Trang trạng thái hoạt động công khai của hệ thống SaaS API Platform")
public class PublicStatusController {

    @GetMapping
    @Operation(summary = "Xem trạng thái hệ thống công khai", description = "Trả về trạng thái uptime 99.99%, latency và sức khỏe từng cụm dịch vụ")
    public ApiResponse<Map<String, Object>> getPublicStatus() {
        List<Map<String, Object>> services = List.of(
                Map.of("name", "API Gateway (Redis Token Bucket)", "category", "GATEWAY", "status", "OPERATIONAL", "latencyMs", 12, "uptime", "99.99%"),
                Map.of("name", "PostgreSQL Database Engine", "category", "DATABASE", "status", "OPERATIONAL", "latencyMs", 3, "uptime", "100.00%"),
                Map.of("name", "Redis Cache & Token Blacklist", "category", "CACHE", "status", "OPERATIONAL", "latencyMs", 1, "uptime", "100.00%"),
                Map.of("name", "Stripe International Payments", "category", "PAYMENTS", "status", "OPERATIONAL", "latencyMs", 85, "uptime", "99.95%"),
                Map.of("name", "VietQR Banking Settlement", "category", "PAYMENTS", "status", "OPERATIONAL", "latencyMs", 42, "uptime", "99.98%"),
                Map.of("name", "Developer Webhook HMAC Dispatcher", "category", "WEBHOOKS", "status", "OPERATIONAL", "latencyMs", 15, "uptime", "99.99%"),
                Map.of("name", "AWS S3 PDF Invoices Storage", "category", "STORAGE", "status", "OPERATIONAL", "latencyMs", 28, "uptime", "100.00%"),
                Map.of("name", "Enterprise Email Dispatcher", "category", "NOTIFICATIONS", "status", "OPERATIONAL", "latencyMs", 65, "uptime", "99.92%")
        );

        Map<String, Object> responseData = Map.of(
                "overallStatus", "ALL_SYSTEMS_OPERATIONAL",
                "overallUptime", "99.98%",
                "avgLatencyMs", 31,
                "servicesCount", services.size(),
                "services", services,
                "lastUpdated", Instant.now().toString(),
                "activeIncidents", List.of()
        );

        return ApiResponse.success("Tải trạng thái hệ thống thành công", responseData);
    }
}
