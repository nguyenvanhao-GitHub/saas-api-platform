package com.saas.api.modules.storage.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

public interface StorageService {

    Map<String, Object> uploadFile(UUID userId, MultipartFile file, String folder);

    String uploadBytes(String key, byte[] content, String contentType);
}
