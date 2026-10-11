import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PublicStatusData } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/public/status`;

  getPublicStatus(): Observable<ApiResponse<PublicStatusData>> {
    return this.http.get<ApiResponse<PublicStatusData>>(this.apiUrl);
  }
}
