import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirewallService } from '../../../core/services/firewall.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { IpFirewallRule } from '../../../core/models';

@Component({
  selector: 'app-firewall',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>🛡️ {{ t('firewall.title') }}</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Admin Only
            </span>
          </h1>
          <p class="text-sm text-slate-400 mt-1">{{ t('firewall.subtitle') }}</p>
        </div>

        <button (click)="showCreateModal.set(true)" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2">
          {{ t('firewall.create_btn') }}
        </button>
      </div>

      <!-- Create Modal -->
      <div *ngIf="showCreateModal()" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="glass-panel p-6 rounded-2xl border border-slate-700 max-w-md w-full space-y-4 shadow-2xl">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">{{ t('firewall.create_btn') }}</h3>
            <button (click)="showCreateModal.set(false)" class="text-slate-400 hover:text-white">&times;</button>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Loại Quy Tắc (Action)</label>
            <select [(ngModel)]="newRuleType" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-rose-500">
              <option value="DENY">⛔ DENY (Chặn truy cập Gateway)</option>
              <option value="ALLOW">✅ ALLOW (Cho phép ưu tiên)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Địa Chỉ IP / CIDR Subnet</label>
            <input [(ngModel)]="newCidr" placeholder="e.g. 192.168.1.0/24 hoặc 203.0.113.5" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono outline-none focus:border-rose-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Mô Tả / Lý Do</label>
            <input [(ngModel)]="newDesc" placeholder="e.g. Chặn botnet quét lỗ hổng" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-rose-500" />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button (click)="showCreateModal.set(false)" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all">
              {{ t('btn.cancel') }}
            </button>
            <button (click)="createRule()" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all">
              {{ t('btn.save') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Rules Table -->
      <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th class="py-3.5 px-6">Quy Tắc</th>
                <th class="py-3.5 px-6">IP / CIDR Subnet</th>
                <th class="py-3.5 px-6">Mô Tả</th>
                <th class="py-3.5 px-6 text-center">Số Lần Chặn</th>
                <th class="py-3.5 px-6">Trạng Thái</th>
                <th class="py-3.5 px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr *ngIf="rules().length === 0">
                <td colspan="6" class="text-center py-10 text-slate-400">{{ t('firewall.empty') }}</td>
              </tr>
              <tr *ngFor="let r of rules()" class="hover:bg-slate-900/40 transition-all">
                <td class="py-4 px-6">
                  <span [class]="r.ruleType === 'DENY' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'" class="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border">
                    {{ r.ruleType }}
                  </span>
                </td>
                <td class="py-4 px-6 font-mono font-bold text-white">{{ r.cidrIp }}</td>
                <td class="py-4 px-6 text-slate-300">{{ r.description || '(Không có)' }}</td>
                <td class="py-4 px-6 text-center font-mono font-bold text-rose-400">{{ r.blockedHits }} hits</td>
                <td class="py-4 px-6">
                  <span [class]="r.isActive ? 'text-emerald-400' : 'text-slate-500'" class="font-semibold text-xs">
                    {{ r.isActive ? 'Đang Hoạt Động' : 'Tắt' }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right space-x-2">
                  <button (click)="toggleRule(r.id)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all">
                    {{ r.isActive ? 'Tắt' : 'Bật' }}
                  </button>
                  <button (click)="deleteRule(r.id)" class="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all" title="Xóa">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class FirewallComponent implements OnInit {
  private firewallService = inject(FirewallService);
  private toastService = inject(ToastService);
  private translationService = inject(TranslationService);

  public rules = signal<IpFirewallRule[]>([]);
  public showCreateModal = signal(false);

  public newRuleType = 'DENY';
  public newCidr = '192.168.1.0/24';
  public newDesc = 'Chặn botnet spam';

  public t = (k: string) => this.translationService.t(k);

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(): void {
    this.firewallService.getAllRules().subscribe({
      next: (res) => this.rules.set(res.data)
    });
  }

  createRule(): void {
    if (!this.newCidr.trim()) {
      this.toastService.warning('Vui lòng nhập Địa chỉ IP / CIDR!');
      return;
    }

    this.firewallService.createRule({
      ruleType: this.newRuleType,
      cidrIp: this.newCidr.trim(),
      description: this.newDesc
    }).subscribe({
      next: () => {
        this.toastService.success('Đã thêm quy tắc tường lửa IP thành công!');
        this.showCreateModal.set(false);
        this.loadRules();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi tạo quy tắc')
    });
  }

  toggleRule(id: string): void {
    this.firewallService.toggleRule(id).subscribe({
      next: () => {
        this.toastService.success('Đã cập nhật trạng thái quy tắc');
        this.loadRules();
      }
    });
  }

  deleteRule(id: string): void {
    if (confirm('Xóa quy tắc tường lửa này?')) {
      this.firewallService.deleteRule(id).subscribe({
        next: () => {
          this.toastService.success('Đã xóa quy tắc tường lửa');
          this.loadRules();
        }
      });
    }
  }
}