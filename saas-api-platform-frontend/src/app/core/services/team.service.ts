import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Organization, TeamInviteDto, TeamMember } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/teams`;

  getMyOrganization(): Observable<ApiResponse<Organization>> {
    return this.http.get<ApiResponse<Organization>>(this.apiUrl);
  }

  inviteMember(dto: TeamInviteDto): Observable<ApiResponse<TeamMember>> {
    return this.http.post<ApiResponse<TeamMember>>(`${this.apiUrl}/invite`, dto);
  }

  updateMemberRole(memberId: string, role: string): Observable<ApiResponse<TeamMember>> {
    return this.http.patch<ApiResponse<TeamMember>>(`${this.apiUrl}/members/${memberId}/role`, { role });
  }

  removeMember(memberId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/members/${memberId}`);
  }
}