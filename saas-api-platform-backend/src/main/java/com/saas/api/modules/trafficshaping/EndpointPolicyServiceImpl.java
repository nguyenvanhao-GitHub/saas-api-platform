package com.saas.api.modules.trafficshaping;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class EndpointPolicyServiceImpl implements EndpointPolicyService {

    private final EndpointPolicyRepository repository;

    private static final Pattern CREDIT_CARD_PATTERN = Pattern.compile("\\b(?:\\d[ -]*?){13,16}\\b");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+)");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(\\+?\\d{1,3}[- ]?)?\\(?\\d{3}\\)?[- ]?\\d{3}[- ]?\\d{4}");

    @Override
    public List<EndpointPolicy> getAllPolicies() {
        return repository.findAll();
    }

    @Override
    @Transactional
    public EndpointPolicy createPolicy(CreateEndpointPolicyDto dto) {
        EndpointPolicy policy = EndpointPolicy.builder()
                .endpointPath(dto.getEndpointPath())
                .httpMethod(dto.getHttpMethod().toUpperCase())
                .rateLimitPerMin(dto.getRateLimitPerMin() != null ? dto.getRateLimitPerMin() : 60)
                .burstCapacity(dto.getBurstCapacity() != null ? dto.getBurstCapacity() : 10)
                .jsonSchemaValidation(dto.getJsonSchemaValidation())
                .isPiiMaskingEnabled(Boolean.TRUE.equals(dto.getIsPiiMaskingEnabled()))
                .isActive(true)
                .build();
        return repository.save(policy);
    }

    @Override
    @Transactional
    public EndpointPolicy togglePolicy(UUID id) {
        EndpointPolicy policy = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found: " + id));
        policy.setIsActive(!policy.getIsActive());
        return repository.save(policy);
    }

    @Override
    @Transactional
    public void deletePolicy(UUID id) {
        repository.deleteById(id);
    }

    @Override
    public String maskPiiData(String jsonPayload) {
        if (jsonPayload == null || jsonPayload.isBlank()) {
            return jsonPayload;
        }
        String masked = CREDIT_CARD_PATTERN.matcher(jsonPayload).replaceAll("****-****-****-XXXX");
        masked = EMAIL_PATTERN.matcher(masked).replaceAll("$1***@***.com");
        masked = PHONE_PATTERN.matcher(masked).replaceAll("XXX-XXX-XXXX");
        return masked;
    }
}