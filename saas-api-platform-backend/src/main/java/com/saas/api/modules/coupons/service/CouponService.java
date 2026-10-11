package com.saas.api.modules.coupons.service;

import com.saas.api.modules.coupons.dto.request.CreateCouponRequest;
import com.saas.api.modules.coupons.dto.request.ValidateCouponRequest;
import com.saas.api.modules.coupons.dto.response.CouponResponse;

import java.util.List;
import java.util.UUID;

public interface CouponService {

    CouponResponse createCoupon(CreateCouponRequest request);

    CouponResponse validateAndCalculateDiscount(ValidateCouponRequest request);

    List<CouponResponse> getAllCoupons();

    void deleteCoupon(UUID couponId);
}
