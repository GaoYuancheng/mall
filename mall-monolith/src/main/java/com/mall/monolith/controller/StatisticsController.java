package com.mall.monolith.controller;

import com.mall.common.api.CommonResult;
import com.mall.monolith.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Tag(name = "统计管理", description = "统计数据接口")
@RestController
@RequestMapping("/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @Operation(summary = "概览数据")
    @GetMapping("/overview")
    public CommonResult<Map<String, Object>> overview() {
        return CommonResult.success(statisticsService.getOverview());
    }

    @Operation(summary = "销售趋势")
    @GetMapping("/sales")
    public CommonResult<List<Map<String, Object>>> sales(@RequestParam String startTime,
                                                         @RequestParam String endTime,
                                                         @RequestParam String timeUnit) {
        LocalDate start = LocalDate.parse(startTime);
        LocalDate end = LocalDate.parse(endTime);
        return CommonResult.success(statisticsService.getSales(start, end, timeUnit));
    }

    @Operation(summary = "订单趋势")
    @GetMapping("/orders")
    public CommonResult<List<Map<String, Object>>> orders(@RequestParam String startTime,
                                                          @RequestParam String endTime,
                                                          @RequestParam String timeUnit) {
        LocalDate start = LocalDate.parse(startTime);
        LocalDate end = LocalDate.parse(endTime);
        return CommonResult.success(statisticsService.getOrders(start, end, timeUnit));
    }

    @Operation(summary = "商品销售排行")
    @GetMapping("/products/ranking")
    public CommonResult<List<Map<String, Object>>> productRanking(@RequestParam String startTime,
                                                                  @RequestParam String endTime) {
        LocalDate start = LocalDate.parse(startTime);
        LocalDate end = LocalDate.parse(endTime);
        return CommonResult.success(statisticsService.getProductRanking(start, end));
    }

    @Operation(summary = "用户消费排行")
    @GetMapping("/users/ranking")
    public CommonResult<List<Map<String, Object>>> userRanking(@RequestParam String startTime,
                                                               @RequestParam String endTime) {
        LocalDate start = LocalDate.parse(startTime);
        LocalDate end = LocalDate.parse(endTime);
        return CommonResult.success(statisticsService.getUserRanking(start, end));
    }
}


