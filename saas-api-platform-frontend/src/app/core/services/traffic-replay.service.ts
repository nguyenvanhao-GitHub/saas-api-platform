import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TrafficReplayJob, CreateReplayJobDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TrafficReplayService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/traffic-replay`;

  getAllJobs(): Observable<TrafficReplayJob[]> {
    return this.http.get<TrafficReplayJob[]>(this.apiUrl);
  }

  createJob(dto: CreateReplayJobDto): Observable<TrafficReplayJob> {
    return this.http.post<TrafficReplayJob>(this.apiUrl, dto);
  }

  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}