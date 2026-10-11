import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SlaProbeService } from '../../../core/services/sla-probe.service';
import { SlaProbe } from '../../../core/models';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-sla-probes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">{{ t('sla.title') }}</h1>
          <p class="text-sm text-slate-400 mt-1">{{ t('sla.subtitle') }}</p>
        </div>
        <button (click)="showCreateModal.set(true)" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          {{ t('sla.add_probe') }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div *ngFor="let probe of probes()" class="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl space-y-4 hover:border-slate-700 transition-all">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase" [ngClass]="probe.status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'">
              {{ probe.status }}
            </span>
            <div class="flex items-center gap-1">
              <button (click)="pingProbe(probe.id)" class="p-1.5 text-slate-400 hover:text-brand-400 rounded-lg hover:bg-slate-800 transition-colors" title="Ping Now">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </button>
              <button (click)="deleteProbe(probe.id)" class="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-bold text-white">{{ probe.name }}</h3>
            <p class="text-[11px] font-mono text-slate-400 mt-1 truncate">{{ probe.targetUrl }}</p>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
            <div>
              <div class="text-[10px] text-slate-500 font-semibold uppercase">Uptime SLA</div>
              <div class="text-sm font-bold font-mono text-emerald-400 mt-0.5">{{ probe.uptimePercentage }}%</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-500 font-semibold uppercase">Latency</div>
              <div class="text-sm font-bold font-mono text-amber-400 mt-0.5">{{ probe.lastLatencyMs }}ms</div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="showCreateModal()" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
          <h3 class="text-base font-bold text-white">{{ t('sla.create_title') }}</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">{{ t('sla.probe_name') }}</label>
              <input [(ngModel)]="newName" placeholder="Stripe Webhook Gateway" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-brand-500">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">{{ t('sla.target_url') }}</label>
              <input [(ngModel)]="newUrl" placeholder="https://api.example.com/health" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-brand-500 font-mono">
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button (click)="showCreateModal.set(false)" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
              {{ t('btn.cancel') }}
            </button>
            <button (click)="createProbe()" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold">
              {{ t('btn.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SlaProbesComponent implements OnInit {
  private slaService = inject(SlaProbeService);
  private trans = inject(TranslationService);

  probes = signal<SlaProbe[]>([]);
  showCreateModal = signal<boolean>(false);
  newName = 'Auth Microservice Heartbeat';
  newUrl = 'https://api.example.com/api/v1/auth/health';

  t(key: string): string {
    return this.trans.t(key);
  }

  ngOnInit() {
    this.loadProbes();
  }

  loadProbes() {
    this.slaService.getAllProbes().subscribe({
      next: (res) => this.probes.set(res)
    });
  }

  createProbe() {
    this.slaService.createProbe({
      name: this.newName,
      targetUrl: this.newUrl,
      httpMethod: 'GET',
      expectedStatus: 200,
      checkIntervalSeconds: 60
    }).subscribe({
      next: () => {
        this.showCreateModal.set(false);
        this.loadProbes();
      }
    });
  }

  pingProbe(id: string) {
    this.slaService.pingProbe(id).subscribe({
      next: () => this.loadProbes()
    });
  }

  deleteProbe(id: string) {
    this.slaService.deleteProbe(id).subscribe({
      next: () => this.loadProbes()
    });
  }
}