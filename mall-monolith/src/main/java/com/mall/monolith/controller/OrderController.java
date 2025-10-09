package com.mall.monolith.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mall.common.api.CommonResult;
import com.mall.monolith.model.Order;
import com.mall.monolith.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Tag(name = "订单管理", description = "订单管理接口")
@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Operation(summary = "创建订单")
    @PostMapping("/create")
    public CommonResult<String> createOrder(@RequestBody Order order) {
        String orderSn = orderService.createOrder(order);
        return CommonResult.success(orderSn, "创建成功");
    }

    @Operation(summary = "取消订单")
    @PostMapping("/cancel/{orderSn}")
    public CommonResult<String> cancelOrder(@PathVariable String orderSn) {
        orderService.cancelOrder(orderSn);
        return CommonResult.success("取消成功");
    }

    @Operation(summary = "删除订单")
    @DeleteMapping("/{orderSn}")
    public CommonResult<String> deleteOrder(@PathVariable String orderSn) {
        orderService.deleteOrder(orderSn);
        return CommonResult.success("删除成功");
    }

    @Operation(summary = "支付订单")
    @PostMapping("/pay/{orderSn}")
    public CommonResult<String> payOrder(@PathVariable String orderSn) {
        orderService.payOrder(orderSn);
        return CommonResult.success("支付成功");
    }

    @Operation(summary = "确认收货")
    @PostMapping("/confirm/{orderSn}")
    public CommonResult<String> confirmReceiveOrder(@PathVariable String orderSn) {
        orderService.confirmReceiveOrder(orderSn);
        return CommonResult.success("确认收货成功");
    }

    @Operation(summary = "获取订单详情")
    @GetMapping("/{orderSn}")
    public CommonResult<Order> getOrder(@PathVariable String orderSn) {
        Order order = orderService.getOrder(orderSn);
        return CommonResult.success(order);
    }

    @Operation(summary = "获取用户订单列表")
    @GetMapping("/user/{userId}")
    public CommonResult<IPage<Order>> listUserOrders(@PathVariable Long userId,
                                                    @RequestParam(defaultValue = "1") Integer pageNum,
                                                    @RequestParam(defaultValue = "10") Integer pageSize) {
        IPage<Order> orderPage = orderService.listUserOrders(userId, pageNum, pageSize);
        return CommonResult.success(orderPage);
    }

    @Operation(summary = "分页获取所有订单")
    @GetMapping("/list")
    public CommonResult<IPage<Order>> listOrders(@RequestParam(defaultValue = "1") Integer pageNum,
                                                @RequestParam(defaultValue = "10") Integer pageSize,
                                                @RequestParam(required = false) String keyword) {
        IPage<Order> orderPage = orderService.listOrders(pageNum, pageSize, keyword);
        return CommonResult.success(orderPage);
    }
}
