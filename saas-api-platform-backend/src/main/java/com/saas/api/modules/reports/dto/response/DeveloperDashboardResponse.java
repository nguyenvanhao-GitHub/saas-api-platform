package com.saas.api.modules.reports.dto.response;

import com.saas.api.modules.invoices.dto.response.InvoiceResponse;
import com.saas.api.modules.subscriptions.dto.response.SubscriptionResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeveloperDashboardResponse {

    private String apiKey;
    private long totalRequestsUsed;
    private long requestsThisMinute;
    private int rateLimitPerMinute;
    private BigDecimal totalSpent;
    private List<SubscriptionResponse> activeSubscriptions;
    private List<InvoiceResponse> recentInvoices;
}
