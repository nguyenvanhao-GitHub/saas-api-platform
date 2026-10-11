import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastItem } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="pointer-events-auto relative overflow-hidden flex items-start gap-3.5 p-4 rounded-2xl shadow-2xl border backdrop-blur-2xl transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-top-4"
          [ngClass]="{
            'bg-slate-900/95 border-emerald-500/50 text-emerald-300 shadow-emerald-500/20': toast.type === 'success',
            'bg-slate-900/95 border-rose-500/50 text-rose-300 shadow-rose-500/20': toast.type === 'error',
            'bg-slate-900/95 border-sky-500/50 text-sky-300 shadow-sky-500/20': toast.type === 'info',
            'bg-slate-900/95 border-amber-500/50 text-amber-300 shadow-amber-500/20': toast.type === 'warning'
          }">
          
          <!-- Icon Glow Badge -->
          <div class="shrink-0 mt-0.5">
            @if (toast.type === 'success') {
              <div class="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
                <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              </div>
            } @else if (toast.type === 'error') {
              <div class="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-inner">
                <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
            } @else if (toast.type === 'warning') {
              <div class="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
                <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
            } @else {
              <div class="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center shadow-inner">
                <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            }
          </div>

          <!-- Message Body -->
          <div class="flex-1 min-w-0 pr-1">
            @if (toast.title) {
              <h4 class="text-xs font-bold uppercase tracking-wider mb-1 text-white flex items-center gap-1.5">
                {{ toast.title }}
              </h4>
            }
            <p class="text-xs text-slate-200 leading-relaxed break-words font-medium">{{ toast.message }}</p>
          </div>

          <!-- Close Action -->
          <button 
            (click)="dismiss(toast.id)" 
            aria-label="Dismiss toast"
            class="shrink-0 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <!-- Auto-dismiss Progress Bar -->
          <div 
            class="absolute bottom-0 left-0 h-1 opacity-70 animate-toast-bar"
            [style.animationDuration.ms]="toast.duration"
            [ngClass]="{
              'bg-emerald-400': toast.type === 'success',
              'bg-rose-400': toast.type === 'error',
              'bg-sky-400': toast.type === 'info',
              'bg-amber-400': toast.type === 'warning'
            }"></div>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  public toastService = inject(ToastService);

  dismiss(id: string): void {
    this.toastService.remove(id);
  }
}
