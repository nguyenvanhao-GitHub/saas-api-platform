package com.saas.api.modules.storage.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.storage.service.StorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/storage")
@RequiredArgsConstructor
@Tag(name = "File Storage (AWS S3)", description = "API Tải lên Tệp Tin & Lưu Trữ Đám Mây")
public class StorageController {

    private final StorageService storageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Tải file lên AWS S3", description = "Hỗ trợ tải ảnh đại diện, hóa đơn hoặc tài liệu")
    public ApiResponse<Map<String, Object>> uploadFile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "uploads") String folder
    ) {
        return ApiResponse.success("Tải file lên AWS S3 thành công", storageService.uploadFile(principal.getId(), file, folder));
    }
}
