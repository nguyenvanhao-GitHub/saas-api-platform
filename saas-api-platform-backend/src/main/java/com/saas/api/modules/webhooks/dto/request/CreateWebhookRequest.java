package com.saas.api.modules.webhooks.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateWebhookRequest {

    @NotBlank(message = "URL nhận Webhook không được để trống")
    @URL(message = "URL không đúng định dạng chuẩn HTTP/HTTPS")
    private String targetUrl;

    @NotBlank(message = "Danh sách sự kiện không được để trống")
    @Builder.Default
    private String events = "invoice.paid,subscription.created";
}
