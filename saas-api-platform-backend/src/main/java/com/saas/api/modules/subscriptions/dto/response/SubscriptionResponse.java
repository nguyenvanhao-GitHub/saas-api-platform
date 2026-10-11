package com.saas.api.modules.subscriptions.dto.response;

import com.saas.api.modules.apiproducts.dto.response.ProductResponse;
import com.saas.api.modules.users.dto.response.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {

    private UUID id;
    private UserResponse user;
    private ProductResponse product;
    private String status;
    private long totalRequestsUsed;
    private Instant createdAt;
}
