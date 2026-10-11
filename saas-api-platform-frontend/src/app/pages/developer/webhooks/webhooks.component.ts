import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebhookService } from '../../../core/services/webhook.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { WebhookDeliveryLog, WebhookEndpoint } from '../../../core/models';

@Component({
  selector: 'app-webhooks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">{{ t('wh.title') }}</h1>
          <p class="text-sm text-slate-400 mt-1">{{ t('wh.subtitle') }}</p>
        </div>

        <button (click)="showCreateModal.set(true)" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2">
          {{ t('wh.register_btn') }}
        </button>
      </div>

      <!-- Create Modal -->
      <div *ngIf="showCreateModal()" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="glass-panel p-6 rounded-2xl border border-slate-700 max-w-lg w-full space-y-4 shadow-2xl">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">{{ t('wh.register_btn') }}</h3>
            <button (click)="showCreateModal.set(false)" class="text-slate-400 hover:text-white">&times;</button>
          </div>
          
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Target URL (HTTPS)</label>
            <input [(ngModel)]="newUrl" placeholder="https://my-app.com/api/webhook" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono outline-none focus:border-brand-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Sự Kiện Đăng Ký (Events)</label>
            <input [(ngModel)]="newEvents" placeholder="invoice.paid,subscription.created" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono outline-none focus:border-brand-500" />
            <p class="text-[11px] text-slate-500 mt-1">Hỗ trợ: invoice.paid, subscription.created, api_key.rotated, usage.threshold_exceeded</p>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button (click)="showCreateModal.set(false)" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all">
              {{ t('btn.cancel') }}
            </button>
            <button (click)="createEndpoint()" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all">
              {{ t('btn.save') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Endpoints List -->
      <div class="space-y-4">
        <div *ngIf="endpoints().length === 0" class="glass-panel p-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-xs">
          {{ t('keys.empty') }}
        </div>

        <div *ngFor="let ep of endpoints()" class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-3">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {{ ep.status }}
                </span>
                <span class="font-mono text-sm font-bold text-white">{{ ep.targetUrl }}</span>
              </div>
              <p class="text-xs text-slate-400 mt-1.5 font-mono">
                Secret HMAC: <span class="text-brand-400 select-all bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">{{ ep.secretKey }}</span>
              </p>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <span *ngFor="let ev of ep.events.split(',')" class="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-[10px] font-mono text-slate-300">
                  {{ ev.trim() }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button (click)="testPing(ep.id)" class="px-3.5 py-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-xs font-semibold border border-brand-500/20 transition-all flex items-center gap-1.5">
                {{ t('wh.ping_btn') }}
              </button>
              <button (click)="viewLogs(ep.id)" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5">
                🔍 {{ t('wh.inspect_logs') }}
              </button>
              <button (click)="deleteEndpoint(ep.id)" class="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-all" title="Xóa">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Webhook Delivery Inspector Modal -->
      <div *ngIf="selectedLogs()" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div class="glass-panel p-6 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <span>⚡ {{ t('wh.logs_modal_title') }}</span>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
                  {{ selectedLogs()?.length || 0 }} events
                </span>
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">Kiểm tra chi tiết Payload, Response HTTP code, độ trễ và số lần thử lại</p>
            </div>
            <button (click)="selectedLogs.set(null)" class="text-slate-400 hover:text-white text-xl p-1 rounded-lg hover:bg-slate-800">&times;</button>
          </div>

          <div class="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            <div *ngIf="selectedLogs()?.length === 0" class="text-center py-12 text-xs text-slate-400">
              {{ t('wh.no_logs') }}
            </div>

            <div *ngFor="let log of selectedLogs()" class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div class="flex items-center gap-2.5">
                  <span [class]="log.success || (log.responseStatus && log.responseStatus >= 200 && log.responseStatus < 300) ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'" class="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border">
                    HTTP {{ log.responseStatus || 'FAILED' }}
                  </span>
                  <span class="font-mono font-bold text-white">{{ log.eventType }}</span>
                  <span *ngIf="log.latencyMs !== undefined && log.latencyMs !== null" class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                    ⏱ {{ log.latencyMs }}ms
                  </span>
                  <span *ngIf="log.retryCount" class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[10px]">
                    Retry #{{ log.retryCount }}
                  </span>
                </div>
                <span class="text-[11px] font-mono text-slate-500">{{ log.createdAt | date:'yyyy-MM-dd HH:mm:ss' }}</span>
              </div>

              <!-- Payload & Response Detail -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div class="space-y-1">
                  <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{{ t('wh.th_payload') }}</div>
                  <pre class="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-36 whitespace-pre-wrap">{{ formatJson(log.payload) }}</pre>
                </div>
                <div class="space-y-1">
                  <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{{ t('wh.th_response') }}</div>
                  <pre class="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-36 whitespace-pre-wrap">{{ log.responseBody || '(Empty response body)' }}</pre>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-800 flex justify-end">
            <button (click)="selectedLogs.set(null)" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all">
              {{ t('btn.close') }}
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class WebhooksComponent implements OnInit {
  private webhookService = inject(WebhookService);
  private toastService = inject(ToastService);
  private translationService = inject(TranslationService);

  public endpoints = signal<WebhookEndpoint[]>([]);
  public showCreateModal = signal(false);
  public selectedLogs = signal<WebhookDeliveryLog[] | null>(null);

  public newUrl = 'https://webhook.site/test-endpoint';
  public newEvents = 'invoice.paid,subscription.created';

  public t = (k: string) => this.translationService.t(k);

  ngOnInit(): void {
    this.loadEndpoints();
  }

  loadEndpoints(): void {
    this.webhookService.getMyEndpoints().subscribe({
      next: (res) => this.endpoints.set(res.data)
    });
  }

  createEndpoint(): void {
    if (!this.newUrl.trim()) {
      this.toastService.warning('Vui lòng nhập Target URL!');
      return;
    }
    this.webhookService.registerEndpoint({ targetUrl: this.newUrl.trim(), events: this.newEvents }).subscribe({
      next: () => {
        this.toastService.success('Đăng ký Webhook Endpoint thành công!');
        this.showCreateModal.set(false);
        this.loadEndpoints();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi đăng ký Webhook')
    });
  }

  testPing(id: string): void {
    this.toastService.info('Đang gửi tín hiệu Test Ping...');
    this.webhookService.testEndpoint(id).subscribe({
      next: () => this.toastService.success('Gửi Ping Test thành công! Đã ký Header X-SaaS-Signature.'),
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi gửi ping test')
    });
  }

  viewLogs(id: string): void {
    this.webhookService.getDeliveryLogs(id).subscribe({
      next: (res) => this.selectedLogs.set(res.data),
      error: (err) => this.toastService.error(err.error?.message || 'Không thể tải logs')
    });
  }

  deleteEndpoint(id: string): void {
    if (confirm('Xóa Webhook Endpoint này?')) {
      this.webhookService.deleteEndpoint(id).subscribe({
        next: () => {
          this.toastService.success('Đã xóa webhook endpoint');
          this.loadEndpoints();
        },
        error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi xóa endpoint')
      });
    }
  }

  formatJson(val: string): string {
    if (!val) return '{}';
    try {
      return JSON.stringify(JSON.parse(val), null, 2);
    } catch {
      return val;
    }
  }
}
