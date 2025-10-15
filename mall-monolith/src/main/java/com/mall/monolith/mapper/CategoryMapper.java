package com.mall.monolith.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.monolith.model.Category;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {
}

