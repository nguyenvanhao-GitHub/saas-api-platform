import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Quản Lý Gói Dịch Vụ API Catalog</h1>
          <p class="text-sm text-slate-400 mt-1">Cấu hình danh mục gói, hạn mức Rate Limit và giá cước (Redis Caching)</p>
        </div>

        <button (click)="showModal.set(true)" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all">
          + Thêm Gói API Mới
        </button>
      </div>

      <!-- Add Product Modal -->
      <div *ngIf="showModal()" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="glass-panel p-6 rounded-2xl border border-slate-700 max-w-lg w-full space-y-4 shadow-2xl">
          <h3 class="text-lg font-bold text-white">Thêm Gói Dịch Vụ Mới</h3>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Mã Gói</label>
              <input [(ngModel)]="newCode" placeholder="ULTRA_SCALE" class="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono uppercase outline-none focus:border-brand-500" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tên Gói</label>
              <input [(ngModel)]="newName" placeholder="Ultra Scale Pro" class="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-brand-500" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Mô Tả</label>
            <input [(ngModel)]="newDesc" placeholder="Mô tả gói cước..." class="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-brand-500" />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Giá Cơ Sở ($)</label>
              <input type="number" [(ngModel)]="newPrice" class="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-brand-500" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Loại Gói</label>
              <select [(ngModel)]="newType" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-brand-500">
                <option value="FIXED">FIXED</option>
                <option value="METERED">METERED</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Rate Limit</label>
              <input type="number" [(ngModel)]="newRate" class="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-brand-500" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button (click)="showModal.set(false)" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all">
              Hủy
            </button>
            <button (click)="createProduct()" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all">
              Lưu Gói API
            </button>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th class="py-3.5 px-6">Mã Gói</th>
                <th class="py-3.5 px-6">Tên Gói</th>
                <th class="py-3.5 px-6">Giá Cơ Sở</th>
                <th class="py-3.5 px-6">Loại Gói</th>
                <th class="py-3.5 px-6">Hạn Mức</th>
                <th class="py-3.5 px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr *ngFor="let p of products()" class="hover:bg-slate-900/40 transition-all">
                <td class="py-4 px-6 font-mono font-bold text-brand-400">{{ p.code }}</td>
                <td class="py-4 px-6 font-semibold text-white">{{ p.name }}</td>
                <td class="py-4 px-6 font-bold text-white">{{ p.basePrice | currency:'USD' }}</td>
                <td class="py-4 px-6">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {{ p.planType }}
                  </span>
                </td>
                <td class="py-4 px-6 text-slate-300">{{ p.rateLimitPerMinute }} req/phút</td>
                <td class="py-4 px-6 text-right">
                  <button (click)="deleteProduct(p.id)" class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all" title="Xóa">
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
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);

  public products = signal<Product[]>([]);
  public showModal = signal(false);

  public newCode = '';
  public newName = '';
  public newDesc = '';
  public newPrice = 29;
  public newType = 'FIXED';
  public newRate = 120;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => this.products.set(res.data)
    });
  }

  createProduct(): void {
    if (!this.newCode || !this.newName) return;
    this.productService.createProduct({
      code: this.newCode.toUpperCase(),
      name: this.newName,
      description: this.newDesc,
      basePrice: this.newPrice,
      planType: this.newType as any,
      rateLimitPerMinute: this.newRate
    }).subscribe({
      next: () => {
        this.showModal.set(false);
        this.loadProducts();
      },
      error: (err) => alert(err.error?.message || 'Lỗi khi tạo gói API')
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Xóa mềm gói API này?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts()
      });
    }
  }
}
