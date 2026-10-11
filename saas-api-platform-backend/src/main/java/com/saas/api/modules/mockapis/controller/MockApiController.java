package com.saas.api.modules.mockapis.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.mockapis.dto.CreateMockEndpointRequest;
import com.saas.api.modules.mockapis.dto.MockEndpointResponse;
import com.saas.api.modules.mockapis.service.MockApiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Dynamic Mock APIs", description = "Tạo Mock API Engine tùy chỉnh và xử lý gọi Gateway tự động")
public class MockApiController {

    private final MockApiService mockApiService;

    @GetMapping("/mock-endpoints")
    @Operation(summary = "Lấy danh sách Mock Endpoints của tôi")
    public ApiResponse<List<MockEndpointResponse>> getMyMockEndpoints(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(mockApiService.getMyMockEndpoints(principal.getId()));
    }

    @PostMapping("/mock-endpoints")
    @Operation(summary = "Tạo mới Mock Endpoint")
    public ApiResponse<MockEndpointResponse> createMockEndpoint(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateMockEndpointRequest request
    ) {
        return ApiResponse.success("Tạo Mock API thành công", mockApiService.createMockEndpoint(principal.getId(), request));
    }

    @PatchMapping("/mock-endpoints/{id}/toggle")
    @Operation(summary = "Bật / Tắt Mock Endpoint")
    public ApiResponse<MockEndpointResponse> toggleMockEndpoint(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        return ApiResponse.success("Cập nhật trạng thái thành công", mockApiService.toggleMockEndpoint(principal.getId(), id));
    }

    @DeleteMapping("/mock-endpoints/{id}")
    @Operation(summary = "Xóa Mock Endpoint")
    public ApiResponse<Void> deleteMockEndpoint(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        mockApiService.deleteMockEndpoint(principal.getId(), id);
        return ApiResponse.success("Đã xóa Mock Endpoint", null);
    }

    @RequestMapping(value = "/mock/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    @Operation(summary = "Gateway thực thi Mock Endpoint theo URL")
    public ResponseEntity<String> executeMockEndpoint(HttpServletRequest request) {
        String fullPath = request.getRequestURI();
        String mockPath = fullPath.replaceFirst("/api/v1/mock", "");
        return mockApiService.executeMock(mockPath, request.getMethod());
    }
}