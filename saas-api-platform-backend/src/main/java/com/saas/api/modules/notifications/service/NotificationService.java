package com.saas.api.modules.notifications.service;

import com.saas.api.core.model.PageResponse;
import com.saas.api.modules.notifications.dto.response.NotificationResponse;
import com.saas.api.modules.notifications.dto.response.UnreadCountResponse;

import java.util.UUID;

public interface NotificationService {

    PageResponse<NotificationResponse> getMyNotifications(int page, int size);

    UnreadCountResponse getUnreadCount();

    NotificationResponse markAsRead(UUID notificationId);

    void markAllAsRead();

    void createNotification(UUID userId, String title, String content, String type);
}
