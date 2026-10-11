package com.saas.api.modules.invoices.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.model.PageResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.invoices.dto.response.InvoiceResponse;
import com.saas.api.modules.invoices.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoices & Billing", description = "API Quản lý Hóa đơn, Kết toán Tự động & Xuất File PDF AWS S3")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Tạo hóa đơn thanh toán thủ công & Gửi Email Async", description = "Tự động sinh URL PDF S3 và gửi Email thông báo")
    public ApiResponse<InvoiceResponse> createInvoice(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "15.50") BigDecimal amount
    ) {
        return ApiResponse.success("Tạo hóa đơn thành công", invoiceService.createInvoice(principal.getId(), amount));
    }

    @PostMapping("/generate")
    @Operation(summary = "Tự động kết toán hóa đơn từ lưu lượng sử dụng", description = "Đọc số liệu API usage và tính phí qua Strategy Pattern")
    public ApiResponse<InvoiceResponse> generateInvoice(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success("Kết toán hóa đơn thành công", invoiceService.generateInvoiceFromUsage(principal.getId()));
    }

    @GetMapping("/me")
    @Operation(summary = "Xem lịch sử hóa đơn cá nhân", description = "Truy vấn danh sách hóa đơn sắp xếp giảm dần theo thời gian")
    public ApiResponse<List<InvoiceResponse>> getMyInvoices(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(invoiceService.getUserInvoices(principal.getId()));
    }

    @PostMapping("/{id}/pay")
    @Operation(summary = "Thanh toán hóa đơn", description = "Chuyển trạng thái hóa đơn sang PAID")
    public ApiResponse<InvoiceResponse> payInvoice(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        return ApiResponse.success("Thanh toán hóa đơn thành công", invoiceService.payInvoice(principal.getId(), id));
    }

    @GetMapping("/{id}/pdf")
    @Operation(summary = "Tải trực tiếp File PDF Hóa đơn nhị phân", description = "Trả về luồng file PDF thực tế được sinh bởi OpenPDF")
    public org.springframework.http.ResponseEntity<byte[]> downloadInvoicePdf(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        byte[] pdfBytes = invoiceService.getInvoicePdfBytes(principal.getId(), id);
        return org.springframework.http.ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"invoice-" + id + ".pdf\"")
                .body(pdfBytes);
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Xuất danh sách hóa đơn ra file CSV", description = "Tải toàn bộ lịch sử hóa đơn dưới dạng file CSV")
    public org.springframework.http.ResponseEntity<byte[]> exportInvoicesCsv(@AuthenticationPrincipal UserPrincipal principal) {
        List<InvoiceResponse> invoices = invoiceService.getUserInvoices(principal.getId());
        StringBuilder csv = new StringBuilder();
        csv.append("\uFEFF"); // UTF-8 BOM for Excel support
        csv.append("Invoice Number,Issue Date,Amount (USD),Status,S3 PDF URL\n");
        for (InvoiceResponse inv : invoices) {
            csv.append(String.format("\"%s\",\"%s\",%.2f,\"%s\",\"%s\"\n",
                    inv.getInvoiceNumber() != null ? inv.getInvoiceNumber() : inv.getId().toString(),
                    inv.getCreatedAt() != null ? inv.getCreatedAt().toString() : "",
                    inv.getAmount() != null ? inv.getAmount() : 0.0,
                    inv.getStatus() != null ? inv.getStatus() : "PENDING",
                    inv.getS3PdfUrl() != null ? inv.getS3PdfUrl() : ""
            ));
        }

        byte[] csvBytes = csv.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return org.springframework.http.ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"invoices-report.csv\"")
                .body(csvBytes);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Quản trị viên xem danh sách toàn bộ hóa đơn (Phân trang)", description = "Yêu cầu quyền ROLE_ADMIN")
    public ApiResponse<PageResponse<InvoiceResponse>> getAllInvoices(
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ApiResponse.success(invoiceService.getAllInvoices(pageable));
    }
}
