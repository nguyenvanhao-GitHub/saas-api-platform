package com.saas.api.modules.notifications.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.model.PageResponse;
import com.saas.api.modules.notifications.dto.response.NotificationResponse;
import com.saas.api.modules.notifications.dto.response.UnreadCountResponse;
import com.saas.api.modules.notifications.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "API Quản lý Thông báo In-App Đa kênh")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/me")
    @Operation(summary = "Lấy danh sách thông báo của tôi", description = "Lấy danh sách thông báo phân trang sắp xếp mới nhất")
    public ApiResponse<PageResponse<NotificationResponse>> getMyNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ApiResponse.success(notificationService.getMyNotifications(page, size));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Đếm số lượng thông báo chưa đọc", description = "Trả về số lượng thông báo chưa đọc phục vụ hiển thị Badge")
    public ApiResponse<UnreadCountResponse> getUnreadCount() {
        return ApiResponse.success(notificationService.getUnreadCount());
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Đánh dấu 1 thông báo là đã đọc", description = "Cập nhật trạng thái isRead = true và thời gian readAt")
    public ApiResponse<NotificationResponse> markAsRead(@PathVariable UUID id) {
        return ApiResponse.success("Đánh dấu đã đọc thành công", notificationService.markAsRead(id));
    }

    @PostMapping("/read-all")
    @Operation(summary = "Đánh dấu tất cả thông báo là đã đọc", description = "Chuyển tất cả thông báo chưa đọc của người dùng sang đã đọc")
    public ApiResponse<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ApiResponse.success("Đã đánh dấu tất cả thông báo là đã đọc", null);
    }
}
