import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GatewayService } from '../../../core/services/gateway.service';
import { ReportService } from '../../../core/services/report.service';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { TrafficChartComponent } from '../../../core/components/traffic-chart.component';
import { AnalyticsOverview, DeveloperDashboard, UsageStats } from '../../../core/models';

@Component({
  selector: 'app-developer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TrafficChartComponent],
  template: `
    <div class="space-y-8">
      
      <!-- Welcome & Header Banner -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">{{ i18n.t('dashboard.welcome') }}, {{ authService.currentUser()?.fullName }} 👋</h1>
          <p class="text-sm text-slate-400 mt-1">{{ i18n.t('dashboard.subtitle') }}</p>
        </div>

        <div class="flex items-center gap-3">
          <button (click)="refreshStats()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {{ i18n.t('btn.refresh') }}
          </button>
          <a routerLink="/playground" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {{ i18n.t('btn.open_playground') }}
          </a>
        </div>
      </div>

      <!-- API Key Master Card -->
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <span class="text-[11px] font-semibold text-brand-400 uppercase tracking-wider font-mono">{{ i18n.t('dashboard.api_key_title') }}</span>
            <div class="flex items-center gap-3">
              <span class="font-mono text-base font-semibold text-white bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 select-all">
                {{ showKey() ? apiKey() : maskedKey() }}
              </span>
              <button (click)="toggleShowKey()" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all" title="Ẩn/Hiện">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
              <button (click)="copyApiKey()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                {{ copied() ? i18n.t('btn.copied') : i18n.t('btn.copy') }}
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button (click)="rotateApiKey()" class="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition-all">
              {{ i18n.t('btn.rotate_key') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Realtime Metric Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        <!-- Total Requests -->
        <div class="glass-card p-5 rounded-2xl border border-slate-800">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">{{ i18n.t('dashboard.stat_total_requests') }}</span>
            <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          <div class="text-2xl font-bold text-white">{{ stats()?.totalRequestsUsed || 0 | number }}</div>
          <p class="text-[11px] text-slate-400 mt-1">Redis Telemetry</p>
        </div>

        <!-- Requests This Minute -->
        <div class="glass-card p-5 rounded-2xl border border-slate-800">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">{{ i18n.t('dashboard.stat_requests_min') }}</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div class="text-2xl font-bold text-emerald-400">{{ stats()?.requestsThisMinute || 0 }} <span class="text-xs text-slate-400 font-normal">/ 60 req</span></div>
          <div class="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div class="bg-emerald-400 h-full rounded-full transition-all" [style.width.%]="((stats()?.requestsThisMinute || 0) / 60) * 100"></div>
          </div>
        </div>

        <!-- Rate Limit Remaining -->
        <div class="glass-card p-5 rounded-2xl border border-slate-800">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">{{ i18n.t('dashboard.stat_remaining') }}</span>
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
          </div>
          <div class="text-2xl font-bold text-white">{{ stats()?.remainingQuotaThisMinute || 60 }} <span class="text-xs text-slate-400 font-normal">req/min</span></div>
          <p class="text-[11px] text-slate-400 mt-1">TTL 60s</p>
        </div>

        <!-- Total Spent -->
        <div class="glass-card p-5 rounded-2xl border border-slate-800">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">{{ i18n.t('dashboard.stat_spent') }}</span>
            <div class="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div class="text-2xl font-bold text-white">{{ dashboard()?.totalSpent || 0 | currency:'USD' }}</div>
          <p class="text-[11px] text-slate-400 mt-1">Settled Invoices</p>
        </div>

      </div>

      <!-- 7-Day Interactive API Traffic Chart -->
      <app-traffic-chart [title]="'Lưu Lượng API Thời Gian Thực (24h Real-Time Telemetry)'"></app-traffic-chart>

      <!-- Real-Time Status & Top Endpoints Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" *ngIf="analytics()">
        <!-- HTTP Status Breakdown -->
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base text-white">📊 Tỷ Lệ Mã Phản Hồi HTTP</h3>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {{ analytics()?.successRate }}% Success
            </span>
          </div>

          <div class="space-y-3 pt-2">
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-emerald-400">2xx Success (Hợp lệ)</span>
                <span class="text-white font-mono">98.8%</span>
              </div>
              <div class="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full" style="width: 98.8%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-amber-400">4xx Client Errors (Rate Limit / Bad Req)</span>
                <span class="text-white font-mono">1.0%</span>
              </div>
              <div class="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div class="bg-amber-500 h-full rounded-full" style="width: 1.0%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-rose-400">5xx Server Errors (Hệ thống)</span>
                <span class="text-white font-mono">0.2%</span>
              </div>
              <div class="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div class="bg-rose-500 h-full rounded-full" style="width: 0.2%"></div>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Độ trễ trung bình: <strong class="text-brand-400 font-mono">{{ analytics()?.avgLatencyMs }}ms</strong></span>
              <span>Bị chặn rate limit: <strong class="text-amber-400 font-mono">{{ analytics()?.rateLimitBlocks }} req</strong></span>
            </div>
          </div>
        </div>

        <!-- Top Consumed Endpoints -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base text-white">🏆 Top Dịch Vụ API Sử Dụng Nhiều Nhất</h3>
            <span class="text-xs text-slate-400">24h qua</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th class="pb-2">API Endpoint</th>
                  <th class="pb-2">Phân Loại</th>
                  <th class="pb-2 text-center">Số Lần Gọi</th>
                  <th class="pb-2 text-right">Độ Trễ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/40">
                <tr *ngFor="let ep of analytics()?.topEndpoints" class="hover:bg-slate-900/30 transition-all">
                  <td class="py-2.5 font-mono text-white font-semibold">
                    <span class="px-1.5 py-0.5 rounded text-[10px] bg-brand-500/10 text-brand-400 mr-1.5">{{ ep.method }}</span>
                    {{ ep.endpoint }}
                  </td>
                  <td class="py-2.5 text-slate-300">
                    <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">{{ ep.category }}</span>
                  </td>
                  <td class="py-2.5 text-center font-mono font-bold text-emerald-400">{{ ep.callCount | number }}</td>
                  <td class="py-2.5 text-right font-mono text-slate-300">{{ ep.avgLatencyMs }}ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Active Subscriptions & Invoices Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Active Subscriptions -->
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base text-white">{{ i18n.t('dashboard.active_subs') }}</h3>
            <a routerLink="/marketplace" class="text-xs text-brand-400 hover:underline font-semibold">{{ i18n.t('dashboard.explore_more') }}</a>
          </div>

          <div *ngIf="dashboard()?.activeSubscriptions?.length === 0" class="text-center py-8 text-slate-400 text-xs">
            {{ i18n.t('dashboard.no_subs') }}
          </div>

          <div *ngFor="let sub of dashboard()?.activeSubscriptions" class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-xs font-mono font-bold text-brand-400 block">{{ sub.product.code }}</span>
              <p class="text-sm font-semibold text-white">{{ sub.product.name }}</p>
              <p class="text-xs text-slate-400">{{ sub.product.rateLimitPerMinute }} req/min • {{ sub.product.basePrice | currency:'USD' }}</p>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ACTIVE
            </span>
          </div>
        </div>

        <!-- Recent Invoices -->
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base text-white">{{ i18n.t('dashboard.recent_invoices') }}</h3>
            <a routerLink="/invoices" class="text-xs text-brand-400 hover:underline font-semibold">{{ i18n.t('dashboard.explore_more') }}</a>
          </div>

          <div *ngIf="dashboard()?.recentInvoices?.length === 0" class="text-center py-8 text-slate-400 text-xs">
            {{ i18n.t('dashboard.no_invoices') }}
          </div>

          <div *ngFor="let inv of dashboard()?.recentInvoices" class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-xs font-mono font-bold text-white block">{{ inv.invoiceNumber }}</span>
              <p class="text-xs text-slate-400">{{ inv.createdAt | date:'short' }}</p>
            </div>
            <div class="text-right">
              <span class="text-sm font-bold text-white block">{{ inv.amount | currency:'USD' }}</span>
              <span [class]="inv.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'" class="text-[11px] font-semibold">
                {{ inv.status }}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DeveloperDashboardComponent implements OnInit {
  public authService = inject(AuthService);
  public i18n = inject(TranslationService);
  private gatewayService = inject(GatewayService);
  private reportService = inject(ReportService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private analyticsService = inject(AnalyticsService);

  public stats = signal<UsageStats | null>(null);
  public dashboard = signal<DeveloperDashboard | null>(null);
  public analytics = signal<AnalyticsOverview | null>(null);
  public showKey = signal(false);
  public copied = signal(false);
  public apiKey = signal(this.authService.currentUser()?.apiKey || '');

  ngOnInit(): void {
    this.refreshStats();
  }

  maskedKey(): string {
    const key = this.apiKey();
    if (key.length <= 12) return '••••••••••••••••';
    return key.substring(0, 8) + '••••••••••••••••' + key.substring(key.length - 4);
  }

  toggleShowKey(): void {
    this.showKey.update(v => !v);
  }

  copyApiKey(): void {
    navigator.clipboard.writeText(this.apiKey());
    this.copied.set(true);
    this.toastService.success('Đã sao chép API Key vào clipboard!');
    setTimeout(() => this.copied.set(false), 2000);
  }

  rotateApiKey(): void {
    if (confirm('Xác nhận xoay vòng API Key mới? (API key cũ sẽ bị vô hiệu)')) {
      this.userService.rotateApiKey().subscribe({
        next: (res) => {
          this.apiKey.set(res.data.apiKey);
          this.toastService.success('Cấp phát API Key mới thành công!');
        },
        error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi tạo API key mới')
      });
    }
  }

  refreshStats(): void {
    this.gatewayService.getMyStats().subscribe({
      next: (res) => this.stats.set(res.data)
    });
    this.reportService.getDeveloperDashboard().subscribe({
      next: (res) => {
        this.dashboard.set(res.data);
        if (res.data.apiKey) {
          this.apiKey.set(res.data.apiKey);
        }
      }
    });
    this.analyticsService.getOverview().subscribe({
      next: (res) => this.analytics.set(res.data)
    });
  }
}
