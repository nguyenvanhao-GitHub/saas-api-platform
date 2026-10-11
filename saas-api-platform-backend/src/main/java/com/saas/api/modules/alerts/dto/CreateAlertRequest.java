package com.saas.api.modules.alerts.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAlertRequest {

    @NotNull(message = "Ngưỡng cảnh báo không được để trống")
    @Min(value = 1, message = "Ngưỡng cảnh báo tối thiểu là 1%")
    @Max(value = 100, message = "Ngưỡng cảnh báo tối đa là 100%")
    private Integer thresholdPercentage;

    @NotBlank(message = "Kênh cảnh báo không được để trống")
    private String channel; // IN_APP, EMAIL, SLACK, DISCORD

    private String destination; // Email or Webhook URL
}
