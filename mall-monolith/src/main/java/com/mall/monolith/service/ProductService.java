package com.mall.monolith.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mall.monolith.model.Product;

public interface ProductService {
    void createProduct(Product product);
    void updateProduct(Product product);
    void deleteProduct(Long id);
    Product getProduct(Long id);
    IPage<Product> listProducts(Integer pageNum, Integer pageSize, String keyword);
    boolean updateStock(Long id, Integer count);
    void batchUpdateStock(Long[] productIds, Integer[] counts);
}
