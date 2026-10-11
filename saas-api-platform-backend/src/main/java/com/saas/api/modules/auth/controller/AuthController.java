package com.saas.api.modules.auth.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.modules.auth.dto.request.LoginRequest;
import com.saas.api.modules.auth.dto.request.RefreshTokenRequest;
import com.saas.api.modules.auth.dto.request.RegisterRequest;
import com.saas.api.modules.auth.dto.request.SocialLoginRequest;
import com.saas.api.modules.auth.dto.response.AuthResponse;
import com.saas.api.modules.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "API Đăng ký, Đăng nhập & Refresh Token")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Đăng ký tài khoản Developer mới", description = "Tự động sinh API Key sk_live_ cho tài khoản mới")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success("Đăng ký tài khoản thành công", authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập và lấy Bearer JWT Token", description = "Trả về JWT Access Token để dùng cho các API bảo mật")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Đăng nhập thành công", authService.login(request));
    }

    @PostMapping("/social-login")
    @Operation(summary = "Đăng nhập bằng mạng xã hội (Google / GitHub)", description = "Tự động đăng ký hoặc đăng nhập với Google / GitHub và cấp phát JWT")
    public ApiResponse<AuthResponse> socialLogin(@Valid @RequestBody SocialLoginRequest request) {
        return ApiResponse.success("Đăng nhập mạng xã hội thành công", authService.socialLogin(request));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Làm mới Access Token", description = "Cấp phát Access Token mới từ Refresh Token hợp lệ")
    public ApiResponse<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.success("Làm mới Token thành công", authService.refreshToken(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất tài khoản", description = "Đưa Access Token vào Blacklist Redis để thu hồi quyền truy cập")
    public ApiResponse<Void> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authService.logout(authHeader.substring(7));
        }
        return ApiResponse.success("Đăng xuất thành công", null);
    }
}
