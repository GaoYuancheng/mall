package com.mall.monolith.controller;

import com.mall.common.api.CommonResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "上传管理", description = "文件上传接口")
@RestController
@RequestMapping("/upload")
public class UploadController {

    @Operation(summary = "上传文件")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CommonResult<String> upload(@RequestPart("file") MultipartFile file) {
        // TODO: 实际项目应将文件上传到对象存储并返回可访问URL
        String filename = file.getOriginalFilename();
        return CommonResult.success(filename, "上传成功");
    }
}


