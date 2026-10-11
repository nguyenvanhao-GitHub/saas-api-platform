package com.saas.api.core.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.saas.api.core.constant.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.MDC;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    @Builder.Default
    private int code = 1000; // 1000 = Success standard in enterprise systems

    private String message;

    @Builder.Default
    private Instant timestamp = Instant.now();

    private String path;

    private String correlationId;

    private T data;

    private Object errors;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .code(1000)
                .message("Success")
                .correlationId(MDC.get("correlationId"))
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .code(1000)
                .message(message)
                .correlationId(MDC.get("correlationId"))
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode, String path) {
        return ApiResponse.<T>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .path(path)
                .correlationId(MDC.get("correlationId"))
                .build();
    }

    public static <T> ApiResponse<T> error(int code, String message, String path, Object errors) {
        return ApiResponse.<T>builder()
                .code(code)
                .message(message)
                .path(path)
                .correlationId(MDC.get("correlationId"))
                .errors(errors)
                .build();
    }
}
