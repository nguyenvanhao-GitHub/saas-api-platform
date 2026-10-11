import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SdkGeneratorService } from '../../../core/services/sdk-generator.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-sdk-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">{{ t('sdk.title') }}</h1>
          <p class="text-sm text-slate-400 mt-1">{{ t('sdk.subtitle') }}</p>
        </div>
        <button (click)="downloadCurrentSdk()" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          {{ t('sdk.download_zip') }} ({{ selectedLang().toUpperCase() }})
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button *ngFor="let lang of languages" (click)="selectLanguage(lang.id)" [ngClass]="selectedLang() === lang.id ? 'border-brand-500 bg-brand-500/10 text-brand-400' : 'border-slate-800 bg-slate-900/60 text-slate-300'" class="flex items-center gap-3 p-4 rounded-xl border transition-all text-left group hover:border-slate-700">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-slate-800 text-white group-hover:scale-105 transition-transform">
            {{ lang.badge }}
          </div>
          <div>
            <div class="text-sm font-semibold">{{ lang.name }}</div>
            <div class="text-[11px] text-slate-500">{{ lang.desc }}</div>
          </div>
        </button>
      </div>

      <div class="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div class="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/40">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            <span class="text-xs font-mono text-slate-400 ml-2">{{ currentFilename() }}</span>
          </div>
          <button (click)="copyCode()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-all">
            <svg *ngIf="!copied()" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            <svg *ngIf="copied()" class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            {{ copied() ? t('btn.copied') : t('btn.copy') }}
          </button>
        </div>
        <div class="p-5 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed bg-slate-950/70 max-h-[500px]">
          {{ currentCode() }}
        </div>
      </div>
    </div>
  `
})
export class SdkGeneratorComponent implements OnInit {
  private sdkService = inject(SdkGeneratorService);
  private trans = inject(TranslationService);

  languages = [
    { id: 'python', name: 'Python', badge: 'PY', desc: 'requests / urllib3' },
    { id: 'typescript', name: 'TypeScript / Node.js', badge: 'TS', desc: 'Fetch & Promise async' },
    { id: 'java', name: 'Java', badge: 'JV', desc: 'Java 11+ HttpClient' },
    { id: 'curl', name: 'cURL & Shell', badge: 'SH', desc: 'cURL command examples' }
  ];

  selectedLang = signal<string>('python');
  codeMap = signal<Record<string, string>>({});
  currentFilename = signal<string>('client.py');
  currentCode = signal<string>('// Loading SDK...');
  copied = signal<boolean>(false);

  t(key: string): string {
    return this.trans.t(key);
  }

  ngOnInit() {
    this.fetchCode(this.selectedLang());
  }

  selectLanguage(langId: string) {
    this.selectedLang.set(langId);
    this.fetchCode(langId);
  }

  fetchCode(lang: string) {
    this.sdkService.generateCode(lang).subscribe({
      next: (res) => {
        this.codeMap.set(res);
        const firstKey = Object.keys(res)[0] || 'client.code';
        this.currentFilename.set(firstKey);
        this.currentCode.set(res[firstKey] || '');
      }
    });
  }

  copyCode() {
    navigator.clipboard.writeText(this.currentCode());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  downloadCurrentSdk() {
    this.sdkService.downloadSdk(this.selectedLang());
  }
}