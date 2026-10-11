package com.saas.api.modules.sdkgenerator;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/sdk")
@RequiredArgsConstructor
public class SdkGeneratorController {

    private final SdkGeneratorService service;

    @GetMapping("/generate")
    public ResponseEntity<Map<String, String>> generateCode(
            @RequestParam(defaultValue = "python") String language,
            @RequestParam(required = false) String apiKey) {
        return ResponseEntity.ok(service.generateSdkCode(language, apiKey));
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadSdk(
            @RequestParam(defaultValue = "python") String language,
            @RequestParam(required = false) String apiKey) {
        byte[] zipBytes = service.downloadSdkZip(language, apiKey);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"saas-sdk-" + language.toLowerCase() + ".zip\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(zipBytes);
    }
}