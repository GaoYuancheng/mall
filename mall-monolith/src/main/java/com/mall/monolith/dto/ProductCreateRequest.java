package com.mall.monolith.dto;

import com.mall.monolith.model.Product;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotNull;

/**
 * 商品创建请求DTO
 * 
 * @author mall-monolith
 * @version 1.0
 */
@Schema(description = "商品创建请求")
public class ProductCreateRequest {
    
    @Schema(description = "商品信息")
    @NotNull(message = "商品信息不能为空")
    private Product product;
    
    @Schema(description = "提交人ID")
    @NotNull(message = "提交人ID不能为空")
    private Long submitterId;
    
    @Schema(description = "审批人ID")
    @NotNull(message = "审批人ID不能为空")
    private Long approverId;
    
    public Product getProduct() {
        return product;
    }
    
    public void setProduct(Product product) {
        this.product = product;
    }
    
    public Long getSubmitterId() {
        return submitterId;
    }
    
    public void setSubmitterId(Long submitterId) {
        this.submitterId = submitterId;
    }
    
    public Long getApproverId() {
        return approverId;
    }
    
    public void setApproverId(Long approverId) {
        this.approverId = approverId;
    }
}
