package com.saas.api.modules.coupons.repository;

import com.saas.api.modules.coupons.domain.CouponUsageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsageEntity, UUID> {

    boolean existsByUserIdAndCouponId(UUID userId, UUID couponId);

    List<CouponUsageEntity> findByUserIdOrderByUsedAtDesc(UUID userId);
}
