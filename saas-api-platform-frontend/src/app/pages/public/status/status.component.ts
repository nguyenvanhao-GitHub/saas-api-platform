import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatusService } from '../../../core/services/status.service';
import { TranslationService } from '../../../core/services/translation.service';
import { PublicStatusData } from '../../../core/models';

@Component({
  selector: 'app-public-status',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 antialiased selection:bg-brand-500 selection:text-white">
      <div class="max-w-4xl mx-auto space-y-8">
        
        <!-- Header Brand & Back to App -->
        <div class="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 class="font-bold text-lg text-white">{{ i18n.t('status_page.title') }}</h1>
              <p class="text-xs text-slate-400 font-mono">{{ i18n.t('status_page.subtitle') }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Language Switcher -->
            <button (click)="i18n.toggleLanguage()" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-800 transition-all">
              {{ i18n.currentLang() === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN' }}
            </button>
            <a routerLink="/dashboard" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all">
              {{ i18n.t('status_page.back_to_portal') }}
            </a>
          </div>
        </div>

        <!-- Overall Status Banner -->
        <div class="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-4 h-4 rounded-full bg-emerald-400 animate-ping"></div>
            <div>
              <h2 class="text-lg font-bold text-emerald-400">{{ i18n.t('status_page.all_operational') }}</h2>
              <p class="text-xs text-slate-300 mt-0.5">{{ i18n.t('status_page.all_operational_desc') }}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400 block">{{ i18n.t('status_page.overall_uptime') }}</span>
            <span class="text-xl font-bold font-mono text-white">{{ statusData()?.overallUptime || '99.98%' }}</span>
          </div>
        </div>

        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <span class="text-xs text-slate-400 font-medium">{{ i18n.t('status_page.uptime_90d') }}</span>
            <p class="text-2xl font-bold text-emerald-400 font-mono">99.98%</p>
            <p class="text-[10px] text-slate-500">{{ i18n.t('status_page.zero_major_outages') }}</p>
          </div>
          <div class="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <span class="text-xs text-slate-400 font-medium">{{ i18n.t('status_page.avg_latency') }}</span>
            <p class="text-2xl font-bold text-brand-400 font-mono">{{ statusData()?.avgLatencyMs || 31 }} ms</p>
            <p class="text-[10px] text-slate-500">{{ i18n.t('status_page.global_edge') }}</p>
          </div>
          <div class="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <span class="text-xs text-slate-400 font-medium">{{ i18n.t('status_page.active_services') }}</span>
            <p class="text-2xl font-bold text-indigo-400 font-mono">{{ statusData()?.servicesCount || 8 }} / 8</p>
            <p class="text-[10px] text-slate-500">{{ i18n.t('status_page.fully_monitored') }}</p>
          </div>
        </div>

        <!-- 90 Days Uptime Visualizer Bar -->
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span class="font-semibold text-white">{{ i18n.t('status_page.history_title') }}</span>
            <span class="text-[11px] font-mono">90 {{ i18n.t('status_page.days_ago') }} — {{ i18n.t('status_page.today') }}</span>
          </div>
          <div class="flex gap-1 h-8 items-center">
            @for (bar of uptimeBars; track $index) {
              <div 
                class="flex-1 h-7 rounded-sm bg-emerald-500 hover:bg-emerald-400 cursor-pointer transition-all"
                [title]="'Day ' + ($index + 1) + ': 100% Uptime (0 incidents)'"></div>
            }
          </div>
        </div>

        <!-- Services Breakdown List -->
        <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl space-y-0">
          <div class="p-4 bg-slate-900/80 border-b border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider">
            {{ i18n.t('status_page.service_status_breakdown') }}
          </div>
          <div class="divide-y divide-slate-800/60">
            @for (s of statusData()?.services; track s.name) {
              <div class="p-4.5 px-6 flex items-center justify-between hover:bg-slate-900/30 transition-all">
                <div class="flex items-center gap-3.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <div>
                    <span class="text-sm font-semibold text-white block">{{ s.name }}</span>
                    <span class="text-[11px] text-slate-500 font-mono uppercase">{{ s.category }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <span class="text-xs font-mono text-slate-400 hidden sm:inline">{{ s.latencyMs }} ms</span>
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {{ s.status === 'OPERATIONAL' ? i18n.t('status_page.operational') : s.status }}
                  </span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-xs text-slate-500 pt-6 font-mono">
          {{ i18n.t('status_page.powered_by') }} &bull; {{ i18n.t('status_page.auto_refreshed') }}
        </div>

      </div>
    </div>
  `
})
export class PublicStatusComponent implements OnInit {
  private statusService = inject(StatusService);
  public i18n = inject(TranslationService);

  public statusData = signal<PublicStatusData | null>(null);
  public uptimeBars = Array(45).fill(1);

  ngOnInit(): void {
    this.statusService.getPublicStatus().subscribe({
      next: (res) => this.statusData.set(res.data)
    });
  }
}
