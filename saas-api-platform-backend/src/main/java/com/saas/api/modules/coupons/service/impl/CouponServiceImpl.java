package com.saas.api.modules.coupons.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.modules.coupons.domain.CouponEntity;
import com.saas.api.modules.coupons.dto.request.CreateCouponRequest;
import com.saas.api.modules.coupons.dto.request.ValidateCouponRequest;
import com.saas.api.modules.coupons.dto.response.CouponResponse;
import com.saas.api.modules.coupons.repository.CouponRepository;
import com.saas.api.modules.coupons.service.CouponService;
import com.saas.api.core.security.SecurityUtils;
import com.saas.api.modules.coupons.repository.CouponUsageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;

    @Override
    @Transactional
    public CouponResponse createCoupon(CreateCouponRequest request) {
        log.info("Tạo mã giảm giá mới: {}", request.getCode());

        couponRepository.findByCodeAndIsDeletedFalse(request.getCode().toUpperCase()).ifPresent(c -> {
            throw new BusinessException(ErrorCode.INVALID_KEY, "Mã giảm giá đã tồn tại");
        });

        CouponEntity coupon = CouponEntity.builder()
                .code(request.getCode().toUpperCase())
                .discountType(request.getDiscountType().toUpperCase())
                .discountValue(request.getDiscountValue())
                .maxUses(request.getMaxUses())
                .timesUsed(0)
                .expiresAt(request.getExpiresAt())
                .status("ACTIVE")
                .build();

        CouponEntity saved = couponRepository.save(coupon);
        return mapToResponse(saved, null, null);
    }

    @Override
    @Transactional
    public CouponResponse validateAndCalculateDiscount(ValidateCouponRequest request) {
        log.info("Kiểm tra mã giảm giá: {}", request.getCode());

        CouponEntity coupon = couponRepository.findByCodeAndIsDeletedFalse(request.getCode().toUpperCase())
                .filter(c -> "ACTIVE".equals(c.getStatus()))
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Mã giảm giá không hợp lệ hoặc đã hết hạn"));

        if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(Instant.now())) {
            throw new BusinessException(ErrorCode.INVALID_KEY, "Mã giảm giá đã hết hạn sử dụng");
        }

        if (coupon.getTimesUsed() >= coupon.getMaxUses()) {
            throw new BusinessException(ErrorCode.INVALID_KEY, "Mã giảm giá đã hết lượt sử dụng");
        }

        SecurityUtils.getCurrentUserId().ifPresent(userId -> {
            if (couponUsageRepository.existsByUserIdAndCouponId(userId, coupon.getId())) {
                throw new BusinessException(ErrorCode.INVALID_KEY, "Tài khoản của bạn đã sử dụng mã giảm giá này");
            }
        });

        BigDecimal originalPrice = request.getOriginalPrice() != null ? request.getOriginalPrice() : BigDecimal.ZERO;
        BigDecimal discountAmount;

        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            BigDecimal percentage = coupon.getDiscountValue().divide(BigDecimal.valueOf(100));
            discountAmount = originalPrice.multiply(percentage);
        } else {
            discountAmount = coupon.getDiscountValue();
        }

        BigDecimal finalPrice = originalPrice.subtract(discountAmount);
        if (finalPrice.compareTo(BigDecimal.ZERO) < 0) {
            finalPrice = BigDecimal.ZERO;
        }

        return mapToResponse(coupon, discountAmount, finalPrice);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponResponse> getAllCoupons() {
        return couponRepository.findAll().stream()
                .filter(c -> !c.isDeleted())
                .map(c -> mapToResponse(c, null, null))
                .toList();
    }

    @Override
    @Transactional
    public void deleteCoupon(UUID couponId) {
        CouponEntity coupon = couponRepository.findById(couponId)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy mã giảm giá"));

        coupon.setDeleted(true);
        couponRepository.save(coupon);
    }

    private CouponResponse mapToResponse(CouponEntity entity, BigDecimal discountAmount, BigDecimal finalPrice) {
        return CouponResponse.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .discountType(entity.getDiscountType())
                .discountValue(entity.getDiscountValue())
                .maxUses(entity.getMaxUses())
                .timesUsed(entity.getTimesUsed())
                .expiresAt(entity.getExpiresAt())
                .status(entity.getStatus())
                .discountedAmount(discountAmount)
                .finalPrice(finalPrice)
                .build();
    }
}
