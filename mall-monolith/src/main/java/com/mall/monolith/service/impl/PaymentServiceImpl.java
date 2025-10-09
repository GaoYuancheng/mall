package com.mall.monolith.service.impl;

import com.mall.monolith.model.PaymentInfo;
import com.mall.monolith.service.PaymentService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PaymentServiceImpl implements PaymentService {
    
    @Override
    public String pay(PaymentInfo paymentInfo) {
        // TODO: 实现支付逻辑
        System.out.println("创建支付订单: " + paymentInfo.getOrderSn());
        return "PAYMENT-" + System.currentTimeMillis();
    }
    
    @Override
    public String handleAlipayCallback(String callbackContent) {
        // TODO: 实现支付宝回调处理逻辑
        System.out.println("处理支付宝回调: " + callbackContent);
        return "success";
    }
    
    @Override
    public String handleWechatPayCallback(String callbackContent) {
        // TODO: 实现微信支付回调处理逻辑
        System.out.println("处理微信支付回调: " + callbackContent);
        return "success";
    }
    
    @Override
    public PaymentInfo queryPaymentStatus(String orderSn) {
        // TODO: 实现查询支付状态逻辑
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setOrderSn(orderSn);
        paymentInfo.setPaymentStatus("SUCCESS");
        return paymentInfo;
    }
    
    @Override
    public void closePayment(String orderSn) {
        // TODO: 实现关闭支付订单逻辑
        System.out.println("关闭支付订单: " + orderSn);
    }
    
    @Override
    public String refund(String orderSn, BigDecimal refundAmount) {
        // TODO: 实现退款逻辑
        System.out.println("退款: orderSn=" + orderSn + ", amount=" + refundAmount);
        return "REFUND-" + System.currentTimeMillis();
    }
}
