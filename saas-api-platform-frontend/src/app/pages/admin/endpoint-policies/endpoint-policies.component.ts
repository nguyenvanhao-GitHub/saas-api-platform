import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EndpointPolicyService } from '../../../core/services/endpoint-policy.service';
import { EndpointPolicy } from '../../../core/models';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-endpoint-policies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">{{ t('policy.title') }}</h1>
          <p class="text-sm text-slate-400 mt-1">{{ t('policy.subtitle') }}</p>
        </div>
        <button (click)="showCreateModal.set(true)" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          {{ t('policy.add_policy') }}
        </button>
      </div>

      <div class="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-950/50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-mono">
              <th class="py-3 px-4">{{ t('policy.path') }}</th>
              <th class="py-3 px-4 text-center">{{ t('policy.method') }}</th>
              <th class="py-3 px-4 text-center">{{ t('policy.rate_limit') }}</th>
              <th class="py-3 px-4 text-center">{{ t('policy.burst') }}</th>
              <th class="py-3 px-4 text-center">{{ t('policy.pii_mask') }}</th>
              <th class="py-3 px-4 text-center">{{ t('policy.status') }}</th>
              <th class="py-3 px-4 text-right">{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 text-xs">
            <tr *ngFor="let p of policies()" class="hover:bg-slate-800/30 transition-colors">
              <td class="py-3.5 px-4 font-mono font-semibold text-white">{{ p.endpointPath }}</td>
              <td class="py-3.5 px-4 text-center">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-brand-400 border border-slate-700">{{ p.httpMethod }}</span>
              </td>
              <td class="py-3.5 px-4 text-center font-mono text-emerald-400">{{ p.rateLimitPerMin }}/min</td>
              <td class="py-3.5 px-4 text-center font-mono text-slate-300">{{ p.burstCapacity }}</td>
              <td class="py-3.5 px-4 text-center">
                <span *ngIf="p.isPiiMaskingEnabled" class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ENABLED</span>
                <span *ngIf="!p.isPiiMaskingEnabled" class="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-500">DISABLED</span>
              </td>
              <td class="py-3.5 px-4 text-center">
                <button (click)="togglePolicy(p.id)" [ngClass]="p.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500'" class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all">
                  {{ p.isActive ? 'ACTIVE' : 'INACTIVE' }}
                </button>
              </td>
              <td class="py-3.5 px-4 text-right">
                <button (click)="deletePolicy(p.id)" class="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showCreateModal()" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
          <h3 class="text-base font-bold text-white">{{ t('policy.create_title') }}</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">{{ t('policy.path') }}</label>
              <input [(ngModel)]="newPath" placeholder="/api/v1/checkout" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-brand-500 font-mono">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">{{ t('policy.method') }}</label>
                <select [(ngModel)]="newMethod" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-brand-500">
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">{{ t('policy.rate_limit') }}</label>
                <input type="number" [(ngModel)]="newRateLimit" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-brand-500 font-mono">
              </div>
            </div>
            <div class="flex items-center gap-2 pt-2">
              <input type="checkbox" [(ngModel)]="newPiiMask" id="piiMask" class="rounded bg-slate-950 border-slate-800 text-brand-500">
              <label for="piiMask" class="text-xs text-slate-300 font-medium">{{ t('policy.enable_pii') }}</label>
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button (click)="showCreateModal.set(false)" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
              {{ t('btn.cancel') }}
            </button>
            <button (click)="createPolicy()" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold">
              {{ t('btn.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EndpointPoliciesComponent implements OnInit {
  private policyService = inject(EndpointPolicyService);
  private trans = inject(TranslationService);

  policies = signal<EndpointPolicy[]>([]);
  showCreateModal = signal<boolean>(false);
  newPath = '/api/v1/orders/checkout';
  newMethod = 'POST';
  newRateLimit = 30;
  newPiiMask = true;

  t(key: string): string {
    return this.trans.t(key);
  }

  ngOnInit() {
    this.loadPolicies();
  }

  loadPolicies() {
    this.policyService.getPolicies().subscribe({
      next: (res) => this.policies.set(res)
    });
  }

  createPolicy() {
    this.policyService.createPolicy({
      endpointPath: this.newPath,
      httpMethod: this.newMethod,
      rateLimitPerMin: this.newRateLimit,
      burstCapacity: 10,
      isPiiMaskingEnabled: this.newPiiMask
    }).subscribe({
      next: () => {
        this.showCreateModal.set(false);
        this.loadPolicies();
      }
    });
  }

  togglePolicy(id: string) {
    this.policyService.togglePolicy(id).subscribe({
      next: () => this.loadPolicies()
    });
  }

  deletePolicy(id: string) {
    this.policyService.deletePolicy(id).subscribe({
      next: () => this.loadPolicies()
    });
  }
}