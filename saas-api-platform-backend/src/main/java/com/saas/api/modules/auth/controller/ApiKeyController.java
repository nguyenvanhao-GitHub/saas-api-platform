package com.saas.api.modules.auth.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.auth.dto.ApiKeyResponse;
import com.saas.api.modules.auth.dto.CreateApiKeyRequest;
import com.saas.api.modules.auth.service.ApiKeyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/api-keys")
@RequiredArgsConstructor
@Tag(name = "API Key Management", description = "Quản lý nhiều API Key, phân quyền Scopes & IP Whitelist")
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @GetMapping
    @Operation(summary = "Lấy danh sách API Keys", description = "Trả về toàn bộ danh sách API Keys của Developer hiện tại")
    public ApiResponse<List<ApiKeyResponse>> getMyApiKeys(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(apiKeyService.getMyApiKeys(principal.getId()));
    }

    @PostMapping
    @Operation(summary = "Tạo mới API Key", description = "Tạo API Key mới với Scopes, IP Whitelist và hạn sử dụng")
    public ApiResponse<ApiKeyResponse> createApiKey(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateApiKeyRequest request
    ) {
        return ApiResponse.success("Tạo API Key mới thành công", apiKeyService.createApiKey(principal.getId(), request));
    }

    @PatchMapping("/{id}/toggle")
    @Operation(summary = "Bật / Tắt API Key", description = "Tạm dừng hoặc kích hoạt lại API Key")
    public ApiResponse<ApiKeyResponse> toggleApiKey(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        return ApiResponse.success("Thay đổi trạng thái API Key thành công", apiKeyService.toggleApiKey(principal.getId(), id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Thu hồi / Xóa API Key", description = "Xóa vĩnh viễn API Key khỏi hệ thống")
    public ApiResponse<Void> deleteApiKey(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        apiKeyService.deleteApiKey(principal.getId(), id);
        return ApiResponse.success("Xóa API Key thành công", null);
    }
}
