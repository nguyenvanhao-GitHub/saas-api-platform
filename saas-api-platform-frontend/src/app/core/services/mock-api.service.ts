import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, CreateMockDto, MockEndpoint } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/mock-endpoints`;
  private gatewayUrl = `${environment.apiBaseUrl}/mock`;

  getMyMocks(): Observable<ApiResponse<MockEndpoint[]>> {
    return this.http.get<ApiResponse<MockEndpoint[]>>(this.apiUrl);
  }

  createMock(dto: CreateMockDto): Observable<ApiResponse<MockEndpoint>> {
    return this.http.post<ApiResponse<MockEndpoint>>(this.apiUrl, dto);
  }

  toggleMock(id: string): Observable<ApiResponse<MockEndpoint>> {
    return this.http.patch<ApiResponse<MockEndpoint>>(`${this.apiUrl}/${id}/toggle`, {});
  }

  deleteMock(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  testCallMock(path: string, method: string): Observable<any> {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${this.gatewayUrl}${cleanPath}`;
    return this.http.request(method, url, { responseType: 'json' });
  }
}