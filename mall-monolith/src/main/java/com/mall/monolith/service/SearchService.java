package com.mall.monolith.service;

import com.mall.monolith.model.Product;

import java.math.BigDecimal;
import java.util.List;

public interface SearchService {
    int importAll();
    void delete(Long id);
    Product create(Long id);
    void delete(List<Long> ids);
    List<Product> search(String keyword, Integer pageNum, Integer pageSize);
    List<Product> search(String keyword, Long categoryId, String brandName, 
                        BigDecimal minPrice, BigDecimal maxPrice, 
                        Integer pageNum, Integer pageSize, Integer sort);
    List<Product> recommend(Long id, Integer pageSize);
    List<String> getHotSearchKeywords();
}
