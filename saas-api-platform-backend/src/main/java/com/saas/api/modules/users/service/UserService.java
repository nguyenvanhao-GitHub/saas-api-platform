package com.saas.api.modules.users.service;

import com.saas.api.core.model.PageResponse;
import com.saas.api.modules.users.dto.request.ChangePasswordRequest;
import com.saas.api.modules.users.dto.request.UpdateProfileRequest;
import com.saas.api.modules.users.dto.response.UserResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserService {

    UserResponse getProfile(UUID userId);

    UserResponse updateProfile(UUID userId, UpdateProfileRequest request);

    void changePassword(UUID userId, ChangePasswordRequest request);

    UserResponse rotateApiKey(UUID userId);

    PageResponse<UserResponse> getAllUsers(Pageable pageable);
}
