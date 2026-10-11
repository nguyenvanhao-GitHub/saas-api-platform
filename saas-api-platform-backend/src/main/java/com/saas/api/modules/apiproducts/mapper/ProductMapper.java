package com.saas.api.modules.apiproducts.mapper;

import com.saas.api.modules.apiproducts.domain.ApiProductEntity;
import com.saas.api.modules.apiproducts.dto.request.CreateProductRequest;
import com.saas.api.modules.apiproducts.dto.response.ProductResponse;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true), unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

    ApiProductEntity toEntity(CreateProductRequest request);

    ProductResponse toResponse(ApiProductEntity entity);
}
