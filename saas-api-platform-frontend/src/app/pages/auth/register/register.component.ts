import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
      <div>
        <h3 class="text-xl font-bold text-white mb-1">{{ i18n.t('auth.register_title') }}</h3>
        <p class="text-xs text-slate-400">{{ i18n.t('auth.register_sub') }}</p>
      </div>

      <div *ngIf="errorMessage()" class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
        {{ errorMessage() }}
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{{ i18n.t('auth.full_name') }}</label>
        <input type="text" formControlName="fullName" placeholder="Nguyễn Văn A" class="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white placeholder-slate-500 text-sm outline-none transition-all" />
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email</label>
        <input type="email" formControlName="email" placeholder="you@company.com" class="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white placeholder-slate-500 text-sm outline-none transition-all" />
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{{ i18n.t('auth.password') }}</label>
        <input type="password" formControlName="password" placeholder="••••••••" class="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white placeholder-slate-500 text-sm outline-none transition-all" />
      </div>

      <button type="submit" [disabled]="registerForm.invalid || isLoading()" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        <span *ngIf="isLoading()" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
        {{ isLoading() ? '...' : i18n.t('auth.btn_register') }}
      </button>

      <!-- Social Login Divider -->
      <div class="relative flex py-1 items-center">
        <div class="flex-grow border-t border-slate-800"></div>
        <span class="flex-shrink mx-3 text-[11px] text-slate-500 font-medium uppercase tracking-wider">{{ i18n.t('auth.or_register_with') }}</span>
        <div class="flex-grow border-t border-slate-800"></div>
      </div>

      <!-- Social Login Buttons -->
      <div class="grid grid-cols-2 gap-3">
        <button 
          type="button" 
          (click)="loginWithSocial('GOOGLE')"
          [disabled]="isLoading()"
          class="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Google
        </button>

        <button 
          type="button" 
          (click)="loginWithSocial('GITHUB')"
          [disabled]="isLoading()"
          class="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-2">
          <svg class="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          GitHub
        </button>
      </div>

      <p class="text-center text-xs text-slate-400">
        {{ i18n.t('auth.have_account') }} <a routerLink="/login" class="text-brand-400 font-semibold hover:underline">{{ i18n.t('auth.login_link') }}</a>
      </p>
    </form>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  public i18n = inject(TranslationService);
  private router = inject(Router);

  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);

  public registerForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loginWithSocial(provider: 'GOOGLE' | 'GITHUB'): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.toastService.info(`Đang kết nối đăng ký nhanh với ${provider}...`);

    const mockEmail = provider === 'GOOGLE' ? 'developer.google@saas-platform.com' : 'developer.github@saas-platform.com';
    const mockName = provider === 'GOOGLE' ? 'Google Developer User' : 'GitHub Developer User';

    this.authService.socialLogin({
      provider,
      email: mockEmail,
      fullName: mockName
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success(`Đăng ký tài khoản thành công với ${provider}!`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || `Lỗi khi liên kết ${provider}`);
        this.toastService.error(err.error?.message || `Lỗi khi liên kết ${provider}`);
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { fullName, email, password } = this.registerForm.value;
    this.authService.register({ fullName: fullName!, email: email!, password: password! }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success('Đăng ký tài khoản thành công! Vui lòng kiểm tra email chào mừng.');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Đăng ký thất bại. Vui lòng thử lại!');
        this.toastService.error(err.error?.message || 'Đăng ký thất bại.');
      }
    });
  }
}
