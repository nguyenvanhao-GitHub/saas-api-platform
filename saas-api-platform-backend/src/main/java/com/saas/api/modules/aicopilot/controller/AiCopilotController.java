package com.saas.api.modules.aicopilot.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.aicopilot.dto.AiCopilotRequest;
import com.saas.api.modules.aicopilot.dto.AiCopilotResponse;
import com.saas.api.modules.aicopilot.service.AiCopilotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai-copilot")
@RequiredArgsConstructor
@Tag(name = "AI API Copilot", description = "Trợ lý AI phân tích tài liệu, sinh mã nguồn đa ngôn ngữ và gỡ lỗi API")
public class AiCopilotController {

    private final AiCopilotService aiCopilotService;

    @PostMapping("/ask")
    @Operation(summary = "Gửi câu hỏi cho AI Copilot")
    public ApiResponse<AiCopilotResponse> askCopilot(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AiCopilotRequest request
    ) {
        return ApiResponse.success("AI Copilot đã phản hồi", aiCopilotService.askCopilot(principal.getId(), request));
    }

    @GetMapping("/history")
    @Operation(summary = "Lấy lịch sử trò chuyện với AI Copilot")
    public ApiResponse<List<AiCopilotResponse>> getHistory(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(aiCopilotService.getChatHistory(principal.getId()));
    }
}