package com.saas.api.modules.webhooks.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.webhooks.dto.request.CreateWebhookRequest;
import com.saas.api.modules.webhooks.dto.response.WebhookDeliveryLogResponse;
import com.saas.api.modules.webhooks.dto.response.WebhookResponse;
import com.saas.api.modules.webhooks.service.WebhookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
@Tag(name = "Developer Webhooks", description = "API Quản lý Webhook Endpoints & Kiểm thử Chữ ký HMAC-SHA256")
public class WebhookController {

    private final WebhookService webhookService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Đăng ký Webhook Endpoint mới", description = "Tự động sinh Webhook Secret Key whsec_ để ký HMAC-SHA256")
    public ApiResponse<WebhookResponse> registerEndpoint(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateWebhookRequest request
    ) {
        return ApiResponse.success("Đăng ký Webhook Endpoint thành công", webhookService.registerEndpoint(principal.getId(), request));
    }

    @GetMapping("/me")
    @Operation(summary = "Xem danh sách Webhook Endpoints cá nhân", description = "Lấy danh sách các URL nhận sự kiện của Developer")
    public ApiResponse<List<WebhookResponse>> getMyEndpoints(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(webhookService.getUserEndpoints(principal.getId()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Xóa Webhook Endpoint", description = "Hủy đăng ký nhận sự kiện tại Endpoint chỉ định")
    public void deleteEndpoint(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        webhookService.deleteEndpoint(principal.getId(), id);
    }

    @PostMapping("/{id}/test")
    @Operation(summary = "Gửi thử nghiệm Ping Test Webhook", description = "Gửi một bản tin ping.test có ký Header X-SaaS-Signature")
    public ApiResponse<WebhookDeliveryLogResponse> testEndpoint(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        return ApiResponse.success("Gửi thử nghiệm Webhook thành công", webhookService.testEndpoint(principal.getId(), id));
    }

    @GetMapping("/{id}/logs")
    @Operation(summary = "Xem lịch sử phân phát sự kiện của Endpoint", description = "Truy vết mã HTTP phản hồi và payload")
    public ApiResponse<List<WebhookDeliveryLogResponse>> getDeliveryLogs(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        return ApiResponse.success(webhookService.getEndpointDeliveryLogs(principal.getId(), id));
    }
}
