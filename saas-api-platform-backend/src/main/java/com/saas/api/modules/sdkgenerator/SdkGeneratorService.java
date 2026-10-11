package com.saas.api.modules.sdkgenerator;

import java.util.Map;

public interface SdkGeneratorService {
    Map<String, String> generateSdkCode(String language, String apiKey);
    byte[] downloadSdkZip(String language, String apiKey);
}