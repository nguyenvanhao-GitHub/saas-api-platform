import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment';

export interface ApiDocEndpoint {
  module: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  authRequired: boolean;
  requestHeaders?: { name: string; required: boolean; desc: string }[];
  requestBody?: string;
  responseSample: string;
}

@Component({
  selector: 'app-docs-explorer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-white tracking-tight">{{ i18n.t('docs.title') }}</h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">OpenAPI 3.0</span>
          </div>
          <p class="text-sm text-slate-400 mt-1">{{ i18n.t('docs.subtitle') }}</p>
        </div>

        <div class="flex items-center gap-2">
          <a [href]="swaggerUrl" target="_blank" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            {{ i18n.t('docs.open_swagger') }}
          </a>
        </div>
      </div>

      <!-- Module Category Filter Chips -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1">
        @for (tag of moduleTags; track tag) {
          <button 
            (click)="selectedTag.set(tag)"
            [class]="selectedTag() === tag ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20 font-bold' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'"
            class="px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all">
            {{ tag === 'ALL' ? i18n.t('docs.all') : tag }}
          </button>
        }
      </div>

      <!-- Endpoints List -->
      <div class="space-y-4">
        @for (api of filteredEndpoints(); track api.path + api.method) {
          <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl transition-all">
            
            <!-- Endpoint Header Bar -->
            <div 
              (click)="toggleExpand(api.path + api.method)"
              class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-all">
              
              <div class="flex items-center gap-3.5 flex-1 min-w-0">
                <span 
                  [ngClass]="{
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': api.method === 'GET',
                    'bg-blue-500/10 text-blue-400 border-blue-500/20': api.method === 'POST',
                    'bg-amber-500/10 text-amber-400 border-amber-500/20': api.method === 'PUT',
                    'bg-rose-500/10 text-rose-400 border-rose-500/20': api.method === 'DELETE'
                  }"
                  class="px-3 py-1.5 rounded-lg text-xs font-mono font-bold border shrink-0">
                  {{ api.method }}
                </span>
                <span class="font-mono text-xs font-semibold text-white truncate">{{ api.path }}</span>
                <span class="text-xs text-slate-400 truncate hidden md:inline">— {{ api.summary }}</span>
              </div>

              <div class="flex items-center gap-3 shrink-0">
                <span *ngIf="api.authRequired" class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {{ i18n.t('docs.auth_required') }}
                </span>
                <span *ngIf="!api.authRequired" class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                  {{ i18n.t('docs.public') }}
                </span>
                <button class="text-slate-400 hover:text-white text-xs">
                  {{ isExpanded(api.path + api.method) ? i18n.t('docs.collapse') : i18n.t('docs.details') }}
                </button>
              </div>

            </div>

            <!-- Expanded Details View -->
            <div *ngIf="isExpanded(api.path + api.method)" class="p-6 border-t border-slate-800/80 bg-slate-950/60 space-y-6 animate-in fade-in duration-200">
              <p class="text-xs text-slate-300 leading-relaxed">{{ api.description }}</p>

              <!-- Headers Section -->
              <div *ngIf="api.requestHeaders?.length">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{{ i18n.t('docs.req_headers') }}</h4>
                <div class="space-y-1.5">
                  @for (h of api.requestHeaders; track h.name) {
                    <div class="flex items-center gap-3 text-xs p-2 rounded-lg bg-slate-900 border border-slate-800/80 font-mono">
                      <span class="text-brand-400 font-bold">{{ h.name }}</span>
                      <span [class]="h.required ? 'text-rose-400' : 'text-slate-500'" class="text-[10px] uppercase font-sans">
                        {{ h.required ? i18n.t('docs.required') : i18n.t('docs.optional') }}
                      </span>
                      <span class="text-slate-400 font-sans text-xs flex-1">{{ h.desc }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Request Body -->
              <div *ngIf="api.requestBody">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{{ i18n.t('docs.req_body') }}</h4>
                <pre class="p-4 rounded-xl bg-slate-950 border border-slate-900 font-mono text-xs text-slate-300 overflow-x-auto">{{ api.requestBody }}</pre>
              </div>

              <!-- Response Sample -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400">{{ i18n.t('docs.res_sample') }}</h4>
                  <button (click)="copyText(api.responseSample)" class="text-xs text-slate-400 hover:text-white transition-colors">
                    {{ i18n.t('docs.copy_json') }}
                  </button>
                </div>
                <pre class="p-4 rounded-xl bg-slate-950 border border-slate-900 font-mono text-xs text-emerald-300 overflow-x-auto">{{ api.responseSample }}</pre>
              </div>

              <!-- Playground Link -->
              <div class="pt-2 flex justify-end">
                <a routerLink="/playground" class="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all inline-flex items-center gap-2">
                  <span>⚡</span> {{ i18n.t('docs.test_playground') }}
                </a>
              </div>

            </div>

          </div>
        }
      </div>

    </div>
  `
})
export class DocsExplorerComponent {
  private toastService = inject(ToastService);
  public i18n = inject(TranslationService);

  public swaggerUrl = `${environment.apiBaseUrl.replace('/api/v1', '')}/swagger-ui.html`;
  public selectedTag = signal('ALL');
  public expandedKeys = signal<Set<string>>(new Set(['/api/v1/gateway/executePOST']));

  public moduleTags = [
    'ALL',
    'Authentication',
    'Gateway & Rate Limiting',
    'Invoices & Payments',
    'Webhooks',
    'API Marketplace',
    'Coupons & Promos'
  ];

  public endpoints: ApiDocEndpoint[] = [
    {
      module: 'Gateway & Rate Limiting',
      method: 'POST',
      path: '/api/v1/gateway/execute',
      summary: 'Thực thi giao dịch API Gateway (X-API-KEY)',
      description: 'Cổng Gateway chịu tải cao, tự động kiểm tra Redis Token Bucket Rate Limit (60 req/min) và trả về dữ liệu catalog thương mại.',
      authRequired: false,
      requestHeaders: [
        { name: 'X-API-KEY', required: true, desc: 'API Key được cấp phát của Developer' },
        { name: 'Content-Type', required: true, desc: 'application/json' }
      ],
      responseSample: `{
  "code": 1000,
  "message": "Giao dịch API thành công",
  "data": {
    "requestsThisMinute": 1,
    "remainingQuota": 59,
    "endpoint": "/v1/business/tax-lookup",
    "data": {
      "taxCode": "0108999888",
      "companyName": "CÔNG TY CỔ PHẦN CÔNG NGHỆ SAAS PLATFORM VIỆT NAM",
      "status": "Đang hoạt động"
    }
  }
}`
    },
    {
      module: 'Authentication',
      method: 'POST',
      path: '/api/v1/auth/social-login',
      summary: 'Đăng nhập Mạng xã hội (Google / GitHub)',
      description: 'Tự động tạo tài khoản hoặc đăng nhập với Google / GitHub và cấp phát JWT Tokens.',
      authRequired: false,
      requestBody: `{
  "provider": "GOOGLE",
  "email": "developer@saas-platform.com",
  "fullName": "Google Developer User"
}`,
      responseSample: `{
  "code": 1000,
  "message": "Đăng nhập mạng xã hội thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
    "apiKey": "sk_live_a1b2c3d4e5f6...",
    "role": "ROLE_DEVELOPER"
  }
}`
    },
    {
      module: 'Invoices & Payments',
      method: 'POST',
      path: '/api/v1/payments/card/pay',
      summary: 'Thanh toán Hóa đơn bằng Thẻ Quốc Tế (Stripe)',
      description: 'Xử lý thanh toán thẻ Visa / Mastercard qua Stripe Gateway và gạch nợ tự động.',
      authRequired: true,
      requestHeaders: [
        { name: 'Authorization', required: true, desc: 'Bearer JWT Access Token' }
      ],
      requestBody: `{
  "invoiceId": "e1f2a3b4-5678-90ab-cdef-1234567890ab",
  "cardNumber": "4242424242424242",
  "cardHolder": "NGUYEN VAN A",
  "expiry": "12/28",
  "cvc": "123"
}`,
      responseSample: `{
  "code": 1000,
  "message": "Thanh toán thẻ thành công",
  "data": {
    "transactionReference": "ch_3M4X1...",
    "status": "SUCCESS",
    "amount": 50.00,
    "currency": "USD"
  }
}`
    },
    {
      module: 'Invoices & Payments',
      method: 'GET',
      path: '/api/v1/invoices/{id}/pdf',
      summary: 'Tải xuống Hóa đơn PDF OpenPDF Binary Stream',
      description: 'Sinh tệp PDF A4 chuẩn doanh nghiệp và stream trực tiếp dạng nhị phân application/pdf.',
      authRequired: true,
      requestHeaders: [
        { name: 'Authorization', required: true, desc: 'Bearer JWT Access Token' }
      ],
      responseSample: `// Binary PDF Content (application/pdf stream)`
    },
    {
      module: 'Webhooks',
      method: 'POST',
      path: '/api/v1/webhooks/test/{id}',
      summary: 'Bắn tín hiệu Test Ping Webhook ký HMAC-SHA256',
      description: 'Gửi bản tin thử nghiệm có kèm Header X-SaaS-Signature tới Webhook Endpoint của Developer.',
      authRequired: true,
      responseSample: `{
  "code": 1000,
  "message": "Gửi test ping thành công",
  "data": {
    "status": "DELIVERED",
    "httpStatus": 200
  }
}`
    }
  ];

  filteredEndpoints(): ApiDocEndpoint[] {
    const tag = this.selectedTag();
    if (tag === 'ALL') return this.endpoints;
    return this.endpoints.filter(e => e.module === tag);
  }

  toggleExpand(key: string): void {
    const set = new Set(this.expandedKeys());
    if (set.has(key)) {
      set.delete(key);
    } else {
      set.add(key);
    }
    this.expandedKeys.set(set);
  }

  isExpanded(key: string): boolean {
    return this.expandedKeys().has(key);
  }

  copyText(text: string): void {
    navigator.clipboard.writeText(text);
    this.toastService.success('Đã sao chép vào clipboard!');
  }
}
