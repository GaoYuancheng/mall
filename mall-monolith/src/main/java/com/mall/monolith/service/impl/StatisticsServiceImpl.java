package com.mall.monolith.service.impl;

import com.mall.monolith.service.StatisticsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class StatisticsServiceImpl implements StatisticsService {
    @Override
    public Map<String, Object> getOverview() {
        Map<String, Object> map = new HashMap<>();
        map.put("todaySales", 12345.67);
        map.put("todayOrders", 89);
        map.put("todayUsers", 12);
        map.put("conversionRate", 3.45);
        return map;
    }

    @Override
    public List<Map<String, Object>> getSales(LocalDate start, LocalDate end, String timeUnit) {
        List<Map<String, Object>> list = new ArrayList<>();
        LocalDate cur = start;
        while (!cur.isAfter(end)) {
            Map<String, Object> row = new HashMap<>();
            row.put("date", cur.toString());
            row.put("amount", new Random().nextInt(10000));
            list.add(row);
            cur = cur.plusDays(1);
        }
        return list;
    }

    @Override
    public List<Map<String, Object>> getOrders(LocalDate start, LocalDate end, String timeUnit) {
        List<Map<String, Object>> list = new ArrayList<>();
        LocalDate cur = start;
        while (!cur.isAfter(end)) {
            Map<String, Object> row = new HashMap<>();
            row.put("date", cur.toString());
            row.put("count", new Random().nextInt(200));
            list.add(row);
            cur = cur.plusDays(1);
        }
        return list;
    }

    @Override
    public List<Map<String, Object>> getProductRanking(LocalDate start, LocalDate end) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Map<String, Object> row = new HashMap<>();
            row.put("id", (long) i);
            row.put("picture", "https://via.placeholder.com/50");
            row.put("name", "商品" + i);
            row.put("sales", new Random().nextInt(1000));
            row.put("amount", new Random().nextInt(100000) / 100.0);
            list.add(row);
        }
        return list;
    }

    @Override
    public List<Map<String, Object>> getUserRanking(LocalDate start, LocalDate end) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Map<String, Object> row = new HashMap<>();
            row.put("id", (long) i);
            row.put("username", "user" + i);
            row.put("orderCount", new Random().nextInt(50));
            row.put("amount", new Random().nextInt(100000) / 100.0);
            list.add(row);
        }
        return list;
    }
}


