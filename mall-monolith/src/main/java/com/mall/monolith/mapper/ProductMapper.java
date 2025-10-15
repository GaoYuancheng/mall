package com.mall.monolith.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.monolith.dto.ProductVO;
import com.mall.monolith.model.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

/**
 * 商品数据访问层
 * 
 * @author mall-monolith
 * @version 1.0
 */
@Mapper
public interface ProductMapper extends BaseMapper<Product> {
    
    /**
     * 更新商品库存
     * 
     * @param id 商品ID
     * @param count 库存变化数量（正数增加，负数减少）
     * @return 影响的行数
     */
    @Update("UPDATE product SET stock = stock + #{count}, update_time = NOW() WHERE id = #{id}")
    int updateStock(@Param("id") Long id, @Param("count") Integer count);
    
    /**
     * 更新商品库存（带库存检查）
     * 
     * @param id 商品ID
     * @param count 库存变化数量（负数减少）
     * @return 影响的行数
     */
    @Update("UPDATE product SET stock = stock + #{count}, update_time = NOW() WHERE id = #{id} AND stock + #{count} >= 0")
    int updateStockWithCheck(@Param("id") Long id, @Param("count") Integer count);
    
    /**
     * 根据ID查询商品详情（包含分类名称和审批状态中文描述）
     * 
     * @param id 商品ID
     * @return 商品视图对象
     */
    @Select("SELECT p.*, c.name as category_name, " +
            "CASE p.approval_status " +
            "  WHEN 0 THEN '待审批' " +
            "  WHEN 1 THEN '已通过' " +
            "  WHEN 2 THEN '已拒绝' " +
            "  ELSE '未知状态' " +
            "END as approval_status_text " +
            "FROM product p " +
            "LEFT JOIN category c ON p.category_id = c.id " +
            "WHERE p.id = #{id}")
    ProductVO selectProductVOById(@Param("id") Long id);
    
    /**
     * 分页查询商品列表（包含分类名称和审批状态中文描述）
     * 
     * @param page 分页对象
     * @param keyword 关键词
     * @return 商品视图对象分页结果
     */
    @Select("<script>" +
            "SELECT p.*, c.name as category_name, " +
            "CASE p.approval_status " +
            "  WHEN 0 THEN '待审批' " +
            "  WHEN 1 THEN '已通过' " +
            "  WHEN 2 THEN '已拒绝' " +
            "  ELSE '未知状态' " +
            "END as approval_status_text " +
            "FROM product p " +
            "LEFT JOIN category c ON p.category_id = c.id " +
            "<where>" +
            "  <if test='keyword != null and keyword != \"\"'>" +
            "    AND (p.name LIKE CONCAT('%', #{keyword}, '%') " +
            "    OR p.subtitle LIKE CONCAT('%', #{keyword}, '%'))" +
            "  </if>" +
            "</where>" +
            "ORDER BY p.create_time DESC" +
            "</script>")
    IPage<ProductVO> selectProductVOPage(Page<ProductVO> page, @Param("keyword") String keyword);
}

