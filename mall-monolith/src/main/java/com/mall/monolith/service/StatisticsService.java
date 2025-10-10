package com.mall.monolith.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface StatisticsService {
    Map<String, Object> getOverview();

    List<Map<String, Object>> getSales(LocalDate start, LocalDate end, String timeUnit);

    List<Map<String, Object>> getOrders(LocalDate start, LocalDate end, String timeUnit);

    List<Map<String, Object>> getProductRanking(LocalDate start, LocalDate end);

    List<Map<String, Object>> getUserRanking(LocalDate start, LocalDate end);
}


