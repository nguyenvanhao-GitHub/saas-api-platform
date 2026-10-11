import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { CouponService } from '../../../core/services/coupon.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { Coupon, Product, Subscription } from '../../../core/models';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8">
      
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">{{ i18n.t('market.title') }}</h1>
        <p class="text-sm text-slate-400 mt-1">{{ i18n.t('market.subtitle') }}</p>
      </div>

      <!-- Promo Code Banner -->
      <div class="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold shrink-0">
            🎟️
          </div>
          <div>
            <h4 class="text-sm font-bold text-white">{{ i18n.t('market.coupon_title') }}</h4>
            <p class="text-xs text-slate-400">{{ i18n.t('market.coupon_hint') }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <input [(ngModel)]="couponCode" placeholder="Promo code..." class="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs font-mono uppercase outline-none focus:border-brand-500 w-full sm:w-48" />
          <button (click)="applyCoupon()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shrink-0 transition-all">
            {{ i18n.t('market.apply') }}
          </button>
        </div>
      </div>

      <div *ngIf="appliedCoupon()" class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center justify-between">
        <span>✅ Applied Coupon <strong>{{ appliedCoupon()?.code }}</strong>: -{{ appliedCoupon()?.discountValue }}%!</span>
        <button (click)="appliedCoupon.set(null)" class="text-xs text-slate-400 hover:text-white underline">{{ i18n.t('btn.cancel') }}</button>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div *ngFor="let product of products()" class="glass-panel p-6 rounded-2xl border flex flex-col justify-between relative transition-all"
             [class.border-brand-500]="product.code === 'PRO_METERED'"
             [class.border-slate-800]="product.code !== 'PRO_METERED'">
          
          <div *ngIf="product.code === 'PRO_METERED'" class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-500 text-[10px] font-bold text-white uppercase tracking-wider shadow-md">
            {{ i18n.t('market.popular') }}
          </div>

          <div class="space-y-4">
            <div>
              <span class="text-xs font-mono font-semibold text-brand-400 block uppercase tracking-wider">{{ product.planType }}</span>
              <h3 class="text-xl font-bold text-white mt-1">{{ product.name }}</h3>
              <p class="text-xs text-slate-400 mt-1 min-h-[36px]">{{ product.description }}</p>
            </div>

            <!-- Price Display -->
            <div class="pt-4 border-t border-slate-800">
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-extrabold text-white">
                  {{ calculateFinalPrice(product.basePrice) | currency:'USD' }}
                </span>
                <span class="text-xs text-slate-400">/ mo</span>
              </div>
              <span *ngIf="appliedCoupon()" class="text-xs text-slate-400 line-through">
                Original: {{ product.basePrice | currency:'USD' }}
              </span>
            </div>

            <!-- Features List -->
            <ul class="space-y-2.5 text-xs text-slate-300 pt-2">
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                <span>Limit: <strong>{{ product.rateLimitPerMinute }} req/min</strong></span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                <span>Redis Rate Limiting</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                <span>Auto AWS S3 PDF Invoices</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                <span>HMAC-SHA256 Signed Webhooks</span>
              </li>
            </ul>
          </div>

          <div class="pt-6">
            <button *ngIf="!isSubscribed(product.id)" (click)="subscribeProduct(product)" class="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-lg shadow-brand-500/20">
              {{ i18n.t('market.subscribe') }}
            </button>
            <button *ngIf="isSubscribed(product.id)" disabled class="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 text-emerald-400 font-semibold text-xs border border-emerald-500/30 cursor-not-allowed">
              {{ i18n.t('market.active_now') }}
            </button>
          </div>

        </div>

      </div>

    </div>
  `
})
export class MarketplaceComponent implements OnInit {
  private productService = inject(ProductService);
  private subscriptionService = inject(SubscriptionService);
  private couponService = inject(CouponService);
  private toastService = inject(ToastService);
  public i18n = inject(TranslationService);

  public products = signal<Product[]>([]);
  public mySubscriptions = signal<Subscription[]>([]);
  public couponCode = 'WELCOME50';
  public appliedCoupon = signal<Coupon | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => this.products.set(res.data)
    });
    this.subscriptionService.getMySubscriptions().subscribe({
      next: (res) => this.mySubscriptions.set(res.data)
    });
  }

  isSubscribed(productId: string): boolean {
    return this.mySubscriptions().some(s => s.product.id === productId && s.status === 'ACTIVE');
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      this.toastService.warning('Vui lòng nhập mã giảm giá!');
      return;
    }
    this.couponService.validateCoupon(this.couponCode.trim(), 100).subscribe({
      next: (res) => {
        this.appliedCoupon.set(res.data);
        this.toastService.success(`Áp dụng mã ${res.data.code} thành công! Giảm ${res.data.discountType === 'PERCENTAGE' ? res.data.discountValue + '%' : '$' + res.data.discountValue}`);
      },
      error: (err) => this.toastService.error(err.error?.message || 'Mã giảm giá không hợp lệ!')
    });
  }

  calculateFinalPrice(basePrice: number): number {
    const coupon = this.appliedCoupon();
    if (!coupon) return basePrice;
    if (coupon.discountType === 'PERCENTAGE') {
      return basePrice * (1 - coupon.discountValue / 100);
    }
    return Math.max(0, basePrice - coupon.discountValue);
  }

  subscribeProduct(product: Product): void {
    if (confirm(`Xác nhận đăng ký gói ${product.name}?`)) {
      this.subscriptionService.subscribe(product.id).subscribe({
        next: () => {
          this.toastService.success(`Đăng ký gói ${product.name} thành công!`);
          this.loadData();
        },
        error: (err) => this.toastService.error(err.error?.message || 'Đăng ký thất bại')
      });
    }
  }
}
