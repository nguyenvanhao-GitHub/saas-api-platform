import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiCopilotService } from '../../../core/services/ai-copilot.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { AiCopilotMessage } from '../../../core/models';

@Component({
  selector: 'app-ai-copilot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>🤖 {{ t('copilot.title') }}</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              NLP Copilot
            </span>
          </h1>
          <p class="text-sm text-slate-400 mt-1">{{ t('copilot.subtitle') }}</p>
        </div>

        <div class="flex items-center gap-2">
          <select [(ngModel)]="selectedLanguage" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-brand-400 outline-none">
            <option value="JAVASCRIPT">Node.js / JS</option>
            <option value="PYTHON">Python 3</option>
            <option value="JAVA">Java 17 (Spring)</option>
            <option value="GO">Go (Golang)</option>
            <option value="CURL">cURL CLI</option>
          </select>
        </div>
      </div>

      <!-- Chat History Stream -->
      <div class="flex-1 overflow-y-auto space-y-4 pr-2">
        <!-- Quick Starter Chips -->
        <div *ngIf="messages().length === 0" class="glass-panel p-8 text-center rounded-2xl border border-slate-800 space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center text-xl mx-auto">
            💡
          </div>
          <h3 class="text-base font-bold text-white">{{ t('copilot.starters_title') }}</h3>
          <p class="text-xs text-slate-400 max-w-md mx-auto">{{ t('copilot.starters_sub') }}</p>

          <div class="flex flex-wrap justify-center gap-2 pt-2">
            <button (click)="askPrompt('Viết code Python gọi API Tra cứu Mã số thuế')" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800 transition-all">
              🏢 Gọi API Tra cứu Mã số thuế (Python)
            </button>
            <button (click)="askPrompt('Cách xử lý lỗi HTTP 429 Too Many Requests và Exponential Backoff?')" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800 transition-all">
              ⏱ Xử lý lỗi Rate Limit 429 & Retry
            </button>
            <button (click)="askPrompt('Hướng dẫn xác thực chữ ký HMAC-SHA256 trong Webhook?')" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800 transition-all">
              🔒 Xác thực HMAC-SHA256 Webhook
            </button>
          </div>
        </div>

        <div *ngFor="let msg of messages()" class="space-y-2">
          <!-- User Question -->
          <div class="flex justify-end">
            <div class="max-w-2xl p-4 rounded-2xl bg-brand-600/20 border border-brand-500/30 text-xs text-slate-200 font-medium leading-relaxed">
              {{ msg.prompt }}
            </div>
          </div>

          <!-- AI Response -->
          <div class="flex justify-start">
            <div class="max-w-3xl glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div class="flex items-center gap-2 text-xs font-bold text-purple-400">
                <span>🤖 SaaS AI Copilot</span>
                <span class="text-[10px] text-slate-500 font-normal">{{ msg.createdAt | date:'HH:mm:ss' }}</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">{{ msg.reply }}</p>

              <div *ngIf="msg.codeSnippet" class="relative">
                <pre class="p-4 rounded-xl bg-black/80 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">{{ msg.codeSnippet }}</pre>
                <button (click)="copySnippet(msg.codeSnippet)" class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-all">
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Thinking Loader -->
        <div *ngIf="isThinking()" class="flex justify-start">
          <div class="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3 text-xs text-purple-400">
            <span class="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
            <span>AI Copilot đang phân tích tài liệu và sinh code mẫu...</span>
          </div>
        </div>
      </div>

      <!-- Input Bar -->
      <div class="p-2 rounded-2xl glass-panel border border-slate-800 flex items-center gap-3">
        <input [(ngModel)]="currentPrompt" (keyup.enter)="sendPrompt()" placeholder="Hỏi AI Copilot về tài liệu API, sinh code mẫu, debug mã lỗi..." class="flex-1 px-4 py-2.5 rounded-xl bg-transparent text-white text-xs outline-none placeholder:text-slate-500" />
        <button (click)="sendPrompt()" [disabled]="isThinking() || !currentPrompt.trim()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 transition-all flex items-center gap-1.5">
          <span>Gửi</span>
          <span>→</span>
        </button>
      </div>
    </div>
  `
})
export class AiCopilotComponent implements OnInit {
  private copilotService = inject(AiCopilotService);
  private toastService = inject(ToastService);
  private translationService = inject(TranslationService);

  public messages = signal<AiCopilotMessage[]>([]);
  public isThinking = signal(false);
  public currentPrompt = '';
  public selectedLanguage = 'JAVASCRIPT';

  public t = (k: string) => this.translationService.t(k);

  ngOnInit(): void {
    this.copilotService.getHistory().subscribe({
      next: (res) => this.messages.set(res.data.reverse())
    });
  }

  askPrompt(text: string): void {
    this.currentPrompt = text;
    this.sendPrompt();
  }

  sendPrompt(): void {
    if (!this.currentPrompt.trim() || this.isThinking()) return;

    const p = this.currentPrompt.trim();
    this.currentPrompt = '';
    this.isThinking.set(true);

    this.copilotService.askCopilot(p, this.selectedLanguage).subscribe({
      next: (res) => {
        this.isThinking.set(false);
        this.messages.update(list => [...list, res.data]);
      },
      error: (err) => {
        this.isThinking.set(false);
        this.toastService.error(err.error?.message || 'Lỗi khi gửi câu hỏi tới AI Copilot');
      }
    });
  }

  copySnippet(code: string): void {
    navigator.clipboard.writeText(code);
    this.toastService.success('Đã sao chép mã nguồn vào clipboard!');
  }
}