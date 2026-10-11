package com.saas.api.modules.teams.controller;

import com.saas.api.core.model.ApiResponse;
import com.saas.api.core.security.UserPrincipal;
import com.saas.api.modules.teams.dto.OrganizationResponse;
import com.saas.api.modules.teams.dto.TeamInviteRequest;
import com.saas.api.modules.teams.dto.TeamMemberResponse;
import com.saas.api.modules.teams.service.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
@Tag(name = "Organization & Team Workspace", description = "Quản lý tổ chức, lời mời và phân quyền thành viên nhóm")
public class TeamController {

    private final TeamService teamService;

    @GetMapping
    @Operation(summary = "Lấy thông tin tổ chức và danh sách thành viên")
    public ApiResponse<OrganizationResponse> getMyOrganization(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(teamService.getMyOrganization(principal.getId(), principal.getEmail()));
    }

    @PostMapping("/invite")
    @Operation(summary = "Gửi lời mời tham gia tổ chức")
    public ApiResponse<TeamMemberResponse> inviteMember(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TeamInviteRequest request
    ) {
        return ApiResponse.success("Gửi lời mời thành công", teamService.inviteMember(principal.getId(), principal.getEmail(), request));
    }

    @PatchMapping("/members/{id}/role")
    @Operation(summary = "Cập nhật vai trò thành viên")
    public ApiResponse<TeamMemberResponse> updateRole(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @RequestBody Map<String, String> body
    ) {
        String role = body.getOrDefault("role", "DEVELOPER");
        return ApiResponse.success("Cập nhật vai trò thành công", teamService.updateMemberRole(principal.getId(), id, role));
    }

    @DeleteMapping("/members/{id}")
    @Operation(summary = "Xóa thành viên khỏi tổ chức")
    public ApiResponse<Void> removeMember(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        teamService.removeMember(principal.getId(), id);
        return ApiResponse.success("Đã xóa thành viên khỏi tổ chức", null);
    }
}
