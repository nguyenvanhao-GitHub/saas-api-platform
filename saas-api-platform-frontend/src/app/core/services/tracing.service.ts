import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RequestTrace, TraceWaterfallDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TracingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/traces`;

  getRecentTraces(): Observable<RequestTrace[]> {
    return this.http.get<RequestTrace[]>(this.apiUrl);
  }

  getWaterfall(traceId: string): Observable<TraceWaterfallDto> {
    return this.http.get<TraceWaterfallDto>(`${this.apiUrl}/${traceId}/waterfall`);
  }
}