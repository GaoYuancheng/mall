package com.mall.monolith.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mall.common.api.CommonResult;
import com.mall.monolith.model.Coupon;
import com.mall.monolith.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Tag(name = "优惠券管理", description = "优惠券管理接口")
@RestController
@RequestMapping("/coupon")
public class CouponController {
    @Autowired
    private CouponService couponService;

    @Operation(summary = "创建优惠券")
    @PostMapping("/create")
    public CommonResult<String> createCoupon(@Validated @RequestBody Coupon coupon) {
        couponService.createCoupon(coupon);
        return CommonResult.success("创建成功");
    }

    @Operation(summary = "删除优惠券")
    @DeleteMapping("/{id}")
    public CommonResult<String> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return CommonResult.success("删除成功");
    }

    @Operation(summary = "修改优惠券")
    @PutMapping("/update")
    public CommonResult<String> updateCoupon(@Validated @RequestBody Coupon coupon) {
        couponService.updateCoupon(coupon);
        return CommonResult.success("修改成功");
    }

    @Operation(summary = "获取优惠券详情")
    @GetMapping("/{id}")
    public CommonResult<Coupon> getCoupon(@PathVariable Long id) {
        Coupon coupon = couponService.getCoupon(id);
        return CommonResult.success(coupon);
    }

    @Operation(summary = "分页获取优惠券列表")
    @GetMapping("/list")
    public CommonResult<IPage<Coupon>> listCoupons(@RequestParam(defaultValue = "1") Integer pageNum,
                                                  @RequestParam(defaultValue = "10") Integer pageSize) {
        IPage<Coupon> couponPage = couponService.listCoupons(pageNum, pageSize);
        return CommonResult.success(couponPage);
    }

    @Operation(summary = "领取优惠券")
    @PostMapping("/receive/{couponId}")
    public CommonResult<String> receiveCoupon(@PathVariable Long couponId,
                                            @RequestParam Long userId) {
        couponService.receiveCoupon(couponId, userId);
        return CommonResult.success("领取成功");
    }

    @Operation(summary = "使用优惠券")
    @PostMapping("/use")
    public CommonResult<String> useCoupon(@RequestParam Long couponId,
                                        @RequestParam Long userId,
                                        @RequestParam String orderSn) {
        couponService.useCoupon(couponId, userId, orderSn);
        return CommonResult.success("使用成功");
    }

    @Operation(summary = "获取用户优惠券列表")
    @GetMapping("/user/{userId}")
    public CommonResult<List<Coupon>> listUserCoupons(@PathVariable Long userId) {
        List<Coupon> couponList = couponService.listUserCoupons(userId);
        return CommonResult.success(couponList);
    }

    @Operation(summary = "获取用户可用优惠券")
    @GetMapping("/user/{userId}/available")
    public CommonResult<List<Coupon>> listUserAvailableCoupons(@PathVariable Long userId,
                                                              @RequestParam BigDecimal totalAmount) {
        List<Coupon> couponList = couponService.listUserAvailableCoupons(userId, totalAmount);
        return CommonResult.success(couponList);
    }
}
