import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrafficReplayService } from '../../../core/services/traffic-replay.service';
import { TrafficReplayJob } from '../../../core/models';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-traffic-replay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">{{ t('replay.title') }}</h1>
          <p class="text-sm text-slate-400 mt-1">{{ t('replay.subtitle') }}</p>
        </div>
        <button (click)="showCreateModal.set(true)" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {{ t('replay.new_job') }}
        </button>
      </div>

      <div class="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-950/50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-mono">
              <th class="py-3 px-4">{{ t('replay.job_name') }}</th>
              <th class="py-3 px-4">{{ t('replay.target_url') }}</th>
              <th class="py-3 px-4 text-center">{{ t('replay.total_reqs') }}</th>
              <th class="py-3 px-4 text-center">{{ t('replay.success_rate') }}</th>
              <th class="py-3 px-4">{{ t('replay.status') }}</th>
              <th class="py-3 px-4 text-right">{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 text-xs">
            <tr *ngFor="let job of jobs()" class="hover:bg-slate-800/30 transition-colors">
              <td class="py-3.5 px-4 font-semibold text-white">{{ job.name }}</td>
              <td class="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{{ job.targetEnvUrl }}</td>
              <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-200">{{ job.recordedRequestsCount }}</td>
              <td class="py-3.5 px-4 text-center">
                <span class="font-mono font-bold text-emerald-400">{{ job.successCount }}</span> /
                <span class="font-mono text-rose-400">{{ job.failedCount }}</span>
              </td>
              <td class="py-3.5 px-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase" [ngClass]="job.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'">
                  {{ job.status }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-right">
                <button (click)="deleteJob(job.id)" class="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showCreateModal()" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
          <h3 class="text-base font-bold text-white">{{ t('replay.create_title') }}</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">{{ t('replay.job_name') }}</label>
              <input [(ngModel)]="newJobName" placeholder="E.g. Shadow Test Canary Cluster" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-brand-500">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">{{ t('replay.target_url') }}</label>
              <input [(ngModel)]="newJobUrl" placeholder="https://canary-api.internal" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-brand-500">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">{{ t('replay.total_reqs') }}</label>
              <input type="number" [(ngModel)]="newJobCount" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-brand-500">
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button (click)="showCreateModal.set(false)" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
              {{ t('btn.cancel') }}
            </button>
            <button (click)="runJob()" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold">
              {{ t('replay.start_replay') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TrafficReplayComponent implements OnInit {
  private replayService = inject(TrafficReplayService);
  private trans = inject(TranslationService);

  jobs = signal<TrafficReplayJob[]>([]);
  showCreateModal = signal<boolean>(false);
  newJobName = 'Shadow Test Staging Cluster';
  newJobUrl = 'https://staging-api.saas-platform.internal';
  newJobCount = 200;

  t(key: string): string {
    return this.trans.t(key);
  }

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.replayService.getAllJobs().subscribe({
      next: (res) => this.jobs.set(res)
    });
  }

  runJob() {
    this.replayService.createJob({
      name: this.newJobName,
      targetEnvUrl: this.newJobUrl,
      requestCount: this.newJobCount
    }).subscribe({
      next: () => {
        this.showCreateModal.set(false);
        this.loadJobs();
      }
    });
  }

  deleteJob(id: string) {
    this.replayService.deleteJob(id).subscribe({
      next: () => this.loadJobs()
    });
  }
}