package com.saas.api.modules.aicopilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiCopilotResponse {
    private UUID id;
    private String prompt;
    private String reply;
    private String codeSnippet;
    private String language;
    private Integer tokensEstimated;
    private Instant createdAt;
}