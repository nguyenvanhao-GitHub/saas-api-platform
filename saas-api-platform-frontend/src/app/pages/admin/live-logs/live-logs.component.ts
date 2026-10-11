import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';

interface LiveLogItem {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  method: string;
  path: string;
  status: number;
  latencyMs: number;
  ip: string;
}

@Component({
  selector: 'app-live-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">{{ t('logs.title') }}</h1>
          <p class="text-sm text-slate-400 mt-1">{{ t('logs.subtitle') }}</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="toggleStreaming()" [ngClass]="isStreaming() ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all">
            <span class="w-2 h-2 rounded-full" [ngClass]="isStreaming() ? 'bg-white animate-pulse' : 'bg-slate-500'"></span>
            {{ isStreaming() ? t('logs.streaming_active') : t('logs.streaming_paused') }}
          </button>
          <button (click)="clearLogs()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all">
            {{ t('logs.clear_terminal') }}
          </button>
        </div>
      </div>

      <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div class="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            <span class="text-xs font-mono text-slate-400 ml-2">gateway-live-tail --follow</span>
          </div>
          <span class="text-[11px] font-mono text-slate-500">{{ logs().length }} events logged</span>
        </div>

        <div class="p-4 font-mono text-xs space-y-2 max-h-[550px] overflow-y-auto">
          <div *ngFor="let log of logs()" class="flex items-center gap-3 py-1 border-b border-slate-900/60 hover:bg-slate-900/40 px-2 rounded transition-colors">
            <span class="text-slate-500 text-[11px]">{{ log.timestamp }}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold" [ngClass]="log.level === 'ERROR' ? 'bg-rose-500/10 text-rose-400' : (log.level === 'WARN' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400')">
              {{ log.level }}
            </span>
            <span class="font-bold text-slate-300 w-12">{{ log.method }}</span>
            <span class="text-brand-400 flex-1 truncate">{{ log.path }}</span>
            <span class="font-bold" [ngClass]="log.status >= 400 ? 'text-rose-400' : 'text-emerald-400'">{{ log.status }}</span>
            <span class="text-amber-400 text-[11px]">{{ log.latencyMs }}ms</span>
            <span class="text-slate-600 text-[11px]">{{ log.ip }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LiveLogsComponent implements OnInit, OnDestroy {
  private trans = inject(TranslationService);

  logs = signal<LiveLogItem[]>([]);
  isStreaming = signal<boolean>(true);
  private timer: any;

  t(key: string): string {
    return this.trans.t(key);
  }

  ngOnInit() {
    this.seedLogs();
    this.startStreaming();
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  seedLogs() {
    this.logs.set([
      { id: '1', timestamp: new Date().toLocaleTimeString(), level: 'INFO', method: 'GET', path: '/api/v1/products', status: 200, latencyMs: 24, ip: '192.168.1.102' },
      { id: '2', timestamp: new Date().toLocaleTimeString(), level: 'INFO', method: 'POST', path: '/api/v1/payments/checkout', status: 200, latencyMs: 142, ip: '113.161.42.19' },
      { id: '3', timestamp: new Date().toLocaleTimeString(), level: 'WARN', method: 'POST', path: '/api/v1/gateway/execute', status: 429, latencyMs: 8, ip: '45.122.90.14' }
    ]);
  }

  startStreaming() {
    this.timer = setInterval(() => {
      if (!this.isStreaming()) return;
      const paths = ['/api/v1/users/profile', '/api/v1/mock/orders', '/api/v1/products', '/api/v1/webhooks/dispatch', '/api/v1/auth/token'];
      const methods = ['GET', 'POST', 'GET', 'POST', 'GET'];
      const statuses = [200, 200, 200, 201, 429, 500];
      const idx = Math.floor(Math.random() * paths.length);
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const newLog: LiveLogItem = {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        level: status >= 500 ? 'ERROR' : (status >= 400 ? 'WARN' : 'INFO'),
        method: methods[idx],
        path: paths[idx],
        status,
        latencyMs: Math.floor(Math.random() * 120) + 12,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      };

      this.logs.update(current => [newLog, ...current.slice(0, 49)]);
    }, 2500);
  }

  toggleStreaming() {
    this.isStreaming.set(!this.isStreaming());
  }

  clearLogs() {
    this.logs.set([]);
  }
}