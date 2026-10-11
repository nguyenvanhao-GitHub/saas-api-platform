package com.saas.api.modules.apiproducts.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.modules.apiproducts.dto.request.CreateProductRequest;
import com.saas.api.modules.apiproducts.dto.request.UpdateProductRequest;
import com.saas.api.modules.apiproducts.dto.response.ProductResponse;
import com.saas.api.modules.apiproducts.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "API Products Catalog", description = "API Quản lý Danh mục Gói Dịch Vụ SaaS")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Lấy danh sách gói API", description = "Công khai danh sách các gói dịch vụ API hỗ trợ (Cached với Redis)")
    public ApiResponse<List<ProductResponse>> getAll() {
        return ApiResponse.success(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết gói API", description = "Lấy thông tin chi tiết của một gói API theo ID")
    public ApiResponse<ProductResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(productService.getProductById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Tạo mới gói API (Dành riêng cho Admin)", description = "Yêu cầu Bearer Token với ROLE_ADMIN")
    public ApiResponse<ProductResponse> create(@Valid @RequestBody CreateProductRequest request) {
        return ApiResponse.success("Tạo gói API thành công", productService.createProduct(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cập nhật gói API (Dành riêng cho Admin)", description = "Yêu cầu Bearer Token với ROLE_ADMIN")
    public ApiResponse<ProductResponse> update(@PathVariable UUID id, @Valid @RequestBody UpdateProductRequest request) {
        return ApiResponse.success("Cập nhật gói API thành công", productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa mềm gói API (Dành riêng cho Admin)", description = "Đánh dấu cờ isDeleted = true")
    public void delete(@PathVariable UUID id) {
        productService.deleteProduct(id);
    }
}
