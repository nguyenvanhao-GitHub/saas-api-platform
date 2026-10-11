package com.saas.api.modules.trafficreplay;

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
public class CreateReplayJobDto {
    @NotBlank
    private String name;

    @NotBlank
    private String targetEnvUrl;

    @NotNull
    private Integer requestCount;
}