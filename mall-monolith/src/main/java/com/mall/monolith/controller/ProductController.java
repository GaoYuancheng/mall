package com.mall.monolith.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mall.common.api.CommonResult;
import com.mall.monolith.model.Product;
import com.mall.monolith.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Tag(name = "商品管理", description = "商品管理接口")
@RestController
@RequestMapping("/product")
public class ProductController {
    @Autowired
    private ProductService productService;

    @Operation(summary = "创建商品")
    @PostMapping("/create")
    public CommonResult<String> createProduct(@Validated @RequestBody Product product) {
        productService.createProduct(product);
        return CommonResult.success("创建成功");
    }

    @Operation(summary = "更新商品")
    @PutMapping("/update")
    public CommonResult<String> updateProduct(@Validated @RequestBody Product product) {
        productService.updateProduct(product);
        return CommonResult.success("更新成功");
    }

    @Operation(summary = "删除商品")
    @DeleteMapping("/{id}")
    public CommonResult<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return CommonResult.success("删除成功");
    }

    @Operation(summary = "获取商品详情")
    @GetMapping("/{id}")
    public CommonResult<Product> getProduct(@PathVariable Long id) {
        Product product = productService.getProduct(id);
        return CommonResult.success(product);
    }

    @Operation(summary = "分页查询商品")
    @GetMapping("/list")
    public CommonResult<IPage<Product>> listProducts(@RequestParam(defaultValue = "1") Integer pageNum,
                                                    @RequestParam(defaultValue = "10") Integer pageSize,
                                                    @RequestParam(required = false) String keyword) {
        IPage<Product> productPage = productService.listProducts(pageNum, pageSize, keyword);
        return CommonResult.success(productPage);
    }

    @Operation(summary = "更新商品库存")
    @PutMapping("/stock/{id}")
    public CommonResult<String> updateStock(@PathVariable Long id, @RequestParam Integer count) {
        boolean result = productService.updateStock(id, count);
        if (result) {
            return CommonResult.success("更新成功");
        }
        return CommonResult.failed("库存不足");
    }

    @Operation(summary = "批量更新商品库存")
    @PutMapping("/stock/batch")
    public CommonResult<String> batchUpdateStock(@RequestParam Long[] productIds, @RequestParam Integer[] counts) {
        productService.batchUpdateStock(productIds, counts);
        return CommonResult.success("更新成功");
    }
}
