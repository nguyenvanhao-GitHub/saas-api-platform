import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <!-- Top Right Language Switcher -->
      <div class="absolute top-6 right-6 z-20">
        <button (click)="i18n.toggleLanguage()" class="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-800 flex items-center gap-2 shadow-lg backdrop-blur-md transition-all">
          <span>{{ i18n.currentLang() === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English' }}</span>
          <span class="text-[10px] text-brand-400 font-mono uppercase bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
            {{ i18n.currentLang() === 'vi' ? 'VI' : 'EN' }}
          </span>
        </button>
      </div>

      <!-- Background Ambient Glow -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-xl shadow-brand-500/30 mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 class="text-3xl font-extrabold tracking-tight text-white">{{ i18n.t('app.title') }}</h2>
        <p class="mt-2 text-sm text-slate-400">{{ i18n.t('app.subtitle') }}</p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div class="glass-panel py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-800">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class AuthLayoutComponent {
  public i18n = inject(TranslationService);
}
