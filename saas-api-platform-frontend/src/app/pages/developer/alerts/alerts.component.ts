import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { UsageAlert } from '../../../core/models';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">{{ t('alerts.title') }}</h1>
          <p class="text-sm text-slate-400 mt-1">{{ t('alerts.subtitle') }}</p>
        </div>

        <button (click)="showModal.set(true)" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2">
          {{ t('alerts.create_btn') }}
        </button>
      </div>

      <!-- Create Modal -->
      <div *ngIf="showModal()" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="glass-panel p-6 rounded-2xl border border-slate-700 max-w-lg w-full space-y-4 shadow-2xl">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">{{ t('alerts.create_btn') }}</h3>
            <button (click)="showModal.set(false)" class="text-slate-400 hover:text-white">&times;</button>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{{ t('alerts.field_threshold') }} ({{ threshold }}%)</label>
            <input type="range" min="10" max="100" step="5" [(ngModel)]="threshold" class="w-full accent-brand-500 h-2 bg-slate-800 rounded-lg cursor-pointer" />
            <div class="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>50%</span>
              <span>80%</span>
              <span>90%</span>
              <span>100% (Full Quota)</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{{ t('alerts.field_channel') }}</label>
            <div class="grid grid-cols-2 gap-2">
              <button type="button" (click)="channel = 'IN_APP'" [class]="channel === 'IN_APP' ? 'border-brand-500 bg-brand-500/20 text-brand-400' : 'border-slate-800 bg-slate-900 text-slate-400'" class="p-3 rounded-xl border text-xs font-semibold text-center transition-all">
                🔔 In-App Bell
              </button>
              <button type="button" (click)="channel = 'SLACK'" [class]="channel === 'SLACK' ? 'border-brand-500 bg-brand-500/20 text-brand-400' : 'border-slate-800 bg-slate-900 text-slate-400'" class="p-3 rounded-xl border text-xs font-semibold text-center transition-all">
                💬 Slack Webhook
              </button>
              <button type="button" (click)="channel = 'DISCORD'" [class]="channel === 'DISCORD' ? 'border-brand-500 bg-brand-500/20 text-brand-400' : 'border-slate-800 bg-slate-900 text-slate-400'" class="p-3 rounded-xl border text-xs font-semibold text-center transition-all">
                🎮 Discord Webhook
              </button>
              <button type="button" (click)="channel = 'EMAIL'" [class]="channel === 'EMAIL' ? 'border-brand-500 bg-brand-500/20 text-brand-400' : 'border-slate-800 bg-slate-900 text-slate-400'" class="p-3 rounded-xl border text-xs font-semibold text-center transition-all">
                ✉️ Email Alert
              </button>
            </div>
          </div>

          <div *ngIf="channel === 'SLACK' || channel === 'DISCORD'">
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Webhook URL</label>
            <input [(ngModel)]="destination" placeholder="https://hooks.slack.com/services/... hoặc Discord webhook" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono outline-none focus:border-brand-500" />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button (click)="showModal.set(false)" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all">
              {{ t('btn.cancel') }}
            </button>
            <button (click)="saveAlert()" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all">
              {{ t('btn.save') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Alerts List -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div *ngIf="alerts().length === 0" class="col-span-full glass-panel p-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-xs">
          {{ t('alerts.empty') }}
        </div>

        <div *ngFor="let a of alerts()" class="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1.5">
              <div class="flex items-center gap-2.5">
                <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {{ a.thresholdPercentage }}% Quota
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {{ a.channel }}
                </span>
                <span *ngIf="a.isTriggered" class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
                  Triggered
                </span>
              </div>
              <p class="text-xs text-slate-400 truncate max-w-sm font-mono mt-2" *ngIf="a.destination">
                Target: <span class="text-slate-200">{{ a.destination }}</span>
              </p>
              <p class="text-[11px] text-slate-500">Tạo ngày: {{ a.createdAt | date:'short' }}</p>
            </div>

            <div class="flex items-center gap-2">
              <button (click)="testAlert(a.id)" class="px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-xs font-semibold border border-brand-500/20 transition-all" title="Gửi test">
                ⚡ Test Ping
              </button>
              <button (click)="deleteAlert(a.id)" class="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-all" title="Xóa">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AlertsComponent implements OnInit {
  private alertService = inject(AlertService);
  private toastService = inject(ToastService);
  private translationService = inject(TranslationService);

  public alerts = signal<UsageAlert[]>([]);
  public showModal = signal(false);

  public threshold = 80;
  public channel = 'IN_APP';
  public destination = '';

  public t = (k: string) => this.translationService.t(k);

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.alertService.getMyAlerts().subscribe({
      next: (res) => this.alerts.set(res.data)
    });
  }

  saveAlert(): void {
    this.alertService.createAlert({
      thresholdPercentage: this.threshold,
      channel: this.channel,
      destination: this.destination
    }).subscribe({
      next: () => {
        this.toastService.success('Đã lưu cấu hình cảnh báo hạn mức!');
        this.showModal.set(false);
        this.loadAlerts();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi tạo cảnh báo')
    });
  }

  testAlert(id: string): void {
    this.toastService.info('Đang gửi tín hiệu kiểm thử cảnh báo...');
    this.alertService.testAlert(id).subscribe({
      next: () => this.toastService.success('Bắn tín hiệu kiểm thử cảnh báo thành công! Kiểm tra notification.'),
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi gửi test')
    });
  }

  deleteAlert(id: string): void {
    if (confirm('Xóa quy tắc cảnh báo này?')) {
      this.alertService.deleteAlert(id).subscribe({
        next: () => {
          this.toastService.success('Đã xóa quy tắc cảnh báo');
          this.loadAlerts();
        },
        error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi xóa')
      });
    }
  }
}