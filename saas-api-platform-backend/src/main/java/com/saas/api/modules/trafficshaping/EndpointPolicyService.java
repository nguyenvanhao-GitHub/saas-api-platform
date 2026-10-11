package com.saas.api.modules.trafficshaping;

import java.util.List;
import java.util.UUID;

public interface EndpointPolicyService {
    List<EndpointPolicy> getAllPolicies();
    EndpointPolicy createPolicy(CreateEndpointPolicyDto dto);
    EndpointPolicy togglePolicy(UUID id);
    void deletePolicy(UUID id);
    String maskPiiData(String jsonPayload);
}