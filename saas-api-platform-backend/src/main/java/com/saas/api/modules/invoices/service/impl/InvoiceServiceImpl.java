package com.saas.api.modules.invoices.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.core.model.PageResponse;
import com.saas.api.modules.invoices.domain.InvoiceEntity;
import com.saas.api.modules.invoices.dto.response.InvoiceResponse;
import com.saas.api.modules.invoices.mapper.InvoiceMapper;
import com.saas.api.modules.invoices.repository.InvoiceRepository;
import com.saas.api.modules.invoices.service.InvoiceService;
import com.saas.api.modules.subscriptions.domain.SubscriptionEntity;
import com.saas.api.modules.subscriptions.repository.SubscriptionRepository;
import com.saas.api.modules.subscriptions.service.SubscriptionService;
import com.saas.api.modules.users.domain.UserEntity;
import com.saas.api.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionService subscriptionService;
    private final InvoiceMapper invoiceMapper;
    private final JavaMailSender mailSender;
    private final com.saas.api.modules.invoices.service.PdfInvoiceService pdfInvoiceService;

    @Value("${saas.storage.s3.bucket:saas-invoices-storage}")
    private String s3Bucket;

    @Override
    @Transactional
    public InvoiceResponse createInvoice(UUID userId, BigDecimal amount) {
        UserEntity user = userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy User"));

        String invoiceNo = "INV-" + (System.currentTimeMillis() % 1000000);

        InvoiceEntity invoice = InvoiceEntity.builder()
                .invoiceNumber(invoiceNo)
                .user(user)
                .amount(amount)
                .status("PAID")
                .build();

        InvoiceEntity saved = invoiceRepository.save(invoice);

        // Sinh file PDF thực tế và upload lên Storage
        try {
            String pdfUrl = pdfInvoiceService.generateAndUploadInvoicePdf(saved);
            saved.setS3PdfUrl(pdfUrl);
            saved = invoiceRepository.save(saved);
            sendInvoiceEmailAsync(user.getEmail(), invoiceNo, amount, pdfUrl);
        } catch (Exception e) {
            log.warn("Không thể upload PDF lên S3/MinIO: {}", e.getMessage());
        }

        return invoiceMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public InvoiceResponse generateInvoiceFromUsage(UUID userId) {
        log.info("Tự động kết toán hóa đơn từ lưu lượng sử dụng của User {}", userId);
        UserEntity user = userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy User"));

        List<SubscriptionEntity> activeSubs = subscriptionRepository.findActiveSubscriptionsByUserIdWithProduct(userId);
        if (activeSubs.isEmpty()) {
            throw new BusinessException(ErrorCode.SUBSCRIPTION_NOT_FOUND, "Bạn chưa đăng ký gói dịch vụ nào");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (SubscriptionEntity sub : activeSubs) {
            BigDecimal fee = subscriptionService.calculateBilling(sub);
            totalAmount = totalAmount.add(fee);
        }

        if (totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            totalAmount = BigDecimal.valueOf(0.00);
        }

        String invoiceNo = "INV-AUTO-" + (System.currentTimeMillis() % 1000000);

        InvoiceEntity invoice = InvoiceEntity.builder()
                .invoiceNumber(invoiceNo)
                .user(user)
                .amount(totalAmount)
                .status("PENDING")
                .build();

        InvoiceEntity saved = invoiceRepository.save(invoice);

        try {
            String pdfUrl = pdfInvoiceService.generateAndUploadInvoicePdf(saved);
            saved.setS3PdfUrl(pdfUrl);
            saved = invoiceRepository.save(saved);
            sendInvoiceEmailAsync(user.getEmail(), invoiceNo, totalAmount, pdfUrl);
        } catch (Exception e) {
            log.warn("Không thể upload PDF lên S3/MinIO: {}", e.getMessage());
        }

        return invoiceMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getUserInvoices(UUID userId) {
        return invoiceRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(invoiceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<InvoiceResponse> getAllInvoices(Pageable pageable) {
        Page<InvoiceEntity> page = invoiceRepository.findAll(pageable);
        return PageResponse.from(page.map(invoiceMapper::toResponse));
    }

    @Override
    @Transactional
    public InvoiceResponse payInvoice(UUID userId, UUID invoiceId) {
        log.info("Thanh toán hóa đơn {} của User {}", invoiceId, userId);
        InvoiceEntity invoice = invoiceRepository.findById(invoiceId)
                .filter(i -> i.getUser().getId().equals(userId))
                .orElseThrow(() -> new BusinessException(ErrorCode.INVOICE_NOT_FOUND));

        invoice.setStatus("PAID");
        InvoiceEntity saved = invoiceRepository.save(invoice);
        return invoiceMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] getInvoicePdfBytes(UUID userId, UUID invoiceId) {
        InvoiceEntity invoice = invoiceRepository.findById(invoiceId)
                .filter(i -> i.getUser().getId().equals(userId) || "ROLE_ADMIN".equals(i.getUser().getRole()))
                .orElseThrow(() -> new BusinessException(ErrorCode.INVOICE_NOT_FOUND));

        return pdfInvoiceService.generateInvoicePdf(invoice);
    }

    @Override
    @Async
    public void sendInvoiceEmailAsync(String toEmail, String invoiceNo, BigDecimal amount, String pdfUrl) {
        try {
            log.info("Đang gửi Email Hóa đơn {} tới {} bất đồng bộ...", invoiceNo, toEmail);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("billing@saas-platform.com");
            message.setTo(toEmail);
            message.setSubject("[SaaS Platform] Hóa Đơn Dịch Vụ API " + invoiceNo);
            message.setText("Xin chào,\n\nHóa đơn thanh toán dịch vụ API " + invoiceNo + " trị giá " + amount + " USD đã được khởi tạo thành công.\n\nLink tải PDF Hóa đơn: " + pdfUrl + "\n\nTrân trọng,\nSaaS Billing Team");

            mailSender.send(message);
            log.info("Gửi Email Hóa đơn {} tới {} THÀNH CÔNG!", invoiceNo, toEmail);
        } catch (Exception e) {
            log.error("Lỗi khi gửi Email bất đồng bộ: {}", e.getMessage());
        }
    }
}
