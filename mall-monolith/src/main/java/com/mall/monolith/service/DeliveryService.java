package com.mall.monolith.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mall.monolith.model.Delivery;

import java.util.List;

public interface DeliveryService {
    void createDelivery(Delivery delivery);
    void updateDelivery(Delivery delivery);
    void deleteDelivery(Long id);
    Delivery getDelivery(Long id);
    Delivery getDeliveryByOrderSn(String orderSn);
    IPage<Delivery> listDeliveries(Integer pageNum, Integer pageSize, String keyword);
    void confirmReceive(String orderSn);
    List<String> getDeliveryTrace(String orderSn);
    void syncDeliveryTrace(String orderSn);
    String generateWaybill(String orderSn);
}
