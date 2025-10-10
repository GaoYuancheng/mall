package com.mall.monolith.controller;

import com.mall.common.api.CommonResult;
import com.mall.monolith.model.PaymentInfo;
import com.mall.monolith.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@Tag(name = "支付管理", description = "支付管理接口")
@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @Operation(summary = "创建支付订单")
    @PostMapping("/pay")
    public CommonResult<String> pay(@RequestBody PaymentInfo paymentInfo) {
        String result = paymentService.pay(paymentInfo);
        return CommonResult.success(result);
    }

    @Operation(summary = "支付宝支付回调")
    @PostMapping("/alipay/callback")
    public String handleAlipayCallback(@RequestBody String callbackContent) {
        return paymentService.handleAlipayCallback(callbackContent);
    }

    @Operation(summary = "微信支付回调")
    @PostMapping("/wechat/callback")
    public String handleWechatPayCallback(@RequestBody String callbackContent) {
        return paymentService.handleWechatPayCallback(callbackContent);
    }

    @Operation(summary = "查询支付状态")
    @GetMapping("/status/{orderSn}")
    public CommonResult<PaymentInfo> queryPaymentStatus(@PathVariable String orderSn) {
        PaymentInfo paymentInfo = paymentService.queryPaymentStatus(orderSn);
        return CommonResult.success(paymentInfo);
    }

    @Operation(summary = "关闭支付订单")
    @PostMapping("/close/{orderSn}")
    public CommonResult<String> closePayment(@PathVariable String orderSn) {
        paymentService.closePayment(orderSn);
        return CommonResult.success("关闭成功");
    }

    @Operation(summary = "退款")
    @PostMapping("/refund/{orderSn}")
    public CommonResult<String> refund(@PathVariable String orderSn,
                                     @RequestParam BigDecimal refundAmount) {
        String result = paymentService.refund(orderSn, refundAmount);
        return CommonResult.success(result);
    }
}
