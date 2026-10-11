package com.saas.api.modules.apiproducts.service;

import com.saas.api.modules.apiproducts.dto.request.CreateProductRequest;
import com.saas.api.modules.apiproducts.dto.request.UpdateProductRequest;
import com.saas.api.modules.apiproducts.dto.response.ProductResponse;

import java.util.List;
import java.util.UUID;

public interface ProductService {

    List<ProductResponse> getAllProducts();

    ProductResponse getProductById(UUID id);

    ProductResponse createProduct(CreateProductRequest request);

    ProductResponse updateProduct(UUID id, UpdateProductRequest request);

    void deleteProduct(UUID id);
}
