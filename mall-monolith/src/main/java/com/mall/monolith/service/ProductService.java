package com.mall.monolith.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mall.monolith.dto.ProductVO;
import com.mall.monolith.model.Product;

public interface ProductService {
    void createProduct(Product product);
    void updateProduct(Product product);
    void deleteProduct(Long id);
    ProductVO getProduct(Long id);
    IPage<ProductVO> listProducts(Integer pageNum, Integer pageSize, String keyword);
    boolean updateStock(Long id, Integer count);
    void batchUpdateStock(Long[] productIds, Integer[] counts);
    void updateStatus(Long id, Integer status);
}
