package com.mall.monolith.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mall.monolith.model.Category;

public interface CategoryService {
    IPage<Category> listCategories(Integer pageNum, Integer pageSize);
    Category getCategory(Long id);
    void createCategory(Category category);
    void updateCategory(Category category);
    void deleteCategory(Long id);
}


