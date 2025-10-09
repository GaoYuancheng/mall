package com.mall.monolith.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.monolith.model.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
