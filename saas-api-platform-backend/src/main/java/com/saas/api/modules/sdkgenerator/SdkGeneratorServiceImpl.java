package com.saas.api.modules.sdkgenerator;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@RequiredArgsConstructor
public class SdkGeneratorServiceImpl implements SdkGeneratorService {

    @Override
    public Map<String, String> generateSdkCode(String language, String apiKey) {
        String key = (apiKey != null && !apiKey.isBlank()) ? apiKey : "YOUR_API_KEY_HERE";
        Map<String, String> result = new HashMap<>();

        switch (language.toLowerCase()) {
            case "python":
                result.put("client.py", """
                        import requests
                        import json

                        class SaasApiClient:
                            def __init__(self, api_key="%s", base_url="https://api.saas-platform.com"):
                                self.api_key = api_key
                                self.base_url = base_url
                                self.session = requests.Session()
                                self.session.headers.update({
                                    "X-API-KEY": self.api_key,
                                    "Content-Type": "application/json",
                                    "User-Agent": "SaasApiClient-Python/1.0"
                                })

                            def get_profile(self):
                                res = self.session.get(f"{self.base_url}/api/v1/users/profile")
                                res.raise_for_status()
                                return res.json()

                            def list_products(self):
                                res = self.session.get(f"{self.base_url}/api/v1/products")
                                res.raise_for_status()
                                return res.json()

                        if __name__ == "__main__":
                            client = SaasApiClient()
                            print("Profile:", client.get_profile())
                        """.formatted(key));
                result.put("README.md", "# SaasApiClient Python SDK\n\n```bash\npip install requests\npython client.py\n```");
                break;

            case "typescript":
            case "nodejs":
                result.put("client.ts", """
                        export interface ApiConfig {
                          apiKey: string;
                          baseUrl?: string;
                        }

                        export class SaasApiClient {
                          private apiKey: string;
                          private baseUrl: string;

                          constructor(config: ApiConfig) {
                            this.apiKey = config.apiKey || '%s';
                            this.baseUrl = config.baseUrl || 'https://api.saas-platform.com';
                          }

                          async getProfile(): Promise<any> {
                            const res = await fetch(`${this.baseUrl}/api/v1/users/profile`, {
                              headers: {
                                'X-API-KEY': this.apiKey,
                                'Content-Type': 'application/json'
                              }
                            });
                            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                            return res.json();
                          }
                        }
                        """.formatted(key));
                result.put("package.json", "{\n  \"name\": \"saas-api-client\",\n  \"version\": \"1.0.0\",\n  \"main\": \"client.ts\"\n}");
                break;

            case "java":
                result.put("SaasApiClient.java", """
                        package com.saas.client;

                        import java.net.URI;
                        import java.net.http.HttpClient;
                        import java.net.http.HttpRequest;
                        import java.net.http.HttpResponse;

                        public class SaasApiClient {
                            private final String apiKey;
                            private final String baseUrl;
                            private final HttpClient client;

                            public SaasApiClient(String apiKey) {
                                this.apiKey = apiKey != null ? apiKey : "%s";
                                this.baseUrl = "https://api.saas-platform.com";
                                this.client = HttpClient.newHttpClient();
                            }

                            public String getProfile() throws Exception {
                                HttpRequest request = HttpRequest.newBuilder()
                                        .uri(URI.create(baseUrl + "/api/v1/users/profile"))
                                        .header("X-API-KEY", apiKey)
                                        .header("Content-Type", "application/json")
                                        .GET()
                                        .build();
                                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                                return response.body();
                            }
                        }
                        """.formatted(key));
                break;

            default:
                result.put("curl_example.sh", """
                        curl -X GET "https://api.saas-platform.com/api/v1/users/profile" \\
                          -H "X-API-KEY: %s" \\
                          -H "Content-Type: application/json"
                        """.formatted(key));
        }
        return result;
    }

    @Override
    public byte[] downloadSdkZip(String language, String apiKey) {
        Map<String, String> files = generateSdkCode(language, apiKey);
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {
            for (Map.Entry<String, String> entry : files.entrySet()) {
                ZipEntry ze = new ZipEntry(entry.getKey());
                zos.putNextEntry(ze);
                zos.write(entry.getValue().getBytes(StandardCharsets.UTF_8));
                zos.closeEntry();
            }
            zos.finish();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate SDK ZIP", e);
        }
    }
}