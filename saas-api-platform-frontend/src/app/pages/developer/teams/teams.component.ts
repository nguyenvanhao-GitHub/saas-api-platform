import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../../core/services/team.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { Organization, TeamMember } from '../../../core/models';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">{{ t('teams.title') }}</h1>
          <p class="text-sm text-slate-400 mt-1">{{ t('teams.subtitle') }}</p>
        </div>

        <button (click)="showInviteModal.set(true)" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2">
          {{ t('teams.invite_btn') }}
        </button>
      </div>

      <!-- Organization Info Banner -->
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4" *ngIf="org()">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-brand-500/20">
            {{ org()?.name?.charAt(0) || 'O' }}
          </div>
          <div>
            <h3 class="text-base font-bold text-white">{{ org()?.name }}</h3>
            <p class="text-xs text-slate-400 font-mono">Workspace Slug: <span class="text-brand-400">{{ org()?.slug }}</span></p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs font-semibold">
            👥 {{ org()?.members?.length || 0 }} Thành Viên
          </span>
        </div>
      </div>

      <!-- Invite Modal -->
      <div *ngIf="showInviteModal()" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="glass-panel p-6 rounded-2xl border border-slate-700 max-w-md w-full space-y-4 shadow-2xl">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">{{ t('teams.invite_btn') }}</h3>
            <button (click)="showInviteModal.set(false)" class="text-slate-400 hover:text-white">&times;</button>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{{ t('teams.field_email') }}</label>
            <input [(ngModel)]="inviteEmail" placeholder="colleague@company.com" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-brand-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{{ t('teams.field_role') }}</label>
            <select [(ngModel)]="inviteRole" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-brand-500">
              <option value="ADMIN">Admin (Toàn quyền quản lý Key & Nhóm)</option>
              <option value="DEVELOPER">Developer (Tạo Key & Gọi Gateway)</option>
              <option value="VIEWER">Viewer (Chỉ xem Dashboard & Báo Cáo)</option>
            </select>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button (click)="showInviteModal.set(false)" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all">
              {{ t('btn.cancel') }}
            </button>
            <button (click)="sendInvite()" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all">
              {{ t('teams.btn_send_invite') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Members Table -->
      <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th class="py-3.5 px-6">{{ t('teams.th_member') }}</th>
                <th class="py-3.5 px-6">{{ t('teams.th_role') }}</th>
                <th class="py-3.5 px-6">{{ t('teams.th_status') }}</th>
                <th class="py-3.5 px-6">{{ t('teams.th_joined') }}</th>
                <th class="py-3.5 px-6 text-right">{{ t('teams.th_actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr *ngFor="let m of org()?.members" class="hover:bg-slate-900/40 transition-all">
                <td class="py-4 px-6 font-semibold text-white">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-xs font-mono">
                      {{ m.invitedEmail.charAt(0).toUpperCase() }}
                    </div>
                    <span>{{ m.invitedEmail }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <span [class]="m.role === 'OWNER' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : m.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-brand-500/10 text-brand-400 border-brand-500/20'" class="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border">
                    {{ m.role }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <span [class]="m.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'" class="px-2 py-0.5 rounded-full text-[10px] font-semibold border">
                    {{ m.status }}
                  </span>
                </td>
                <td class="py-4 px-6 text-slate-400 font-mono text-[11px]">{{ m.createdAt | date:'mediumDate' }}</td>
                <td class="py-4 px-6 text-right">
                  <button *ngIf="m.role !== 'OWNER'" (click)="removeMember(m.id)" class="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all" title="Xóa thành viên">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <span *ngIf="m.role === 'OWNER'" class="text-[11px] text-slate-500 font-medium">Chủ sở hữu</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class TeamsComponent implements OnInit {
  private teamService = inject(TeamService);
  private toastService = inject(ToastService);
  private translationService = inject(TranslationService);

  public org = signal<Organization | null>(null);
  public showInviteModal = signal(false);

  public inviteEmail = '';
  public inviteRole = 'DEVELOPER';

  public t = (k: string) => this.translationService.t(k);

  ngOnInit(): void {
    this.loadOrg();
  }

  loadOrg(): void {
    this.teamService.getMyOrganization().subscribe({
      next: (res) => this.org.set(res.data)
    });
  }

  sendInvite(): void {
    if (!this.inviteEmail.trim()) {
      this.toastService.warning('Vui lòng nhập Email thành viên!');
      return;
    }

    this.teamService.inviteMember({
      email: this.inviteEmail.trim(),
      role: this.inviteRole
    }).subscribe({
      next: () => {
        this.toastService.success('Đã gửi lời mời tham gia tổ chức thành công!');
        this.showInviteModal.set(false);
        this.inviteEmail = '';
        this.loadOrg();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi gửi lời mời')
    });
  }

  removeMember(memberId: string): void {
    if (confirm('Xóa thành viên này khỏi tổ chức?')) {
      this.teamService.removeMember(memberId).subscribe({
        next: () => {
          this.toastService.success('Đã xóa thành viên khỏi tổ chức');
          this.loadOrg();
        },
        error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi xóa')
      });
    }
  }
}