package com.saas.api.modules.reports.service;

import com.saas.api.modules.reports.dto.response.AdminDashboardResponse;
import com.saas.api.modules.reports.dto.response.DeveloperDashboardResponse;

import java.util.UUID;

public interface ReportService {

    AdminDashboardResponse getAdminDashboard();

    DeveloperDashboardResponse getDeveloperDashboard(UUID userId);
}
