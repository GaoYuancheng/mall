package com.mall.monolith.controller;

import com.mall.common.api.CommonResult;
import com.mall.monolith.model.Category;
import com.mall.monolith.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "分类管理", description = "分类管理接口")
@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Operation(summary = "获取分类列表")
    @GetMapping("/list")
    public CommonResult<List<Category>> listCategories() {
        List<Category> categoryList = categoryService.listCategories();
        return CommonResult.success(categoryList);
    }

    @Operation(summary = "获取分类详情")
    @GetMapping("/{id}")
    public CommonResult<Category> getCategory(@PathVariable Long id) {
        return CommonResult.success(categoryService.getCategory(id));
    }

    @Operation(summary = "创建分类")
    @PostMapping("/create")
    public CommonResult<String> createCategory(@Validated @RequestBody Category category) {
        categoryService.createCategory(category);
        return CommonResult.success("创建成功");
    }

    @Operation(summary = "更新分类")
    @PutMapping("/update")
    public CommonResult<String> updateCategory(@Validated @RequestBody Category category) {
        categoryService.updateCategory(category);
        return CommonResult.success("更新成功");
    }

    @Operation(summary = "删除分类")
    @DeleteMapping("/{id}")
    public CommonResult<String> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return CommonResult.success("删除成功");
    }
}


