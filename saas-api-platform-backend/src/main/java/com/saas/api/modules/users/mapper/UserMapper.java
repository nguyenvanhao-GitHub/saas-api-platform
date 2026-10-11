package com.saas.api.modules.users.mapper;

import com.saas.api.modules.users.domain.UserEntity;
import com.saas.api.modules.users.dto.response.UserResponse;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true), unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    UserResponse toResponse(UserEntity entity);
}
