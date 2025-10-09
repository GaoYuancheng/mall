package com.mall.monolith.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mall.monolith.model.Order;

public interface OrderService {
    String createOrder(Order order);
    void cancelOrder(String orderSn);
    void deleteOrder(String orderSn);
    void payOrder(String orderSn);
    void confirmReceiveOrder(String orderSn);
    Order getOrder(String orderSn);
    IPage<Order> listUserOrders(Long userId, Integer pageNum, Integer pageSize);
    IPage<Order> listOrders(Integer pageNum, Integer pageSize, String keyword);
}
