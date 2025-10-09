package com.mall.monolith.service;

import com.mall.monolith.model.PaymentInfo;

import java.math.BigDecimal;

public interface PaymentService {
    String pay(PaymentInfo paymentInfo);
    String handleAlipayCallback(String callbackContent);
    String handleWechatPayCallback(String callbackContent);
    PaymentInfo queryPaymentStatus(String orderSn);
    void closePayment(String orderSn);
    String refund(String orderSn, BigDecimal refundAmount);
}
