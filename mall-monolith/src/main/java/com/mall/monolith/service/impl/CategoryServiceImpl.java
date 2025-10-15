package com.mall.monolith.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.mall.monolith.mapper.CategoryMapper;
import com.mall.monolith.model.Category;
import com.mall.monolith.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    
    @Autowired
    private CategoryMapper categoryMapper;
    
    @Override
    public List<Category> listCategories() {
        QueryWrapper<Category> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByAsc("sort").orderByDesc("create_time");
        return categoryMapper.selectList(queryWrapper);
    }

    @Override
    public Category getCategory(Long id) {
        return categoryMapper.selectById(id);
    }

    @Override
    public void createCategory(Category category) {
        category.setCreateTime(LocalDateTime.now());
        category.setUpdateTime(LocalDateTime.now());
        if (category.getStatus() == null) {
            category.setStatus(1); // 默认启用
        }
        if (category.getSort() == null) {
            category.setSort(0);
        }
        if (category.getLevel() == null) {
            category.setLevel(1);
        }
        if (category.getParentId() == null) {
            category.setParentId(0L); // 默认顶级分类
        }
        categoryMapper.insert(category);
    }

    @Override
    public void updateCategory(Category category) {
        category.setUpdateTime(LocalDateTime.now());
        categoryMapper.updateById(category);
    }

    @Override
    public void deleteCategory(Long id) {
        categoryMapper.deleteById(id);
    }
}


