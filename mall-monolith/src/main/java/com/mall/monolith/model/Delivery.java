package com.mall.monolith.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("delivery")
public class Delivery {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String orderSn;
    private String deliveryCompany;
    private String deliverySn;
    private String receiverName;
    private String receiverPhone;
    private String receiverPostCode;
    private String receiverProvince;
    private String receiverCity;
    private String receiverRegion;
    private String receiverDetailAddress;
    private String note;
    private Integer confirmStatus;
    private LocalDateTime deliveryTime;
    private LocalDateTime receiveTime;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
