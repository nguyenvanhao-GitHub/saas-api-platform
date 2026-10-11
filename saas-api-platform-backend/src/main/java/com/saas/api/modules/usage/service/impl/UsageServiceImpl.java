package com.saas.api.modules.usage.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.modules.auth.domain.ApiKeyEntity;
import com.saas.api.modules.auth.repository.ApiKeyRepository;
import com.saas.api.modules.usage.dto.response.UsageStatsResponse;
import com.saas.api.modules.usage.service.UsageService;
import com.saas.api.modules.users.domain.UserEntity;
import com.saas.api.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsageServiceImpl implements UsageService {

    private final StringRedisTemplate redisTemplate;
    private final UserRepository userRepository;
    private final ApiKeyRepository apiKeyRepository;

    @Override
    public Map<String, Object> recordAndRateLimitApiUsage(String apiKey, String endpoint) {
        UserEntity user;
        int maxAllowedPerMinute = 60;

        Optional<ApiKeyEntity> apiKeyOpt = apiKeyRepository.findByApiKeyAndIsDeletedFalse(apiKey);
        if (apiKeyOpt.isPresent()) {
            ApiKeyEntity keyEntity = apiKeyOpt.get();
            if (!Boolean.TRUE.equals(keyEntity.getIsActive())) {
                throw new BusinessException(ErrorCode.INVALID_API_KEY, "API Key đã bị tạm dừng hoạt động!");
            }
            if (keyEntity.getExpiresAt() != null && keyEntity.getExpiresAt().isBefore(Instant.now())) {
                throw new BusinessException(ErrorCode.INVALID_API_KEY, "API Key này đã hết hạn sử dụng!");
            }
            if (keyEntity.getRateLimitPerMinute() != null && keyEntity.getRateLimitPerMinute() > 0) {
                maxAllowedPerMinute = keyEntity.getRateLimitPerMinute();
            }

            keyEntity.setLastUsedAt(Instant.now());
            apiKeyRepository.save(keyEntity);

            user = userRepository.findById(keyEntity.getUserId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_API_KEY));
        } else {
            user = userRepository.findByApiKey(apiKey)
                    .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_API_KEY));
        }

        if (user.isDeleted() || !"ACTIVE".equals(user.getStatus())) {
            throw new BusinessException(ErrorCode.INVALID_API_KEY, "API Key thuộc tài khoản đã bị vô hiệu hóa");
        }

        long currentRequests = 1;
        try {
            String currentMinute = String.valueOf(System.currentTimeMillis() / 60000);
            String rateLimitKey = "ratelimit:" + user.getId() + ":" + currentMinute;
            String totalUsageKey = "telemetry:total:" + user.getId();

            // 1. Redis Rate Limiting (Token Bucket / Fixed Window)
            Long redisReqCount = redisTemplate.opsForValue().increment(rateLimitKey);
            if (redisReqCount != null) {
                currentRequests = redisReqCount;
                if (currentRequests == 1) {
                    redisTemplate.expire(rateLimitKey, Duration.ofMinutes(2));
                }
            }

            if (currentRequests > maxAllowedPerMinute) {
                log.warn("CẢNH BÁO RATE LIMIT: User {} đã vượt quá {} req/phút", user.getEmail(), maxAllowedPerMinute);
                throw new BusinessException(ErrorCode.RATE_LIMIT_EXCEEDED);
            }

            // 2. Increment Total Usage Metering
            redisTemplate.opsForValue().increment(totalUsageKey);
        } catch (BusinessException be) {
            throw be;
        } catch (Exception e) {
            log.warn("Redis unavailable during API metering/rate-limiting, fallback to open pass-through: {}", e.getMessage());
        }

        log.info("API Telemetry: User {} gọi endpoint {} (Request #{}/phút)", user.getEmail(), endpoint, currentRequests);

        // 3. Thực thi Bộ 10 Dịch Vụ API Thương Mại Cốt Lõi (Catalog of 10 Commercial Services)
        Object servicePayload = executeCommercialServiceCatalog(endpoint);

        Map<String, Object> response = new HashMap<>();
        response.put("apiKey", apiKey);
        response.put("userEmail", user.getEmail());
        response.put("endpoint", endpoint);
        response.put("requestsThisMinute", currentRequests);
        response.put("remainingQuota", maxAllowedPerMinute - currentRequests);
        response.put("timestamp", Instant.now().toString());
        response.put("data", servicePayload);

        return response;
    }

    private Object executeCommercialServiceCatalog(String endpoint) {
        if (endpoint == null) endpoint = "/v1/data/query";
        String ep = endpoint.toLowerCase();

        // 1. 🏢 DOANH NGHIỆP: Tra cứu Mã số thuế
        if (ep.contains("tax-lookup") || ep.contains("mst")) {
            return Map.of(
                    "service", "Tra Cứu Mã Số Thuế & Doanh Nghiệp Quốc Gia",
                    "taxCode", "0108999888",
                    "companyName", "CÔNG TY CỔ PHẦN CÔNG NGHỆ SMARTGATE VIỆT NAM",
                    "internationalName", "SMARTGATE VIETNAM TECHNOLOGY JSC",
                    "shortName", "SMARTGATE TECH",
                    "address", "Tầng 12, Tòa nhà Keangnam Landmark 72, Đường Phạm Hùng, Nam Từ Liêm, Hà Nội",
                    "representative", "Nguyễn Văn Hoàng",
                    "foundedDate", "2021-06-15",
                    "status", "Đang hoạt động (Đã được cấp Giấy phép ĐKKD)",
                    "mainIndustry", "6201 - Lập trình máy vi tính và Dịch vụ Công nghệ Thông tin"
            );
        }

        // 2. 🏦 DOANH NGHIỆP: Tra cứu Danh sách Ngân hàng & Mã BIN NAPAS
        if (ep.contains("bank-lookup") || ep.contains("bin-lookup")) {
            return Map.of(
                    "service", "Tra Cứu Mã BIN & Danh Sách Ngân Hàng NAPAS VietQR",
                    "bankCode", "VCB",
                    "bankName", "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
                    "bin", "970436",
                    "shortName", "Vietcombank",
                    "transferSupported", true,
                    "vietQrSupported", true,
                    "logoUrl", "https://api.vietqr.io/img/VCB.png"
            );
        }

        // 3. 🤖 AI: Tạo nội dung Marketing & SEO
        if (ep.contains("generate-content") || ep.contains("ai-content")) {
            return Map.of(
                    "service", "AI Content Marketing & SEO Generator",
                    "topic", "Chiến lược tối ưu hóa API Gateway cho Doanh nghiệp SaaS",
                    "generatedTitle", "🔥 Bật Mí 5 Bước Tối Ưu Hóa API Gateway Giúp Hệ Thống Chịu Tải 1.000.000 Request/Phút",
                    "summary", "Giải pháp sử dụng Redis Token Bucket Rate Limiting kết hợp phân tán tải và ký bảo mật HMAC-SHA256.",
                    "seoKeywords", List.of("SaaS API", "Spring Boot 3", "Redis Rate Limiting", "Enterprise Gateway", "VietQR"),
                    "wordCount", 520,
                    "aiModel", "SaaS-AI-Engine-v2.5"
            );
        }

        // 4. 🧠 AI: Phân tích cảm xúc đánh giá khách hàng (Sentiment Analysis)
        if (ep.contains("sentiment-analysis") || ep.contains("sentiment")) {
            return Map.of(
                    "service", "AI Phân Tích Cảm Xúc & Phản Hồi Khách Hàng",
                    "inputText", "Dịch vụ API rất nhanh, tích hợp VietQR cực kỳ tiện lợi, đội ngũ support nhiệt tình!",
                    "sentiment", "POSITIVE (Tích cực)",
                    "confidenceScore", 0.985,
                    "detectedEmotions", Map.of("satisfaction", 0.95, "loyalty", 0.88),
                    "actionRecommended", "Gửi email cảm ơn và tặng mã giảm giá VIP"
            );
        }

        // 5. 🪪 AI: Trích xuất thông tin Căn Cước Công Dân (OCR)
        if (ep.contains("ocr-id-card") || ep.contains("ocr")) {
            return Map.of(
                    "service", "AI OCR Trích Xuất Thông Tin CCCD / Hộ Chiếu",
                    "idNumber", "001095012345",
                    "fullName", "NGUYỄN VĂN HOÀNG",
                    "dateOfBirth", "1995-10-25",
                    "gender", "Nam",
                    "nationality", "Việt Nam",
                    "placeOfOrigin", "Hà Nội",
                    "placeOfResidence", "Số 18 Phạm Hùng, Nam Từ Liêm, Hà Nội",
                    "expiryDate", "2035-10-25",
                    "cardType", "CCCD Gắn Chip (Chip-based ID)"
            );
        }

        // 6. 📈 TÀI CHÍNH: Tỷ giá Ngoại tệ & Giá vàng SJC
        if (ep.contains("exchange-rates") || ep.contains("gold-price")) {
            return Map.of(
                    "service", "Tỷ Giá Ngoại Tệ & Giá Vàng SJC Realtime",
                    "baseCurrency", "VND",
                    "exchangeRates", Map.of(
                            "USD_VND", 25450.00,
                            "EUR_VND", 27680.00,
                            "JPY_VND", 168.50,
                            "GBP_VND", 32890.00,
                            "CNY_VND", 3520.00
                    ),
                    "goldPriceSJC", Map.of(
                            "buyPriceVND", 88500000,
                            "sellPriceVND", 90500000,
                            "unit", "1 Lượng (Cây) Vàng SJC 9999"
                    ),
                    "updatedAt", Instant.now().toString()
            );
        }

        // 7. 🪙 TÀI CHÍNH: Giá Tiền Điện Tử Realtime (Crypto Market)
        if (ep.contains("crypto-price") || ep.contains("crypto")) {
            return Map.of(
                    "service", "Dữ Liệu Giá Tiền Điện Tử Realtime (Crypto)",
                    "marketSummary", Map.of(
                            "BTC_USD", Map.of("price", 67850.00, "change24h", "+3.45%"),
                            "ETH_USD", Map.of("price", 3520.00, "change24h", "+2.12%"),
                            "SOL_USD", Map.of("price", 168.50, "change24h", "+5.80%"),
                            "USDT_VND", Map.of("price", 25800.00, "change24h", "+0.05%")
                    ),
                    "totalMarketCapUSD", "2.48 Trillion",
                    "updatedAt", Instant.now().toString()
            );
        }

        // 8. 🚗 GIAO THÔNG: Tra cứu Phạt nguội Toàn quốc
        if (ep.contains("traffic-fine") || ep.contains("phat-nguoi")) {
            return Map.of(
                    "service", "Tra Cứu Phạt Nguội Phương Tiện Giao Thông",
                    "plateNumber", "30A-999.88",
                    "vehicleType", "Ô tô con",
                    "status", "CHƯA NỘP PHẠT",
                    "violations", List.of(
                            Map.of(
                                    "time", "2026-08-10 14:25:00",
                                    "location", "Ngã tư Phạm Hùng - Mễ Trì, Hà Nội",
                                    "behavior", "Chạy quá tốc độ quy định từ 10 km/h đến 20 km/h",
                                    "fineAmountVND", 4000000,
                                    "resolvingUnit", "Đội CSGT Số 6 - Công an TP Hà Nội"
                            )
                    )
            );
        }

        // 9. 📍 ĐỊA LÝ: Đơn vị Hành chính 63 Tỉnh/Thành Việt Nam
        if (ep.contains("vietnam-provinces") || ep.contains("geo")) {
            return Map.of(
                    "service", "Danh Mục Đơn Vị Hành Chính Việt Nam (63 Tỉnh/Thành)",
                    "provinceCode", "01",
                    "provinceName", "Thành phố Hà Nội",
                    "region", "Đồng bằng sông Hồng",
                    "totalDistricts", 30,
                    "sampleDistricts", List.of("Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Cầu Giấy", "Quận Nam Từ Liêm")
            );
        }

        // 10. 📲 VIỄN THÔNG: Cổng Gửi Tin Nhắn SMS OTP / Zalo ZNS
        if (ep.contains("sms-otp") || ep.contains("telecom") || ep.contains("otp")) {
            return Map.of(
                    "service", "Cổng Gửi Tin Nhắn SMS Brandname & Zalo ZNS",
                    "recipientPhone", "0988776655",
                    "brandname", "SMARTGATE",
                    "otpCode", "892156",
                    "messageContent", "[SMARTGATE] Ma xac thuc OTP cua ban la 892156. Hieu luc trong 5 phut. Khong chia se ma nay cho bat ky ai.",
                    "provider", "Viettel Telecom Gateway",
                    "status", "DELIVERED_SUCCESS",
                    "deliveryLatencyMs", 340
            );
        }

        // Mặc định: Dữ liệu chung
        return Map.of(
                "service", "General Data Query Service",
                "status", "SUCCESS",
                "message", "Dữ liệu truy vấn hợp lệ từ SaaS API Platform",
                "latencyMs", 15
        );
    }

    @Override
    public UsageStatsResponse getUserStats(UUID userId) {
        UserEntity user = userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy User"));

        long currentRequests = 0;
        long totalRequests = 0;
        try {
            String currentMinute = String.valueOf(System.currentTimeMillis() / 60000);
            String rateLimitKey = "ratelimit:" + user.getId() + ":" + currentMinute;
            String totalUsageKey = "telemetry:total:" + user.getId();

            String currentReqStr = redisTemplate.opsForValue().get(rateLimitKey);
            currentRequests = currentReqStr != null ? Long.parseLong(currentReqStr) : 0;

            String totalReqStr = redisTemplate.opsForValue().get(totalUsageKey);
            totalRequests = totalReqStr != null ? Long.parseLong(totalReqStr) : 0;
        } catch (Exception e) {
            log.warn("Redis unavailable for getUserStats: {}", e.getMessage());
        }

        int maxAllowed = 60;

        return UsageStatsResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .apiKey(user.getApiKey())
                .totalRequestsUsed(totalRequests)
                .requestsThisMinute(currentRequests)
                .rateLimitPerMinute(maxAllowed)
                .remainingQuotaThisMinute(Math.max(0, maxAllowed - currentRequests))
                .build();
    }
}
