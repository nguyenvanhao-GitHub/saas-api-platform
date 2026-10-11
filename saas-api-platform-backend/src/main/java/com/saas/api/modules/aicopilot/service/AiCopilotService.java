package com.saas.api.modules.aicopilot.service;

import com.saas.api.modules.aicopilot.dto.AiCopilotRequest;
import com.saas.api.modules.aicopilot.dto.AiCopilotResponse;

import java.util.List;
import java.util.UUID;

public interface AiCopilotService {
    AiCopilotResponse askCopilot(UUID userId, AiCopilotRequest request);
    List<AiCopilotResponse> getChatHistory(UUID userId);
}