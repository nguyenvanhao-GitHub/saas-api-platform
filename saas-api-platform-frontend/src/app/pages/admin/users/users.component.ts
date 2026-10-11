import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { TranslationService } from '../../../core/services/translation.service';
import { PaginationComponent } from '../../../core/components/pagination.component';
import { User } from '../../../core/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  template: `
    <div class="space-y-8">
      
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">{{ i18n.t('admin.users_title') }}</h1>
        <p class="text-sm text-slate-400 mt-1">{{ i18n.t('admin.users_sub') }}</p>
      </div>

      <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th class="py-3.5 px-6">{{ i18n.t('admin.th_name') }}</th>
                <th class="py-3.5 px-6">{{ i18n.t('admin.th_email') }}</th>
                <th class="py-3.5 px-6">{{ i18n.t('admin.th_role') }}</th>
                <th class="py-3.5 px-6">{{ i18n.t('admin.th_apikey') }}</th>
                <th class="py-3.5 px-6">{{ i18n.t('admin.th_status') }}</th>
                <th class="py-3.5 px-6">{{ i18n.t('admin.th_created') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr *ngFor="let user of users()" class="hover:bg-slate-900/40 transition-all">
                <td class="py-4 px-6 font-semibold text-white">{{ user.fullName }}</td>
                <td class="py-4 px-6 text-slate-300 font-mono">{{ user.email }}</td>
                <td class="py-4 px-6">
                  <span [class]="user.role === 'ROLE_ADMIN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'" class="px-2.5 py-0.5 rounded-full font-semibold border text-[10px]">
                    {{ user.role }}
                  </span>
                </td>
                <td class="py-4 px-6 font-mono text-[11px] text-slate-400 select-all">{{ user.apiKey }}</td>
                <td class="py-4 px-6">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {{ user.status }}
                  </span>
                </td>
                <td class="py-4 px-6 text-slate-400">{{ user.createdAt | date:'short' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <app-pagination 
          [currentPage]="page()" 
          [pageSize]="pageSize()" 
          [totalElements]="totalElements()" 
          [totalPages]="totalPages()"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)" />
      </div>

    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  public i18n = inject(TranslationService);

  public users = signal<User[]>([]);
  public page = signal(0);
  public pageSize = signal(10);
  public totalElements = signal(0);
  public totalPages = signal(1);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers(this.page(), this.pageSize()).subscribe({
      next: (res) => {
        this.users.set(res.data.content);
        this.totalElements.set(res.data.totalElements);
        this.totalPages.set(res.data.totalPages);
      }
    });
  }

  onPageChange(p: number): void {
    this.page.set(p);
    this.loadUsers();
  }

  onPageSizeChange(s: number): void {
    this.pageSize.set(s);
    this.page.set(0);
    this.loadUsers();
  }
}
