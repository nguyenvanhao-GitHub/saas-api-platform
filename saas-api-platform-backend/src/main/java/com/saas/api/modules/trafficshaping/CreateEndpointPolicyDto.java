package com.saas.api.modules.trafficshaping;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEndpointPolicyDto {
    @NotBlank
    private String endpointPath;

    @NotBlank
    private String httpMethod;

    @NotNull
    private Integer rateLimitPerMin;

    @NotNull
    private Integer burstCapacity;

    private String jsonSchemaValidation;
    private Boolean isPiiMaskingEnabled;
}