import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../../core/services/audit.service';
import { TranslationService } from '../../../core/services/translation.service';
import { AuditLog } from '../../../core/models';
import { PaginationComponent } from '../../../core/components/pagination.component';

@Component({
  selector: 'app-admin-audit-logs',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  template: `
    <div class="space-y-8">
      
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">{{ i18n.t('admin.audit_title') }}</h1>
        <p class="text-sm text-slate-400 mt-1">{{ i18n.t('admin.audit_sub') }}</p>
      </div>

      <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th class="py-3.5 px-6">{{ i18n.t('admin.th_time') }}</th>
                <th class="py-3.5 px-6">{{ i18n.t('admin.th_account') }}</th>
                <th class="py-3.5 px-6">{{ i18n.t('admin.th_action') }}</th>
                <th class="py-3.5 px-6">{{ i18n.t('admin.th_target') }}</th>
                <th class="py-3.5 px-6">{{ i18n.t('admin.th_ip') }}</th>
                <th class="py-3.5 px-6">{{ i18n.t('admin.th_detail') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono">
              <tr *ngIf="logs().length === 0">
                <td colspan="6" class="text-center py-10 text-slate-400 font-sans">{{ i18n.t('admin.no_logs') }}</td>
              </tr>
              <tr *ngFor="let log of logs()" class="hover:bg-slate-900/40 transition-all">
                <td class="py-4 px-6 text-slate-400 font-sans">{{ log.createdAt | date:'medium' }}</td>
                <td class="py-4 px-6 text-white font-semibold">{{ log.userEmail }}</td>
                <td class="py-4 px-6">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {{ log.action }}
                  </span>
                </td>
                <td class="py-4 px-6 text-slate-300">{{ log.resourceType }}</td>
                <td class="py-4 px-6 text-slate-400">{{ log.clientIp || '127.0.0.1' }}</td>
                <td class="py-4 px-6 text-slate-300 font-sans text-xs max-w-xs truncate">{{ log.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <app-pagination
          [currentPage]="currentPage()"
          [totalPages]="totalPages()"
          [pageSize]="pageSize()"
          [totalElements]="totalElements()"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onSizeChange($event)"
        />
      </div>

    </div>
  `
})
export class AdminAuditLogsComponent implements OnInit {
  private auditService = inject(AuditService);
  public i18n = inject(TranslationService);

  public logs = signal<AuditLog[]>([]);
  public currentPage = signal(0);
  public pageSize = signal(10);
  public totalPages = signal(0);
  public totalElements = signal(0);

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.auditService.getAllAuditLogs(this.currentPage(), this.pageSize()).subscribe({
      next: (res) => {
        this.logs.set(res.data.content);
        this.totalPages.set(res.data.totalPages);
        this.totalElements.set(res.data.totalElements);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadLogs();
  }

  onSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
    this.loadLogs();
  }
}
