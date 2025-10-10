package com.mall.monolith.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mall.monolith.model.Category;
import com.mall.monolith.service.CategoryService;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Override
    public IPage<Category> listCategories(Integer pageNum, Integer pageSize) {
        // TODO: 实现分页查询分类列表
        return null;
    }

    @Override
    public Category getCategory(Long id) {
        // TODO: 实现获取分类详情
        Category c = new Category();
        c.setId(id);
        c.setName("mock-category-" + id);
        return c;
    }

    @Override
    public void createCategory(Category category) {
        // TODO: 实现创建分类
    }

    @Override
    public void updateCategory(Category category) {
        // TODO: 实现更新分类
    }

    @Override
    public void deleteCategory(Long id) {
        // TODO: 实现删除分类
    }
}


