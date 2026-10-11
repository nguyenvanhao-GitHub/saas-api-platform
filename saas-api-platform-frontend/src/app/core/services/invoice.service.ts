import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, CardPaymentRequest, Invoice, PageResponse, VietQrResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly apiUrl = `${environment.apiBaseUrl}/invoices`;
  private readonly paymentsUrl = `${environment.apiBaseUrl}/payments`;

  constructor(private http: HttpClient) {}

  getMyInvoices(): Observable<ApiResponse<Invoice[]>> {
    return this.http.get<ApiResponse<Invoice[]>>(`${this.apiUrl}/me`);
  }

  generateInvoice(): Observable<ApiResponse<Invoice>> {
    return this.http.post<ApiResponse<Invoice>>(`${this.apiUrl}/generate`, {});
  }

  payInvoice(id: string): Observable<ApiResponse<Invoice>> {
    return this.http.post<ApiResponse<Invoice>>(`${this.apiUrl}/${id}/pay`, {});
  }

  payWithCreditCard(request: CardPaymentRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.paymentsUrl}/card/pay`, request);
  }

  getVietQr(invoiceId: string): Observable<ApiResponse<VietQrResponse>> {
    return this.http.get<ApiResponse<VietQrResponse>>(`${this.paymentsUrl}/vietqr/${invoiceId}`);
  }

  confirmPaymentWebhook(transactionReference: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.paymentsUrl}/webhook?transactionReference=${transactionReference}`, {});
  }

  downloadInvoicePdf(invoiceId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${invoiceId}/pdf`, {
      responseType: 'blob'
    });
  }

  exportInvoicesCsv(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/csv`, {
      responseType: 'blob'
    });
  }

  getAllInvoices(page: number = 0, size: number = 10): Observable<ApiResponse<PageResponse<Invoice>>> {
    return this.http.get<ApiResponse<PageResponse<Invoice>>>(`${this.apiUrl}/admin?page=${page}&size=${size}`);
  }
}
