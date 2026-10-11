import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, WebhookDeliveryLog, WebhookEndpoint } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebhookService {
  private readonly apiUrl = `${environment.apiBaseUrl}/webhooks`;

  constructor(private http: HttpClient) {}

  getMyEndpoints(): Observable<ApiResponse<WebhookEndpoint[]>> {
    return this.http.get<ApiResponse<WebhookEndpoint[]>>(`${this.apiUrl}/me`);
  }

  registerEndpoint(data: { targetUrl: string; events: string }): Observable<ApiResponse<WebhookEndpoint>> {
    return this.http.post<ApiResponse<WebhookEndpoint>>(this.apiUrl, data);
  }

  deleteEndpoint(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  testEndpoint(id: string): Observable<ApiResponse<WebhookDeliveryLog>> {
    return this.http.post<ApiResponse<WebhookDeliveryLog>>(`${this.apiUrl}/${id}/test`, {});
  }

  getDeliveryLogs(id: string): Observable<ApiResponse<WebhookDeliveryLog[]>> {
    return this.http.get<ApiResponse<WebhookDeliveryLog[]>>(`${this.apiUrl}/${id}/logs`);
  }
}
