package com.saas.api.modules.auth.service;

import com.saas.api.modules.auth.dto.request.LoginRequest;
import com.saas.api.modules.auth.dto.request.RefreshTokenRequest;
import com.saas.api.modules.auth.dto.request.RegisterRequest;
import com.saas.api.modules.auth.dto.request.SocialLoginRequest;
import com.saas.api.modules.auth.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse socialLogin(SocialLoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(String token);
}
