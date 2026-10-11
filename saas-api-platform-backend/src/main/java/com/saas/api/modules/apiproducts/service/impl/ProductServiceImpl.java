package com.saas.api.modules.apiproducts.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.modules.apiproducts.domain.ApiProductEntity;
import com.saas.api.modules.apiproducts.dto.request.CreateProductRequest;
import com.saas.api.modules.apiproducts.dto.request.UpdateProductRequest;
import com.saas.api.modules.apiproducts.dto.response.ProductResponse;
import com.saas.api.modules.apiproducts.mapper.ProductMapper;
import com.saas.api.modules.apiproducts.repository.ApiProductRepository;
import com.saas.api.modules.apiproducts.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ApiProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "products")
    public List<ProductResponse> getAllProducts() {
        log.info("Lấy danh sách toàn bộ API Products từ Database");
        List<ApiProductEntity> products = productRepository.findAll().stream()
                .filter(p -> !p.isDeleted())
                .toList();

        return products.stream().map(productMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(UUID id) {
        log.info("Lấy thông tin chi tiết Gói API: {}", id);
        ApiProductEntity entity = findProductById(id);
        return productMapper.toResponse(entity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse createProduct(CreateProductRequest request) {
        log.info("Tạo mới Gói API với mã: {}", request.getCode());

        if (productRepository.findByCode(request.getCode()).isPresent()) {
            throw new BusinessException(ErrorCode.PRODUCT_CODE_EXISTS);
        }

        ApiProductEntity entity = productMapper.toEntity(request);
        ApiProductEntity saved = productRepository.save(entity);
        return productMapper.toResponse(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse updateProduct(UUID id, UpdateProductRequest request) {
        log.info("Cập nhật Gói API: {}", id);
        ApiProductEntity entity = findProductById(id);

        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setBasePrice(request.getBasePrice());
        entity.setPlanType(request.getPlanType());
        entity.setRateLimitPerMinute(request.getRateLimitPerMinute());

        ApiProductEntity saved = productRepository.save(entity);
        return productMapper.toResponse(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public void deleteProduct(UUID id) {
        log.info("Xóa mềm Gói API: {}", id);
        ApiProductEntity entity = findProductById(id);
        entity.setDeleted(true);
        productRepository.save(entity);
    }

    private ApiProductEntity findProductById(UUID id) {
        return productRepository.findById(id)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));
    }
}
