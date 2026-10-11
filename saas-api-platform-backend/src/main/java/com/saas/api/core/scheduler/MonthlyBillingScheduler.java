package com.saas.api.core.scheduler;

import com.saas.api.modules.invoices.service.InvoiceService;
import com.saas.api.modules.subscriptions.domain.SubscriptionEntity;
import com.saas.api.modules.subscriptions.repository.SubscriptionRepository;
import com.saas.api.modules.users.domain.UserEntity;
import com.saas.api.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class MonthlyBillingScheduler {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final InvoiceService invoiceService;

    // Chạy định kỳ vào 00:00:00 ngày đầu tiên của mỗi tháng (0 0 0 1 * ?)
    // Hoặc chạy kiểm tra mỗi 12 tiếng một lần
    @Scheduled(cron = "${saas.scheduler.monthly-billing-cron:0 0 0 1 * ?}")
    public void runMonthlyBillingAutomation() {
        log.info("⏰ Bắt đầu tiến trình tự động kết toán hóa đơn hàng tháng cho toàn bộ khách hàng...");

        List<UserEntity> activeUsers = userRepository.findAll().stream()
                .filter(u -> !u.isDeleted() && "ACTIVE".equals(u.getStatus()) && "ROLE_DEVELOPER".equals(u.getRole()))
                .toList();

        int processedCount = 0;
        for (UserEntity user : activeUsers) {
            List<SubscriptionEntity> activeSubs = subscriptionRepository.findActiveSubscriptionsByUserIdWithProduct(user.getId());
            if (!activeSubs.isEmpty()) {
                try {
                    log.info("-> Kết toán tự động cho User: {}", user.getEmail());
                    invoiceService.generateInvoiceFromUsage(user.getId());
                    processedCount++;
                } catch (Exception e) {
                    log.error("Lỗi khi kết toán cho User {}: {}", user.getEmail(), e.getMessage());
                }
            }
        }

        log.info("✅ Hoàn tất tiến trình kết toán hàng tháng! Đã xử lý {} hóa đơn.", processedCount);
    }
}
