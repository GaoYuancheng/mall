package com.mall.monolith.controller;

import com.mall.common.api.CommonResult;
import com.mall.monolith.model.Product;
import com.mall.monolith.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Tag(name = "搜索管理", description = "搜索管理接口")
@RestController
@RequestMapping("/search")
public class SearchController {
    @Autowired
    private SearchService searchService;

    @Operation(summary = "导入所有商品到ES")
    @PostMapping("/importAll")
    public CommonResult<Integer> importAll() {
        int count = searchService.importAll();
        return CommonResult.success(count);
    }

    @Operation(summary = "根据id删除商品")
    @DeleteMapping("/{id}")
    public CommonResult<String> delete(@PathVariable Long id) {
        searchService.delete(id);
        return CommonResult.success("删除成功");
    }

    @Operation(summary = "根据id创建商品")
    @PostMapping("/create/{id}")
    public CommonResult<Product> create(@PathVariable Long id) {
        Product product = searchService.create(id);
        return CommonResult.success(product);
    }

    @Operation(summary = "批量删除商品")
    @PostMapping("/delete/batch")
    public CommonResult<String> delete(@RequestParam("ids") List<Long> ids) {
        searchService.delete(ids);
        return CommonResult.success("删除成功");
    }

    @Operation(summary = "简单搜索")
    @GetMapping("/simple")
    public CommonResult<List<Product>> search(@RequestParam(required = false) String keyword,
                                               @RequestParam(defaultValue = "0") Integer pageNum,
                                               @RequestParam(defaultValue = "10") Integer pageSize) {
        List<Product> productList = searchService.search(keyword, pageNum, pageSize);
        return CommonResult.success(productList);
    }

    @Operation(summary = "综合搜索、筛选、排序")
    @GetMapping("/advance")
    public CommonResult<List<Product>> search(@RequestParam(required = false) String keyword,
                                               @RequestParam(required = false) Long categoryId,
                                               @RequestParam(required = false) String brandName,
                                               @RequestParam(required = false) BigDecimal minPrice,
                                               @RequestParam(required = false) BigDecimal maxPrice,
                                               @RequestParam(defaultValue = "0") Integer pageNum,
                                               @RequestParam(defaultValue = "10") Integer pageSize,
                                               @RequestParam(required = false) Integer sort) {
        List<Product> productList = searchService.search(keyword, categoryId, brandName,
                minPrice, maxPrice, pageNum, pageSize, sort);
        return CommonResult.success(productList);
    }

    @Operation(summary = "根据商品id推荐相似商品")
    @GetMapping("/recommend/{id}")
    public CommonResult<List<Product>> recommend(@PathVariable Long id,
                                                  @RequestParam(defaultValue = "10") Integer pageSize) {
        List<Product> productList = searchService.recommend(id, pageSize);
        return CommonResult.success(productList);
    }

    @Operation(summary = "获取热门搜索词")
    @GetMapping("/hot")
    public CommonResult<List<String>> getHotSearchKeywords() {
        List<String> keywords = searchService.getHotSearchKeywords();
        return CommonResult.success(keywords);
    }
}
