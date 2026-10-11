package com.saas.api.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateApiKeyRequest {
    @NotBlank(message = "Tên Key không được để trống")
    private String keyName;

    private String scopes;
    private String ipWhitelist;
    private Integer rateLimitPerMinute;
    private Instant expiresAt;
}
