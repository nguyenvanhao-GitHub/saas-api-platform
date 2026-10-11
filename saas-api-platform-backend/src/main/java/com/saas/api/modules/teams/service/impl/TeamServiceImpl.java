package com.saas.api.modules.teams.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.modules.notifications.service.NotificationService;
import com.saas.api.modules.teams.domain.OrganizationEntity;
import com.saas.api.modules.teams.domain.TeamMemberEntity;
import com.saas.api.modules.teams.dto.OrganizationResponse;
import com.saas.api.modules.teams.dto.TeamInviteRequest;
import com.saas.api.modules.teams.dto.TeamMemberResponse;
import com.saas.api.modules.teams.repository.OrganizationRepository;
import com.saas.api.modules.teams.repository.TeamMemberRepository;
import com.saas.api.modules.teams.service.TeamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final OrganizationRepository organizationRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public OrganizationResponse getMyOrganization(UUID userId, String userEmail) {
        OrganizationEntity org = organizationRepository.findByOwnerIdAndIsDeletedFalse(userId)
                .orElseGet(() -> {
                    String slug = "org-" + userId.toString().substring(0, 8);
                    OrganizationEntity newOrg = OrganizationEntity.builder()
                            .ownerId(userId)
                            .name("Developer Workspace")
                            .slug(slug)
                            .build();
                    OrganizationEntity savedOrg = organizationRepository.save(newOrg);

                    // Add owner as active member
                    TeamMemberEntity ownerMember = TeamMemberEntity.builder()
                            .organizationId(savedOrg.getId())
                            .userId(userId)
                            .invitedEmail(userEmail != null ? userEmail : "owner@saas.local")
                            .role("OWNER")
                            .status("ACTIVE")
                            .build();
                    teamMemberRepository.save(ownerMember);
                    return savedOrg;
                });

        List<TeamMemberResponse> members = teamMemberRepository.findByOrganizationIdAndIsDeletedFalse(org.getId())
                .stream()
                .map(this::mapToMemberResponse)
                .collect(Collectors.toList());

        return OrganizationResponse.builder()
                .id(org.getId())
                .name(org.getName())
                .slug(org.getSlug())
                .ownerId(org.getOwnerId())
                .createdAt(org.getCreatedAt())
                .members(members)
                .build();
    }

    @Override
    @Transactional
    public TeamMemberResponse inviteMember(UUID userId, String userEmail, TeamInviteRequest request) {
        OrganizationEntity org = organizationRepository.findByOwnerIdAndIsDeletedFalse(userId)
                .orElseGet(() -> {
                    OrganizationEntity newOrg = OrganizationEntity.builder()
                            .ownerId(userId)
                            .name("Developer Workspace")
                            .slug("org-" + userId.toString().substring(0, 8))
                            .build();
                    return organizationRepository.save(newOrg);
                });

        teamMemberRepository.findByOrganizationIdAndInvitedEmailAndIsDeletedFalse(org.getId(), request.getEmail())
                .ifPresent(m -> {
                    throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS, "Email này đã được mời vào tổ chức");
                });

        TeamMemberEntity member = TeamMemberEntity.builder()
                .organizationId(org.getId())
                .invitedEmail(request.getEmail().trim().toLowerCase())
                .role(request.getRole().toUpperCase())
                .status("PENDING")
                .build();

        TeamMemberEntity saved = teamMemberRepository.save(member);
        notificationService.createNotification(userId, "Lời mời thành viên mới", "Đã gửi lời mời tới email " + request.getEmail() + " với vai trò " + request.getRole(), "TEAM_INVITE");

        return mapToMemberResponse(saved);
    }

    @Override
    @Transactional
    public TeamMemberResponse updateMemberRole(UUID userId, UUID memberId, String newRole) {
        TeamMemberEntity member = teamMemberRepository.findById(memberId)
                .filter(m -> !m.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy thành viên trong tổ chức"));

        if ("OWNER".equalsIgnoreCase(member.getRole())) {
            throw new BusinessException(ErrorCode.VALIDATION_FAILED, "Không thể thay đổi vai trò của Chủ tổ chức (Owner)");
        }

        member.setRole(newRole.toUpperCase());
        return mapToMemberResponse(teamMemberRepository.save(member));
    }

    @Override
    @Transactional
    public void removeMember(UUID userId, UUID memberId) {
        TeamMemberEntity member = teamMemberRepository.findById(memberId)
                .filter(m -> !m.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy thành viên trong tổ chức"));

        if ("OWNER".equalsIgnoreCase(member.getRole())) {
            throw new BusinessException(ErrorCode.VALIDATION_FAILED, "Không thể xóa Chủ tổ chức (Owner)");
        }

        member.setDeleted(true);
        teamMemberRepository.save(member);
    }

    private TeamMemberResponse mapToMemberResponse(TeamMemberEntity entity) {
        return TeamMemberResponse.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .userId(entity.getUserId())
                .invitedEmail(entity.getInvitedEmail())
                .role(entity.getRole())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
