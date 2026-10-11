package com.saas.api.modules.subscriptions.mapper;

import com.saas.api.modules.apiproducts.mapper.ProductMapper;
import com.saas.api.modules.subscriptions.domain.SubscriptionEntity;
import com.saas.api.modules.subscriptions.dto.response.SubscriptionResponse;
import com.saas.api.modules.users.mapper.UserMapper;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        uses = {UserMapper.class, ProductMapper.class},
        builder = @Builder(disableBuilder = true),
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface SubscriptionMapper {

    SubscriptionResponse toResponse(SubscriptionEntity entity);
}
