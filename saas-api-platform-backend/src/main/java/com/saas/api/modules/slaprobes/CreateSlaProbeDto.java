package com.saas.api.modules.slaprobes;

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
public class CreateSlaProbeDto {
    @NotBlank
    private String name;

    @NotBlank
    private String targetUrl;

    private String httpMethod;
    private Integer expectedStatus;
    private Integer checkIntervalSeconds;
}