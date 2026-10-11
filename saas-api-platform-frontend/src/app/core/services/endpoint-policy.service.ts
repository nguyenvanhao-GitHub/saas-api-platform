import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EndpointPolicy, CreateEndpointPolicyDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EndpointPolicyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/endpoint-policies`;

  getPolicies(): Observable<EndpointPolicy[]> {
    return this.http.get<EndpointPolicy[]>(this.apiUrl);
  }

  createPolicy(dto: CreateEndpointPolicyDto): Observable<EndpointPolicy> {
    return this.http.post<EndpointPolicy>(this.apiUrl, dto);
  }

  togglePolicy(id: string): Observable<EndpointPolicy> {
    return this.http.patch<EndpointPolicy>(`${this.apiUrl}/${id}/toggle`, {});
  }

  deletePolicy(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  previewMask(payload: string): Observable<{ raw: string; masked: string }> {
    return this.http.post<{ raw: string; masked: string }>(`${this.apiUrl}/mask-preview`, { payload });
  }
}