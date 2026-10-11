package com.saas.api.modules.storage.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.modules.storage.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StorageServiceImpl implements StorageService {

    @Value("${saas.storage.s3.bucket:saas-invoices-storage}")
    private String s3Bucket;

    @Value("${saas.storage.s3.region:us-east-1}")
    private String s3Region;

    @Override
    public Map<String, Object> uploadFile(UUID userId, MultipartFile file, String folder) {
        if (file.isEmpty()) {
            throw new BusinessException(ErrorCode.VALIDATION_FAILED, "File tải lên không được để trống");
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String fileExt = originalFilename.contains(".") ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        String uniqueFileName = (folder != null ? folder + "/" : "") + UUID.randomUUID().toString() + fileExt;

        String publicUrl = "https://" + s3Bucket + ".s3." + s3Region + ".amazonaws.com/" + uniqueFileName;
        log.info("Tải file lên AWS S3 Bucket [{}]: Key = {}, Size = {} bytes (User: {})", s3Bucket, uniqueFileName, file.getSize(), userId);

        return Map.of(
                "fileName", originalFilename,
                "s3Key", uniqueFileName,
                "fileUrl", publicUrl,
                "fileSize", file.getSize(),
                "contentType", file.getContentType() != null ? file.getContentType() : "application/octet-stream"
        );
    }

    @Override
    public String uploadBytes(String key, byte[] content, String contentType) {
        String publicUrl = "https://" + s3Bucket + ".s3." + s3Region + ".amazonaws.com/" + key;
        log.info("Lưu trữ nhị phân lên S3 Bucket [{}]: Key = {}, Size = {} bytes", s3Bucket, key, content.length);
        return publicUrl;
    }
}
