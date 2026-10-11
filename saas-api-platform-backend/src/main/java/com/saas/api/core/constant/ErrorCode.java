package com.saas.api.core.constant;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // General & System Errors (1xxx)
    SUCCESS(1000, "Thành công", HttpStatus.OK),
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi máy chủ không xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Thông tin đầu vào không hợp lệ", HttpStatus.BAD_REQUEST),
    VALIDATION_FAILED(1002, "Dữ liệu xác thực không hợp lệ", HttpStatus.BAD_REQUEST),
    RESOURCE_NOT_FOUND(1004, "Không tìm thấy tài nguyên yêu cầu", HttpStatus.NOT_FOUND),
    METHOD_NOT_ALLOWED(1005, "Phương thức HTTP không được hỗ trợ", HttpStatus.METHOD_NOT_ALLOWED),

    // Authentication & Authorization (2xxx)
    UNAUTHENTICATED(2001, "Chưa xác thực hoặc phiên làm việc đã hết hạn", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(2002, "Bạn không có quyền truy cập tài nguyên này", HttpStatus.FORBIDDEN),
    INVALID_CREDENTIALS(2003, "Email hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED),
    EMAIL_ALREADY_EXISTS(2004, "Địa chỉ email này đã được sử dụng", HttpStatus.CONFLICT),
    INVALID_API_KEY(2005, "API Key không hợp lệ hoặc đã bị vô hiệu hóa", HttpStatus.UNAUTHORIZED),

    // Domain Business Errors (3xxx)
    PRODUCT_NOT_FOUND(3001, "Không tìm thấy gói dịch vụ API", HttpStatus.NOT_FOUND),
    PRODUCT_CODE_EXISTS(3002, "Mã gói dịch vụ API đã tồn tại", HttpStatus.CONFLICT),
    SUBSCRIPTION_ALREADY_EXISTS(3003, "Tài khoản đã đăng ký gói dịch vụ này", HttpStatus.CONFLICT),
    SUBSCRIPTION_NOT_FOUND(3004, "Không tìm thấy thông tin đăng ký dịch vụ", HttpStatus.NOT_FOUND),
    RATE_LIMIT_EXCEEDED(3005, "Bạn đã vượt quá hạn mức yêu cầu API cho phép", HttpStatus.TOO_MANY_REQUESTS),
    INVOICE_NOT_FOUND(3006, "Không tìm thấy hóa đơn thanh toán", HttpStatus.NOT_FOUND);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
