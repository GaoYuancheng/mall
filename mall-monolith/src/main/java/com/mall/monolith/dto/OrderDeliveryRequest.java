package com.mall.monolith.dto;

import com.mall.monolith.model.Delivery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class OrderDeliveryRequest {
    @Schema(description = "订单号")
    private String orderSn;

    @Schema(description = "物流公司名称")
    private String deliveryCompany;

    @Schema(description = "物流单号")
    private String deliverySn;

    @Schema(description = "收货人姓名")
    private String receiverName;

    @Schema(description = "收货人电话")
    private String receiverPhone;

    @Schema(description = "收货地址")
    private String receiverDetailAddress;

    public Delivery toDelivery() {
        Delivery d = new Delivery();
        d.setOrderSn(orderSn);
        d.setDeliveryCompany(deliveryCompany);
        d.setDeliverySn(deliverySn);
        d.setReceiverName(receiverName);
        d.setReceiverPhone(receiverPhone);
        d.setReceiverDetailAddress(receiverDetailAddress);
        return d;
    }
}


