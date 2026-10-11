import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 text-xs text-slate-400 border-t border-slate-800/80">
      
      <!-- Info counter -->
      <div class="flex items-center gap-2">
        <span>{{ i18n.t('page.showing') }}</span>
        <span class="font-bold text-white font-mono">{{ startIndex + 1 }} - {{ endIndex }}</span>
        <span>{{ i18n.t('page.of') }}</span>
        <span class="font-bold text-brand-400 font-mono">{{ totalElements }}</span>
        <span>{{ i18n.t('page.records') }}</span>
      </div>

      <!-- Page Controls -->
      <div class="flex items-center gap-1.5">
        
        <!-- Previous Page Button -->
        <button 
          (click)="onPageChange(currentPage - 1)" 
          [disabled]="currentPage === 0"
          class="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
          [title]="i18n.t('page.prev')">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <!-- Dynamic Page Numbers -->
        @for (p of pages(); track p) {
          @if (p === -1) {
            <span class="px-2 py-1 text-slate-600">...</span>
          } @else {
            <button 
              (click)="onPageChange(p)"
              [class]="currentPage === p ? 'bg-brand-600 text-white font-bold shadow-lg shadow-brand-500/20 border-brand-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'"
              class="w-8 h-8 rounded-lg border font-mono text-xs flex items-center justify-center transition-all">
              {{ p + 1 }}
            </button>
          }
        }

        <!-- Next Page Button -->
        <button 
          (click)="onPageChange(currentPage + 1)" 
          [disabled]="currentPage >= totalPages - 1"
          class="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
          [title]="i18n.t('page.next')">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>

        <!-- Page Size Selector -->
        <select 
          [value]="pageSize" 
          (change)="onPageSizeChange($event)"
          class="ml-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 outline-none focus:border-brand-500">
          <option [value]="5">5 {{ i18n.t('page.per_page') }}</option>
          <option [value]="10">10 {{ i18n.t('page.per_page') }}</option>
          <option [value]="25">25 {{ i18n.t('page.per_page') }}</option>
          <option [value]="50">50 {{ i18n.t('page.per_page') }}</option>
        </select>

      </div>

    </div>
  `
})
export class PaginationComponent {
  public i18n = inject(TranslationService);
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 1;
  @Input() totalElements: number = 0;
  @Input() pageSize: number = 10;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get startIndex(): number {
    return this.currentPage * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.totalElements);
  }

  pages(): number[] {
    const total = this.totalPages;
    const cur = this.currentPage;
    const result: number[] = [];

    if (total <= 7) {
      for (let i = 0; i < total; i++) result.push(i);
      return result;
    }

    result.push(0);
    if (cur > 2) result.push(-1); // ellipsis

    const start = Math.max(1, cur - 1);
    const end = Math.min(total - 2, cur + 1);

    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    if (cur < total - 3) result.push(-1); // ellipsis
    result.push(total - 1);

    return result;
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(event: Event): void {
    const val = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(val);
  }
}
