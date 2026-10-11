package com.saas.api.modules.users.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.model.PageResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.users.dto.request.ChangePasswordRequest;
import com.saas.api.modules.users.dto.request.UpdateProfileRequest;
import com.saas.api.modules.users.dto.response.UserResponse;
import com.saas.api.modules.users.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "API Quản lý Hồ sơ, Mật khẩu, API Key & Quản trị Users")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Xem thông tin cá nhân", description = "Lấy thông tin tài khoản hiện tại từ Bearer Token")
    public ApiResponse<UserResponse> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(userService.getProfile(principal.getId()));
    }

    @PutMapping("/me")
    @Operation(summary = "Cập nhật thông tin cá nhân", description = "Cập nhật họ tên của tài khoản hiện tại")
    public ApiResponse<UserResponse> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ApiResponse.success("Cập nhật thông tin thành công", userService.updateProfile(principal.getId(), request));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Đổi mật khẩu tài khoản", description = "Kiểm tra mật khẩu hiện tại và cập nhật mật khẩu mới")
    public ApiResponse<Void> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(principal.getId(), request);
        return ApiResponse.success("Đổi mật khẩu thành công", null);
    }

    @PostMapping("/regenerate-api-key")
    @Operation(summary = "Xoay vòng (Tạo mới) API Key", description = "Hủy API Key cũ và cấp phát API Key sk_live_ mới cho Developer")
    public ApiResponse<UserResponse> rotateApiKey(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success("Cấp mới API Key thành công", userService.rotateApiKey(principal.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Quản trị viên xem danh sách Users (Phân trang)", description = "Yêu cầu quyền ROLE_ADMIN, hỗ trợ phân trang & sắp xếp")
    public ApiResponse<PageResponse<UserResponse>> getAllUsers(
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ApiResponse.success(userService.getAllUsers(pageable));
    }
}
