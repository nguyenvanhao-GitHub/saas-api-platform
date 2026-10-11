package com.saas.api.modules.coupons.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.modules.coupons.dto.request.CreateCouponRequest;
import com.saas.api.modules.coupons.dto.request.ValidateCouponRequest;
import com.saas.api.modules.coupons.dto.response.CouponResponse;
import com.saas.api.modules.coupons.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons & Discounts", description = "API Quản lý Mã Giảm Giá & Tính Toán Khuyến Mãi")
public class CouponController {

    private final CouponService couponService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Tạo mã giảm giá mới (Admin)", description = "Yêu cầu quyền ROLE_ADMIN")
    public ApiResponse<CouponResponse> createCoupon(@Valid @RequestBody CreateCouponRequest request) {
        return ApiResponse.success("Tạo mã giảm giá thành công", couponService.createCoupon(request));
    }

    @PostMapping("/validate")
    @Operation(summary = "Kiểm tra và tính toán giảm giá", description = "Tính số tiền giảm và giá cuối cùng khi áp mã")
    public ApiResponse<CouponResponse> validateCoupon(@Valid @RequestBody ValidateCouponRequest request) {
        return ApiResponse.success("Mã giảm giá hợp lệ", couponService.validateAndCalculateDiscount(request));
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách mã giảm giá đang hoạt động", description = "Công khai danh sách mã khuyến mãi")
    public ApiResponse<List<CouponResponse>> getAllCoupons() {
        return ApiResponse.success(couponService.getAllCoupons());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa mã giảm giá (Admin)", description = "Đánh dấu cờ xóa mềm")
    public void deleteCoupon(@PathVariable UUID id) {
        couponService.deleteCoupon(id);
    }
}
