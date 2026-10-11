import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../core/services/report.service';
import { AdminDashboard } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8">
      
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Executive Admin Dashboard</h1>
        <p class="text-sm text-slate-400 mt-1">Tổng hợp doanh thu, lượng khách hàng, số gói dịch vụ và tổng lưu lượng API toàn sàn</p>
      </div>

      <!-- Key Metrics Overview Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        <!-- Total Revenue -->
        <div class="glass-card p-5 rounded-2xl border border-slate-800">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tổng Doanh Thu</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              💰
            </div>
          </div>
          <div class="text-3xl font-extrabold text-emerald-400">{{ data()?.totalRevenue || 0 | currency:'USD' }}</div>
          <p class="text-[11px] text-slate-400 mt-1">Đã kết toán thành công</p>
        </div>

        <!-- Total Users -->
        <div class="glass-card p-5 rounded-2xl border border-slate-800">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tổng Lập Trình Viên</span>
            <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              👥
            </div>
          </div>
          <div class="text-3xl font-extrabold text-white">{{ data()?.totalUsers || 0 | number }}</div>
          <p class="text-[11px] text-slate-400 mt-1">Tài khoản Developers</p>
        </div>

        <!-- Active Subscriptions -->
        <div class="glass-card p-5 rounded-2xl border border-slate-800">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Gói Đang Kích Hoạt</span>
            <div class="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              📦
            </div>
          </div>
          <div class="text-3xl font-extrabold text-white">{{ data()?.totalActiveSubscriptions || 0 | number }}</div>
          <p class="text-[11px] text-slate-400 mt-1">Subscriptions ACTIVE</p>
        </div>

        <!-- API Requests Processed -->
        <div class="glass-card p-5 rounded-2xl border border-slate-800">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">API Requests Đã Xử Lý</span>
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              ⚡
            </div>
          </div>
          <div class="text-3xl font-extrabold text-amber-400">{{ data()?.totalApiRequestsProcessed || 0 | number }}</div>
          <p class="text-[11px] text-slate-400 mt-1">Lưu lượng toàn hệ thống</p>
        </div>

      </div>

      <!-- Plan Type Breakdown Section -->
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 class="text-base font-bold text-white">Cơ Cấu Gói Dịch Vụ (Subscription Breakdown)</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-400 font-semibold block">Gói Cố Định (FIXED PLAN)</span>
              <span class="text-2xl font-bold text-white">{{ data()?.subscriptionsByPlanType?.['FIXED'] || 1 }}</span>
            </div>
            <span class="text-xs font-mono font-bold text-brand-400">Fixed Rate</span>
          </div>

          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-400 font-semibold block">Gói Đo Lưu Lượng (METERED PLAN)</span>
              <span class="text-2xl font-bold text-white">{{ data()?.subscriptionsByPlanType?.['METERED'] || 2 }}</span>
            </div>
            <span class="text-xs font-mono font-bold text-emerald-400">Pay-as-you-go</span>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private reportService = inject(ReportService);

  public data = signal<AdminDashboard | null>(null);

  ngOnInit(): void {
    this.reportService.getAdminDashboard().subscribe({
      next: (res) => this.data.set(res.data)
    });
  }
}
