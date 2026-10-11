package com.saas.api.modules.subscriptions.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.model.PageResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.subscriptions.dto.response.SubscriptionResponse;
import com.saas.api.modules.subscriptions.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Subscriptions", description = "API Quản lý Đăng ký Gói Dịch Vụ API")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/{productId}")
    @Operation(summary = "Đăng ký gói API mới", description = "Tạo đăng ký mới cho Developer hiện tại")
    public ApiResponse<SubscriptionResponse> subscribe(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID productId
    ) {
        return ApiResponse.success("Đăng ký gói API thành công", subscriptionService.subscribe(principal.getId(), productId));
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy danh sách gói API đã đăng ký", description = "Truy vấn danh sách gói dịch vụ ACTIVE kèm thông tin JOIN FETCH")
    public ApiResponse<List<SubscriptionResponse>> getMySubscriptions(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(subscriptionService.getUserActiveSubscriptions(principal.getId()));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Hủy gói API đã đăng ký", description = "Chuyển trạng thái gói dịch vụ sang CANCELLED")
    public ApiResponse<Void> cancelSubscription(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        subscriptionService.cancelSubscription(principal.getId(), id);
        return ApiResponse.success("Hủy gói dịch vụ thành công", null);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Quản trị viên xem toàn bộ đăng ký (Phân trang)", description = "Yêu cầu quyền ROLE_ADMIN")
    public ApiResponse<PageResponse<SubscriptionResponse>> getAllSubscriptions(
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ApiResponse.success(subscriptionService.getAllSubscriptions(pageable));
    }
}
