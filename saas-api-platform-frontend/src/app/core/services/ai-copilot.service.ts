import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AiCopilotMessage, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AiCopilotService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/ai-copilot`;

  askCopilot(prompt: string, targetLanguage: string = 'JAVASCRIPT'): Observable<ApiResponse<AiCopilotMessage>> {
    return this.http.post<ApiResponse<AiCopilotMessage>>(`${this.apiUrl}/ask`, { prompt, targetLanguage });
  }

  getHistory(): Observable<ApiResponse<AiCopilotMessage[]>> {
    return this.http.get<ApiResponse<AiCopilotMessage[]>>(`${this.apiUrl}/history`);
  }
}