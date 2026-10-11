import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse, Subscription } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly apiUrl = `${environment.apiBaseUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  subscribe(productId: string): Observable<ApiResponse<Subscription>> {
    return this.http.post<ApiResponse<Subscription>>(`${this.apiUrl}/${productId}`, {});
  }

  getMySubscriptions(): Observable<ApiResponse<Subscription[]>> {
    return this.http.get<ApiResponse<Subscription[]>>(`${this.apiUrl}/me`);
  }

  cancelSubscription(id: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/cancel`, {});
  }

  getAllSubscriptions(page: number = 0, size: number = 10): Observable<ApiResponse<PageResponse<Subscription>>> {
    return this.http.get<ApiResponse<PageResponse<Subscription>>>(`${this.apiUrl}/admin?page=${page}&size=${size}`);
  }
}
