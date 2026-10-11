package com.saas.api.modules.users.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.core.model.PageResponse;
import com.saas.api.modules.users.domain.UserEntity;
import com.saas.api.modules.users.dto.request.ChangePasswordRequest;
import com.saas.api.modules.users.dto.request.UpdateProfileRequest;
import com.saas.api.modules.users.dto.response.UserResponse;
import com.saas.api.modules.users.mapper.UserMapper;
import com.saas.api.modules.users.repository.UserRepository;
import com.saas.api.modules.users.service.UserService;
import com.saas.api.modules.notifications.service.NotificationService;
import com.saas.api.modules.users.domain.ApiKeyRotationEntity;
import com.saas.api.modules.users.repository.ApiKeyRotationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final ApiKeyRotationRepository apiKeyRotationRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getProfile(UUID userId) {
        log.info("Lấy thông tin cá nhân của User: {}", userId);
        UserEntity user = findUserById(userId);
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        log.info("Cập nhật thông tin User {}: fullName = {}", userId, request.getFullName());
        UserEntity user = findUserById(userId);
        user.setFullName(request.getFullName());
        UserEntity saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        log.info("Xử lý đổi mật khẩu cho User: {}", userId);
        UserEntity user = findUserById(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS, "Mật khẩu hiện tại không chính xác");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        notificationService.createNotification(
                userId,
                "Mật khẩu đã được thay đổi",
                "Mật khẩu tài khoản của bạn vừa được cập nhật thành công.",
                "SECURITY"
        );
    }

    @Override
    @Transactional
    public UserResponse rotateApiKey(UUID userId) {
        log.info("Xoay vòng (Regenerate) API Key mới cho User: {}", userId);
        UserEntity user = findUserById(userId);

        String oldKey = user.getApiKey();
        String maskedOldKey = oldKey != null && oldKey.length() > 8
                ? oldKey.substring(0, 8) + "..." + oldKey.substring(oldKey.length() - 4)
                : "sk_live_****";

        String newApiKey = "sk_live_" + UUID.randomUUID().toString().replace("-", "");
        user.setApiKey(newApiKey);
        UserEntity saved = userRepository.save(user);

        // Lưu vết xoay vòng API Key
        ApiKeyRotationEntity rotation = ApiKeyRotationEntity.builder()
                .user(user)
                .oldApiKeyMasked(maskedOldKey)
                .reason("Developer initiated API key rotation")
                .build();
        apiKeyRotationRepository.save(rotation);

        notificationService.createNotification(
                userId,
                "Khóa bí mật API Key đã được cấp mới",
                "Khóa API Key của bạn đã được xoay vòng thành công (" + maskedOldKey + " -> mới). Vui lòng cập nhật vào ứng dụng.",
                "SECURITY"
        );

        return userMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAllUsers(Pageable pageable) {
        log.info("Quản trị viên lấy danh sách Users phân trang (Page: {}, Size: {})", pageable.getPageNumber(), pageable.getPageSize());
        Page<UserEntity> userPage = userRepository.findAll(pageable);
        return PageResponse.from(userPage.map(userMapper::toResponse));
    }

    private UserEntity findUserById(UUID userId) {
        return userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy người dùng"));
    }
}
