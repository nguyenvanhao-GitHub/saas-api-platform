package com.saas.api.modules.auth.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.core.security.JwtTokenProvider;
import com.saas.api.modules.auth.dto.request.LoginRequest;
import com.saas.api.modules.auth.dto.request.RefreshTokenRequest;
import com.saas.api.modules.auth.dto.request.RegisterRequest;
import com.saas.api.modules.auth.dto.request.SocialLoginRequest;
import com.saas.api.modules.auth.dto.response.AuthResponse;
import com.saas.api.modules.auth.service.AuthService;
import com.saas.api.modules.notifications.service.EmailService;
import com.saas.api.modules.users.domain.UserEntity;
import com.saas.api.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;
    private final StringRedisTemplate redisTemplate;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Xử lý đăng ký tài khoản mới cho email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        String apiKey = "sk_live_" + UUID.randomUUID().toString().replace("-", "");

        UserEntity user = UserEntity.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role("ROLE_DEVELOPER")
                .apiKey(apiKey)
                .status("ACTIVE")
                .build();

        UserEntity savedUser = userRepository.save(user);
        String accessToken = tokenProvider.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole());
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole());

        // Send welcome email asynchronously
        try {
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFullName(), savedUser.getApiKey());
        } catch (Exception e) {
            log.warn("Failed to dispatch welcome email: {}", e.getMessage());
        }

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole())
                .apiKey(savedUser.getApiKey())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Xử lý đăng nhập cho email: {}", request.getEmail());

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));

        if (user.isDeleted() || !"ACTIVE".equals(user.getStatus())) {
            throw new BusinessException(ErrorCode.UNAUTHENTICATED, "Tài khoản đã bị khóa hoặc ngừng hoạt động");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        String accessToken = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .apiKey(user.getApiKey())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse socialLogin(SocialLoginRequest request) {
        log.info("Xử lý Social Login ({}) cho email: {}", request.getProvider(), request.getEmail());

        UserEntity user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            // Tự động tạo tài khoản mới cho người dùng đăng nhập bằng Social
            String apiKey = "sk_live_" + UUID.randomUUID().toString().replace("-", "");
            user = UserEntity.builder()
                    .email(request.getEmail())
                    .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString())) // Random password hash
                    .fullName(request.getFullName())
                    .role("ROLE_DEVELOPER")
                    .apiKey(apiKey)
                    .status("ACTIVE")
                    .build();

            user = userRepository.save(user);

            try {
                emailService.sendWelcomeEmail(user.getEmail(), user.getFullName(), user.getApiKey());
            } catch (Exception e) {
                log.warn("Failed to dispatch welcome email on social login: {}", e.getMessage());
            }
        } else {
            if (user.isDeleted() || !"ACTIVE".equals(user.getStatus())) {
                throw new BusinessException(ErrorCode.UNAUTHENTICATED, "Tài khoản đã bị khóa hoặc ngừng hoạt động");
            }
        }

        String accessToken = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .apiKey(user.getApiKey())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (!tokenProvider.validateToken(token)) {
            throw new BusinessException(ErrorCode.UNAUTHENTICATED, "Refresh Token không hợp lệ hoặc đã hết hạn");
        }

        String userIdStr = tokenProvider.getUserIdFromToken(token);
        UUID userId = UUID.fromString(userIdStr);

        UserEntity user = userRepository.findById(userId)
                .filter(u -> !u.isDeleted() && "ACTIVE".equals(u.getStatus()))
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHENTICATED, "Tài khoản không tồn tại"));

        String newAccessToken = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .apiKey(user.getApiKey())
                .build();
    }

    @Override
    public void logout(String token) {
        if (token != null && tokenProvider.validateToken(token)) {
            try {
                Date expiration = tokenProvider.getExpirationFromToken(token);
                long ttlMillis = Math.max(0, expiration.getTime() - System.currentTimeMillis());
                if (ttlMillis > 0) {
                    redisTemplate.opsForValue().set("blacklist:token:" + token, "revoked", Duration.ofMillis(ttlMillis));
                    log.info("Token blacklisted in Redis for {} ms", ttlMillis);
                }
            } catch (Exception e) {
                log.warn("Error blacklisting token: {}", e.getMessage());
            }
        }
    }
}
