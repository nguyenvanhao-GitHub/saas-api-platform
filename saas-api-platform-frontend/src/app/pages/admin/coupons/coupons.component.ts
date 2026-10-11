import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouponService } from '../../../core/services/coupon.service';
import { ToastService } from '../../../core/services/toast.service';
import { Coupon } from '../../../core/models';

@Component({
  selector: 'app-admin-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Quản Lý Mã Giảm Giá (Coupons)</h1>
          <p class="text-sm text-slate-400 mt-1">Cấu hình mã khuyến mãi, tỷ lệ chiết khấu và giới hạn lượt sử dụng</p>
        </div>

        <button (click)="showModal.set(true)" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all">
          + Tạo Mã Giảm Giá Mới
        </button>
      </div>

      <!-- Add Coupon Modal -->
      <div *ngIf="showModal()" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="glass-panel p-6 rounded-2xl border border-slate-700 max-w-lg w-full space-y-4 shadow-2xl">
          <h3 class="text-lg font-bold text-white">Tạo Mã Giảm Giá Mới</h3>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Mã Coupon</label>
              <input [(ngModel)]="newCode" placeholder="SUMMER50" class="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono uppercase outline-none focus:border-brand-500" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Loại Giảm</label>
              <select [(ngModel)]="newType" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-brand-500">
                <option value="PERCENTAGE">Phần trăm (%)</option>
                <option value="FIXED_AMOUNT">Số tiền cố định ($)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Giá Trị Giảm</label>
              <input type="number" [(ngModel)]="newValue" class="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-brand-500" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Số Lượt Tối Đa</label>
              <input type="number" [(ngModel)]="newMaxUses" class="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-brand-500" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button (click)="showModal.set(false)" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all">
              Hủy
            </button>
            <button (click)="createCoupon()" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all">
              Lưu Mã
            </button>
          </div>
        </div>
      </div>

      <!-- Coupons Table -->
      <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th class="py-3.5 px-6">Mã Coupon</th>
                <th class="py-3.5 px-6">Loại Giảm</th>
                <th class="py-3.5 px-6">Giá Trị</th>
                <th class="py-3.5 px-6">Lượt Dùng</th>
                <th class="py-3.5 px-6">Trạng Thái</th>
                <th class="py-3.5 px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr *ngFor="let c of coupons()" class="hover:bg-slate-900/40 transition-all">
                <td class="py-4 px-6 font-mono font-bold text-amber-400">{{ c.code }}</td>
                <td class="py-4 px-6 text-slate-300">{{ c.discountType }}</td>
                <td class="py-4 px-6 font-bold text-white">{{ c.discountValue }}{{ c.discountType === 'PERCENTAGE' ? '%' : ' USD' }}</td>
                <td class="py-4 px-6 text-slate-400">{{ c.timesUsed }} / {{ c.maxUses }}</td>
                <td class="py-4 px-6">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {{ c.status }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right">
                  <button (click)="deleteCoupon(c.id)" class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all" title="Xóa">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class AdminCouponsComponent implements OnInit {
  private couponService = inject(CouponService);
  private toastService = inject(ToastService);

  public coupons = signal<Coupon[]>([]);
  public showModal = signal(false);

  public newCode = '';
  public newType = 'PERCENTAGE';
  public newValue = 50;
  public newMaxUses = 500;

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.couponService.getAllCoupons().subscribe({
      next: (res) => this.coupons.set(res.data)
    });
  }

  createCoupon(): void {
    if (!this.newCode) {
      this.toastService.warning('Vui lòng nhập mã coupon!');
      return;
    }
    this.couponService.createCoupon({
      code: this.newCode.toUpperCase(),
      discountType: this.newType as any,
      discountValue: this.newValue,
      maxUses: this.newMaxUses
    }).subscribe({
      next: () => {
        this.toastService.success(`Đã tạo mã giảm giá ${this.newCode.toUpperCase()} thành công!`);
        this.showModal.set(false);
        this.newCode = '';
        this.loadCoupons();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi tạo mã giảm giá')
    });
  }

  deleteCoupon(id: string): void {
    if (confirm('Xóa mã giảm giá này?')) {
      this.couponService.deleteCoupon(id).subscribe({
        next: () => {
          this.toastService.success('Đã xóa mã giảm giá');
          this.loadCoupons();
        },
        error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi xóa mã')
      });
    }
  }
}
