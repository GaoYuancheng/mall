package com.mall.monolith.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mall.monolith.model.Coupon;

import java.math.BigDecimal;
import java.util.List;

public interface CouponService {
    void createCoupon(Coupon coupon);
    void deleteCoupon(Long id);
    void updateCoupon(Coupon coupon);
    Coupon getCoupon(Long id);
    IPage<Coupon> listCoupons(Integer pageNum, Integer pageSize);
    void receiveCoupon(Long couponId, Long userId);
    void useCoupon(Long couponId, Long userId, String orderSn);
    List<Coupon> listUserCoupons(Long userId);
    List<Coupon> listUserAvailableCoupons(Long userId, BigDecimal totalAmount);
}
