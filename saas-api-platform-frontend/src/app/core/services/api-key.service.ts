import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ApiKeyItem, CreateApiKeyDto } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api-keys`;

  getMyApiKeys(): Observable<ApiResponse<ApiKeyItem[]>> {
    return this.http.get<ApiResponse<ApiKeyItem[]>>(this.apiUrl);
  }

  createApiKey(data: CreateApiKeyDto): Observable<ApiResponse<ApiKeyItem>> {
    return this.http.post<ApiResponse<ApiKeyItem>>(this.apiUrl, data);
  }

  toggleApiKey(keyId: string): Observable<ApiResponse<ApiKeyItem>> {
    return this.http.patch<ApiResponse<ApiKeyItem>>(`${this.apiUrl}/${keyId}/toggle`, {});
  }

  deleteApiKey(keyId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${keyId}`);
  }
}
