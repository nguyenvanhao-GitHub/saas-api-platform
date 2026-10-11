package com.saas.api.modules.audit.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.model.PageResponse;
import com.saas.api.modules.audit.dto.response.AuditLogResponse;
import com.saas.api.modules.audit.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Security Audit Logs", description = "API Quản lý & Tra cứu Nhật Ký An Ninh Hệ Thống (Admin)")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Quản trị viên xem danh sách Audit Logs (Phân trang)", description = "Yêu cầu quyền ROLE_ADMIN")
    public ApiResponse<PageResponse<AuditLogResponse>> getAllAuditLogs(
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ApiResponse.success(auditLogService.getAllAuditLogs(pageable));
    }
}
