package com.saas.api.modules.reports.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalActiveSubscriptions;
    private long totalApiProducts;
    private BigDecimal totalRevenue;
    private long totalApiRequestsProcessed;
    private Map<String, Long> subscriptionsByPlanType;
}
