import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SdkGeneratorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/sdk`;

  generateCode(language: string, apiKey?: string): Observable<Record<string, string>> {
    const params: any = { language };
    if (apiKey) params.apiKey = apiKey;
    return this.http.get<Record<string, string>>(`${this.apiUrl}/generate`, { params });
  }

  downloadSdk(language: string, apiKey?: string): void {
    const url = `${this.apiUrl}/download?language=${language}${apiKey ? '&apiKey=' + encodeURIComponent(apiKey) : ''}`;
    window.open(url, '_blank');
  }
}