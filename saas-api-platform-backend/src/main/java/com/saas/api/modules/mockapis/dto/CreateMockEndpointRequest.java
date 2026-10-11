package com.saas.api.modules.mockapis.dto;

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
public class CreateMockEndpointRequest {

    @NotBlank(message = "Tên Mock API không được để trống")
    private String name;

    @NotBlank(message = "Đường dẫn path không được để trống")
    private String path; // e.g. /orders or /users/123

    @NotBlank(message = "HTTP Method không được để trống")
    private String httpMethod; // GET, POST, PUT, DELETE

    @NotNull(message = "Mã phản hồi HTTP không được để trống")
    private Integer responseStatus; // 200, 201, 400, 404, etc.

    @NotBlank(message = "JSON Response Body không được để trống")
    private String responseBody;

    private String responseHeaders;
}