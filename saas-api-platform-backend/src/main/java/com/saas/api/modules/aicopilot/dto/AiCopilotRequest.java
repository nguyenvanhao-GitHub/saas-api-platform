package com.saas.api.modules.aicopilot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiCopilotRequest {

    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    private String prompt;

    private String targetLanguage; // ALL, PYTHON, JAVASCRIPT, JAVA, GO, CURL
}