import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, AppNotification, PageResponse, UnreadCount } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly apiUrl = `${environment.apiBaseUrl}/notifications`;

  public unreadCount = signal<number>(0);
  public notifications = signal<AppNotification[]>([]);

  constructor(private http: HttpClient) {}

  getMyNotifications(page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<AppNotification>>> {
    return this.http.get<ApiResponse<PageResponse<AppNotification>>>(`${this.apiUrl}/me?page=${page}&size=${size}`).pipe(
      tap(res => {
        if (res.data?.content) {
          this.notifications.set(res.data.content);
        }
      })
    );
  }

  fetchUnreadCount(): Observable<ApiResponse<UnreadCount>> {
    return this.http.get<ApiResponse<UnreadCount>>(`${this.apiUrl}/unread-count`).pipe(
      tap(res => {
        if (res.data) {
          this.unreadCount.set(res.data.unreadCount);
        }
      })
    );
  }

  markAsRead(id: string): Observable<ApiResponse<AppNotification>> {
    return this.http.patch<ApiResponse<AppNotification>>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        this.notifications.update(list =>
          list.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        this.unreadCount.update(c => Math.max(0, c - 1));
      })
    );
  }

  markAllAsRead(): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => {
        this.notifications.update(list =>
          list.map(n => ({ ...n, isRead: true }))
        );
        this.unreadCount.set(0);
      })
    );
  }
}
