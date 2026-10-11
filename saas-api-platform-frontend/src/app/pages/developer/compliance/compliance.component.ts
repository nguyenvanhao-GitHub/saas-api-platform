import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplianceService } from '../../../core/services/compliance.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">{{ t('compliance.title') }}</h1>
        <p class="text-sm text-slate-400 mt-1">{{ t('compliance.subtitle') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
          <div class="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-white">{{ t('compliance.export_title') }}</h3>
            <p class="text-xs text-slate-400 mt-1 leading-relaxed">{{ t('compliance.export_desc') }}</p>
          </div>
          <button (click)="exportData()" class="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            {{ t('compliance.download_json') }}
          </button>
          <div *ngIf="exportedJson()" class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-mono text-emerald-400 max-h-48 overflow-y-auto whitespace-pre">
            {{ exportedJson() }}
          </div>
        </div>

        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
          <div class="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-white">{{ t('compliance.delete_title') }}</h3>
            <p class="text-xs text-slate-400 mt-1 leading-relaxed">{{ t('compliance.delete_desc') }}</p>
          </div>
          <button (click)="requestDeletion()" class="w-full py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            {{ t('compliance.submit_deletion_req') }}
          </button>
          <div *ngIf="deletionResult()" class="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
            <div class="font-bold mb-1">Ticket: {{ deletionResult()?.ticketId }}</div>
            <div>{{ deletionResult()?.message }}</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ComplianceComponent {
  private complianceService = inject(ComplianceService);
  private trans = inject(TranslationService);

  exportedJson = signal<string | null>(null);
  deletionResult = signal<{ ticketId: string; message: string } | null>(null);

  t(key: string): string {
    return this.trans.t(key);
  }

  exportData() {
    this.complianceService.exportUserData().subscribe({
      next: (data) => {
        this.exportedJson.set(JSON.stringify(data, null, 2));
      }
    });
  }

  requestDeletion() {
    this.complianceService.requestDeletion().subscribe({
      next: (res) => {
        this.deletionResult.set(res);
      }
    });
  }
}