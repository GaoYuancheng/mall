package com.mall.monolith.service;

import com.mall.monolith.model.Category;

import java.util.List;

public interface CategoryService {
    List<Category> listCategories();
    Category getCategory(Long id);
    void createCategory(Category category);
    void updateCategory(Category category);
    void deleteCategory(Long id);
}


