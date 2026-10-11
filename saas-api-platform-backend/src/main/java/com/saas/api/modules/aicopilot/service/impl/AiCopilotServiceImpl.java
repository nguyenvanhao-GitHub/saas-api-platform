package com.saas.api.modules.aicopilot.service.impl;

import com.saas.api.modules.aicopilot.domain.AiChatLogEntity;
import com.saas.api.modules.aicopilot.dto.AiCopilotRequest;
import com.saas.api.modules.aicopilot.dto.AiCopilotResponse;
import com.saas.api.modules.aicopilot.repository.AiChatLogRepository;
import com.saas.api.modules.aicopilot.service.AiCopilotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiCopilotServiceImpl implements AiCopilotService {

    private final AiChatLogRepository aiChatLogRepository;

    @Override
    @Transactional
    public AiCopilotResponse askCopilot(UUID userId, AiCopilotRequest request) {
        String prompt = request.getPrompt().trim();
        String lang = request.getTargetLanguage() != null ? request.getTargetLanguage().toUpperCase() : "JAVASCRIPT";

        String reply;
        String snippet;

        String lower = prompt.toLowerCase();
        if (lower.contains("rate limit") || lower.contains("429") || lower.contains("quá tải")) {
            reply = "Khi nhận mã lỗi **HTTP 429 Too Many Requests**, hệ thống Gateway thông báo bạn đã vượt quá hạn mức request/phút. Bạn nên áp dụng thuật toán **Exponential Backoff with Jitter** hoặc xoay vòng nhiều API Keys.";
            snippet = """
            // Exponential Backoff Retry Strategy (Node.js / TypeScript)
            async function callWithRetry(fn, retries = 3, delay = 1000) {
              try {
                return await fn();
              } catch (err) {
                if (err.response?.status === 429 && retries > 0) {
                  const waitTime = delay * 2 + Math.random() * 500;
                  console.warn(`[429 Rate Limit] Retrying in ${waitTime.toFixed(0)}ms...`);
                  await new Promise(res => setTimeout(res, waitTime));
                  return callWithRetry(fn, retries - 1, delay * 2);
                }
                throw err;
              }
            }
            """;
        } else if (lower.contains("mst") || lower.contains("tax") || lower.contains("doanh nghiệp")) {
            reply = "Để gọi API **Tra cứu Mã số thuế & Doanh nghiệp**, bạn hãy gửi request POST tới endpoint `/api/v1/business/tax-lookup` kèm header `x-api-key`. Dưới đây là code mẫu hoàn chỉnh:";
            snippet = """
            import requests

            url = "https://api.smartgate.vn/api/v1/business/tax-lookup"
            headers = {
                "x-api-key": "sk_live_your_api_key_here",
                "Content-Type": "application/json"
            }
            payload = {
                "taxCode": "0108999888"
            }

            response = requests.post(url, json=payload, headers=headers)
            print("HTTP Status:", response.status_code)
            print("Company Info:", response.json())
            """;
        } else if (lower.contains("webhook") || lower.contains("hmac") || lower.contains("ký")) {
            reply = "Bản tin Webhook được ký bằng thuật toán **HMAC-SHA256** qua header `X-SaaS-Signature`. Bạn nên giải mã và so sánh chữ ký để đảm bảo tính toàn vẹn:";
            snippet = """
            // Verify HMAC-SHA256 Signature in Node.js Express
            const crypto = require('crypto');

            app.post('/my-webhook', express.raw({ type: 'application/json' }), (req, res) => {
              const signature = req.headers['x-saas-signature'];
              const secret = process.env.WEBHOOK_SECRET;
              
              const expectedSig = crypto
                .createHmac('sha256', secret)
                .update(req.body)
                .digest('hex');

              if (signature !== expectedSig) {
                return res.status(401).send('Invalid signature');
              }
              
              const event = JSON.parse(req.body.toString());
              console.log('Received verified event:', event.eventType);
              res.status(200).send('OK');
            });
            """;
        } else {
            reply = "Tôi là **SaaS API Copilot Assistant**. Dưới đây là hướng dẫn mẫu gọi API Gateway an toàn với Secret Key và cơ chế bắt lỗi chuẩn RESTful:";
            snippet = """
            // Universal API Gateway Caller (cURL / Fetch)
            fetch("https://api.smartgate.vn/api/v1/data/query", {
              method: "POST",
              headers: {
                "x-api-key": "sk_live_your_api_key_here",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ query: "SELECT summary FROM analytics" })
            })
            .then(res => res.json())
            .then(data => console.log("Gateway Response:", data))
            .catch(err => console.error("API Error:", err));
            """;
        }

        int tokens = (prompt.length() + reply.length() + snippet.length()) / 4;

        AiChatLogEntity entity = AiChatLogEntity.builder()
                .userId(userId)
                .prompt(prompt)
                .responseText(reply + "\n```" + lang.toLowerCase() + "\n" + snippet + "\n```")
                .languageUsed(lang)
                .tokensUsed(tokens)
                .build();

        AiChatLogEntity saved = aiChatLogRepository.save(entity);

        return AiCopilotResponse.builder()
                .id(saved.getId())
                .prompt(prompt)
                .reply(reply)
                .codeSnippet(snippet)
                .language(lang)
                .tokensEstimated(tokens)
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AiCopilotResponse> getChatHistory(UUID userId) {
        return aiChatLogRepository.findTop20ByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId).stream()
                .map(log -> AiCopilotResponse.builder()
                        .id(log.getId())
                        .prompt(log.getPrompt())
                        .reply(log.getResponseText())
                        .language(log.getLanguageUsed())
                        .tokensEstimated(log.getTokensUsed())
                        .createdAt(log.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}