package com.saas.api.modules.apiproducts.repository;

import com.saas.api.modules.apiproducts.domain.ApiProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApiProductRepository extends JpaRepository<ApiProductEntity, UUID> {
    Optional<ApiProductEntity> findByCode(String code);
}
