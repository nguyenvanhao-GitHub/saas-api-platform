import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, UsageStats } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {
  private readonly apiUrl = `${environment.apiBaseUrl}/gateway`;

  constructor(private http: HttpClient) {}

  executeApi(apiKey: string, endpoint: string = '/v1/data/query'): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders({
      'X-API-KEY': apiKey
    });
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/execute?endpoint=${encodeURIComponent(endpoint)}`, {}, { headers });
  }

  getMyStats(): Observable<ApiResponse<UsageStats>> {
    return this.http.get<ApiResponse<UsageStats>>(`${this.apiUrl}/stats/me`);
  }
}
