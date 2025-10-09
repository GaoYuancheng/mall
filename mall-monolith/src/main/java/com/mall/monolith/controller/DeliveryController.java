package com.mall.monolith.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mall.common.api.CommonResult;
import com.mall.monolith.model.Delivery;
import com.mall.monolith.service.DeliveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "物流管理", description = "物流管理接口")
@RestController
@RequestMapping("/delivery")
public class DeliveryController {
    @Autowired
    private DeliveryService deliveryService;

    @Operation(summary = "创建物流订单")
    @PostMapping("/create")
    public CommonResult<String> createDelivery(@Validated @RequestBody Delivery delivery) {
        deliveryService.createDelivery(delivery);
        return CommonResult.success("创建成功");
    }

    @Operation(summary = "更新物流订单")
    @PutMapping("/update")
    public CommonResult<String> updateDelivery(@Validated @RequestBody Delivery delivery) {
        deliveryService.updateDelivery(delivery);
        return CommonResult.success("更新成功");
    }

    @Operation(summary = "删除物流订单")
    @DeleteMapping("/{id}")
    public CommonResult<String> deleteDelivery(@PathVariable Long id) {
        deliveryService.deleteDelivery(id);
        return CommonResult.success("删除成功");
    }

    @Operation(summary = "获取物流订单详情")
    @GetMapping("/{id}")
    public CommonResult<Delivery> getDelivery(@PathVariable Long id) {
        Delivery delivery = deliveryService.getDelivery(id);
        return CommonResult.success(delivery);
    }

    @Operation(summary = "获取订单物流信息")
    @GetMapping("/order/{orderSn}")
    public CommonResult<Delivery> getDeliveryByOrderSn(@PathVariable String orderSn) {
        Delivery delivery = deliveryService.getDeliveryByOrderSn(orderSn);
        return CommonResult.success(delivery);
    }

    @Operation(summary = "分页获取物流订单列表")
    @GetMapping("/list")
    public CommonResult<IPage<Delivery>> listDeliveries(@RequestParam(defaultValue = "1") Integer pageNum,
                                                       @RequestParam(defaultValue = "10") Integer pageSize,
                                                       @RequestParam(required = false) String keyword) {
        IPage<Delivery> deliveryPage = deliveryService.listDeliveries(pageNum, pageSize, keyword);
        return CommonResult.success(deliveryPage);
    }

    @Operation(summary = "确认收货")
    @PostMapping("/confirm/{orderSn}")
    public CommonResult<String> confirmReceive(@PathVariable String orderSn) {
        deliveryService.confirmReceive(orderSn);
        return CommonResult.success("确认收货成功");
    }

    @Operation(summary = "获取物流轨迹")
    @GetMapping("/trace/{orderSn}")
    public CommonResult<List<String>> getDeliveryTrace(@PathVariable String orderSn) {
        List<String> traceList = deliveryService.getDeliveryTrace(orderSn);
        return CommonResult.success(traceList);
    }

    @Operation(summary = "同步物流轨迹")
    @PostMapping("/trace/sync/{orderSn}")
    public CommonResult<String> syncDeliveryTrace(@PathVariable String orderSn) {
        deliveryService.syncDeliveryTrace(orderSn);
        return CommonResult.success("同步成功");
    }

    @Operation(summary = "生成电子面单")
    @PostMapping("/waybill/{orderSn}")
    public CommonResult<String> generateWaybill(@PathVariable String orderSn) {
        String waybill = deliveryService.generateWaybill(orderSn);
        return CommonResult.success(waybill);
    }
}
