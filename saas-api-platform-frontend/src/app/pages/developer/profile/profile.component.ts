import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { ApiKeyService } from '../../../core/services/api-key.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { User, ApiKeyItem } from '../../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8 max-w-5xl">
      
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">{{ i18n.t('profile.title') }}</h1>
        <p class="text-sm text-slate-400 mt-1">{{ i18n.t('profile.subtitle') }}</p>
      </div>

      <!-- Account Details & Password Form Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Account Overview Card -->
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 border border-brand-500/30 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-brand-500/20">
                {{ profile()?.fullName?.charAt(0) || 'U' }}
              </div>
              <div>
                <h3 class="font-bold text-base text-white">{{ profile()?.fullName }}</h3>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {{ profile()?.role || 'ROLE_DEVELOPER' }}
                </span>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-800/80 space-y-2.5 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-400">{{ i18n.t('profile.status') }}:</span>
                <span class="text-emerald-400 font-semibold">{{ i18n.t('profile.active_status') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">{{ i18n.t('profile.joined_date') }}:</span>
                <span class="text-slate-300 font-mono">{{ profile()?.createdAt | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-900 space-y-1">
            <span class="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">{{ i18n.t('profile.default_key') }}</span>
            <span class="text-xs font-mono text-brand-400 select-all block truncate">{{ profile()?.apiKey }}</span>
          </div>
        </div>

        <!-- Form Column -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Update Profile Card -->
          <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 class="text-base font-bold text-white">{{ i18n.t('profile.info_title') }}</h3>

            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{{ i18n.t('profile.registered_email') }}</label>
              <input [value]="profile()?.email" disabled class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono cursor-not-allowed" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{{ i18n.t('profile.full_name') }}</label>
              <input [(ngModel)]="fullName" placeholder="Nhập họ và tên..." class="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs outline-none focus:border-brand-500" />
            </div>

            <button (click)="updateProfile()" class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all">
              {{ i18n.t('btn.save') }}
            </button>
          </div>

          <!-- Change Password Card -->
          <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 class="text-base font-bold text-white">{{ i18n.t('profile.pass_title') }}</h3>

            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{{ i18n.t('profile.current_pass') }}</label>
              <input type="password" [(ngModel)]="currentPass" placeholder="••••••••" class="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs outline-none focus:border-brand-500" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{{ i18n.t('profile.new_pass') }}</label>
                <input type="password" [(ngModel)]="newPass" placeholder="••••••••" class="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs outline-none focus:border-brand-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{{ i18n.t('profile.confirm_pass') }}</label>
                <input type="password" [(ngModel)]="confirmPass" placeholder="••••••••" class="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs outline-none focus:border-brand-500" />
              </div>
            </div>

            <button (click)="changePassword()" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all">
              {{ i18n.t('profile.change_pass_btn') }}
            </button>
          </div>

        </div>

      </div>

      <!-- Advanced Multi-Key & IP Whitelist Management Section -->
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xl">🔑</span>
              <h3 class="text-base font-bold text-white">{{ i18n.t('keys.title') }}</h3>
            </div>
            <p class="text-xs text-slate-400 mt-1">{{ i18n.t('keys.subtitle') }}</p>
          </div>

          <button (click)="showCreateKeyModal.set(true)" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2">
            <span>+</span> {{ i18n.t('keys.create_btn') }}
          </button>
        </div>

        <!-- API Keys Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th class="py-3.5 px-4">{{ i18n.t('keys.th_name') }}</th>
                <th class="py-3.5 px-4">{{ i18n.t('keys.th_key') }}</th>
                <th class="py-3.5 px-4">{{ i18n.t('keys.th_whitelist') }}</th>
                <th class="py-3.5 px-4">{{ i18n.t('keys.th_rate') }}</th>
                <th class="py-3.5 px-4">{{ i18n.t('keys.th_status') }}</th>
                <th class="py-3.5 px-4 text-right">{{ i18n.t('keys.th_actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono">
              @for (k of apiKeys(); track k.id) {
                <tr class="hover:bg-slate-900/40 transition-all">
                  <td class="py-4 px-4 font-sans font-semibold text-white">
                    {{ k.keyName }}
                    <span *ngIf="k.scopes" class="block text-[10px] text-indigo-400 font-mono mt-0.5">{{ k.scopes }}</span>
                  </td>
                  <td class="py-4 px-4 text-slate-300 select-all">
                    {{ k.maskedKey }}
                    <button (click)="copyKey(k.apiKey)" [title]="i18n.t('btn.copy')" class="ml-2 text-slate-400 hover:text-brand-400 text-xs">📋</button>
                  </td>
                  <td class="py-4 px-4 font-sans text-slate-400 text-xs">
                    {{ k.ipWhitelist || 'Tất cả IPs (All)' }}
                  </td>
                  <td class="py-4 px-4 text-brand-400 font-bold">
                    {{ k.rateLimitPerMinute }} req/m
                  </td>
                  <td class="py-4 px-4">
                    <span [class]="k.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'" class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border">
                      {{ k.isActive ? i18n.t('keys.active') : i18n.t('keys.paused') }}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-right space-x-2 font-sans">
                    <button (click)="toggleKey(k.id)" class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">
                      {{ k.isActive ? i18n.t('keys.btn_pause') : i18n.t('keys.btn_activate') }}
                    </button>
                    <button (click)="deleteKey(k.id)" class="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold">
                      {{ i18n.t('keys.btn_delete') }}
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="text-center py-8 text-slate-400 font-sans">
                    {{ i18n.t('keys.no_keys') }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create API Key Modal -->
      <div *ngIf="showCreateKeyModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-700 shadow-2xl relative space-y-5 animate-fade-in">
          
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-base font-bold text-white">{{ i18n.t('keys.modal_title') }}</h3>
            <button (click)="showCreateKeyModal.set(false)" class="text-slate-400 hover:text-white text-lg">✕</button>
          </div>

          <div class="space-y-3.5 text-xs">
            <div>
              <label class="block text-slate-300 font-semibold mb-1">{{ i18n.t('keys.modal_name') }}</label>
              <input [(ngModel)]="newKeyName" placeholder="e.g. Production Staging Server" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-500" />
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">{{ i18n.t('keys.modal_scopes') }}</label>
              <input [(ngModel)]="newKeyScopes" placeholder="read:all,write:all hoặc tax:read,sms:send" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none focus:border-brand-500" />
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">{{ i18n.t('keys.modal_whitelist') }}</label>
              <input [(ngModel)]="newKeyIpWhitelist" placeholder="127.0.0.1, 14.161.22.45" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none focus:border-brand-500" />
              <span class="text-[10px] text-slate-500 mt-1 block">{{ i18n.t('keys.modal_whitelist_hint') }}</span>
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">{{ i18n.t('keys.modal_rate') }}</label>
              <input type="number" [(ngModel)]="newKeyRateLimit" placeholder="60" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none focus:border-brand-500" />
            </div>
          </div>

          <div class="pt-4 border-t border-slate-800 flex gap-3">
            <button (click)="createKeySubmit()" class="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all">
              {{ i18n.t('keys.modal_submit') }}
            </button>
            <button (click)="showCreateKeyModal.set(false)" class="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">
              {{ i18n.t('btn.cancel') }}
            </button>
          </div>

        </div>
      </div>

    </div>
  `
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private apiKeyService = inject(ApiKeyService);
  private toastService = inject(ToastService);
  public i18n = inject(TranslationService);

  public profile = signal<User | null>(null);
  public apiKeys = signal<ApiKeyItem[]>([]);
  public fullName = '';
  public currentPass = '';
  public newPass = '';
  public confirmPass = '';

  // Create Key Modal State
  public showCreateKeyModal = signal(false);
  public newKeyName = '';
  public newKeyScopes = 'read:all,write:all';
  public newKeyIpWhitelist = '';
  public newKeyRateLimit = 60;

  ngOnInit(): void {
    this.loadProfile();
    this.loadApiKeys();
  }

  loadProfile(): void {
    this.userService.getMyProfile().subscribe({
      next: (res) => {
        this.profile.set(res.data);
        this.fullName = res.data.fullName;
      }
    });
  }

  loadApiKeys(): void {
    this.apiKeyService.getMyApiKeys().subscribe({
      next: (res) => this.apiKeys.set(res.data)
    });
  }

  createKeySubmit(): void {
    if (!this.newKeyName.trim()) {
      this.toastService.warning('Vui lòng nhập tên nhận diện cho API Key!');
      return;
    }

    this.apiKeyService.createApiKey({
      keyName: this.newKeyName,
      scopes: this.newKeyScopes,
      ipWhitelist: this.newKeyIpWhitelist,
      rateLimitPerMinute: this.newKeyRateLimit
    }).subscribe({
      next: () => {
        this.toastService.success('Tạo API Key mới thành công!');
        this.showCreateKeyModal.set(false);
        this.newKeyName = '';
        this.loadApiKeys();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi tạo API Key')
    });
  }

  toggleKey(keyId: string): void {
    this.apiKeyService.toggleApiKey(keyId).subscribe({
      next: () => {
        this.toastService.success('Thay đổi trạng thái API Key thành công!');
        this.loadApiKeys();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi toggle')
    });
  }

  deleteKey(keyId: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa API Key này không? Hành động này không thể hoàn tác.')) {
      this.apiKeyService.deleteApiKey(keyId).subscribe({
        next: () => {
          this.toastService.success('Đã xóa API Key thành công!');
          this.loadApiKeys();
        },
        error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi xóa API Key')
      });
    }
  }

  copyKey(key: string): void {
    navigator.clipboard.writeText(key);
    this.toastService.success('Đã sao chép API Key vào clipboard!');
  }

  updateProfile(): void {
    if (!this.fullName.trim()) {
      this.toastService.warning('Họ và tên không được để trống!');
      return;
    }
    this.userService.updateProfile({ fullName: this.fullName }).subscribe({
      next: () => this.toastService.success('Cập nhật hồ sơ tài khoản thành công!'),
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi cập nhật hồ sơ')
    });
  }

  changePassword(): void {
    if (!this.currentPass || !this.newPass) {
      this.toastService.warning('Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới!');
      return;
    }
    if (this.newPass !== this.confirmPass) {
      this.toastService.error('Mật khẩu xác nhận không khớp với mật khẩu mới!');
      return;
    }
    if (this.newPass.length < 6) {
      this.toastService.warning('Mật khẩu mới phải có tối thiểu 6 ký tự!');
      return;
    }

    this.userService.changePassword({ currentPassword: this.currentPass, newPassword: this.newPass }).subscribe({
      next: () => {
        this.toastService.success('Đổi mật khẩu bảo mật thành công!');
        this.currentPass = '';
        this.newPass = '';
        this.confirmPass = '';
      },
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi đổi mật khẩu')
    });
  }
}
