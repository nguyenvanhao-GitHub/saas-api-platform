import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SlaProbe, CreateSlaProbeDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SlaProbeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/sla-probes`;

  getAllProbes(): Observable<SlaProbe[]> {
    return this.http.get<SlaProbe[]>(this.apiUrl);
  }

  createProbe(dto: CreateSlaProbeDto): Observable<SlaProbe> {
    return this.http.post<SlaProbe>(this.apiUrl, dto);
  }

  pingProbe(id: string): Observable<SlaProbe> {
    return this.http.post<SlaProbe>(`${this.apiUrl}/${id}/ping`, {});
  }

  deleteProbe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}