package com.saas.api.modules.invoices.mapper;

import com.saas.api.modules.invoices.domain.InvoiceEntity;
import com.saas.api.modules.invoices.dto.response.InvoiceResponse;
import com.saas.api.modules.users.mapper.UserMapper;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        uses = {UserMapper.class},
        builder = @Builder(disableBuilder = true),
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface InvoiceMapper {

    InvoiceResponse toResponse(InvoiceEntity entity);
}
