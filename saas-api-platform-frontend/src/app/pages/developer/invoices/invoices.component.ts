import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../core/services/invoice.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { PaginationComponent } from '../../../core/components/pagination.component';
import { Invoice, VietQrResponse } from '../../../core/models';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  template: `
    <div class="space-y-8">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">{{ i18n.t('inv.title') }}</h1>
          <p class="text-sm text-slate-400 mt-1">{{ i18n.t('inv.subtitle') }}</p>
        </div>

        <div class="flex items-center gap-3">
          <button (click)="exportCsv()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-md transition-all flex items-center gap-2">
            {{ i18n.t('inv.export_csv') }}
          </button>
          <button (click)="generateInvoiceNow()" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2">
            {{ i18n.t('inv.auto_btn') }}
          </button>
        </div>
      </div>

      <!-- Invoices Table -->
      <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th class="py-3.5 px-6">{{ i18n.t('inv.th_number') }}</th>
                <th class="py-3.5 px-6">{{ i18n.t('inv.th_date') }}</th>
                <th class="py-3.5 px-6">{{ i18n.t('inv.th_amount') }}</th>
                <th class="py-3.5 px-6">{{ i18n.t('inv.th_status') }}</th>
                <th class="py-3.5 px-6 text-right">{{ i18n.t('inv.th_actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr *ngIf="paginatedInvoices().length === 0">
                <td colspan="5" class="text-center py-10 text-slate-400">{{ i18n.t('dashboard.no_invoices') }}</td>
              </tr>
              <tr *ngFor="let inv of paginatedInvoices()" class="hover:bg-slate-900/40 transition-all">
                <td class="py-4 px-6 font-mono font-bold text-white">{{ inv.invoiceNumber }}</td>
                <td class="py-4 px-6 text-slate-400">{{ inv.createdAt | date:'medium' }}</td>
                <td class="py-4 px-6 font-bold text-white text-sm">
                  {{ inv.amount | currency:'USD' }}
                  <span class="text-[10px] text-slate-400 block">≈ {{ (inv.amount * 25450) | number }} VNĐ</span>
                </td>
                <td class="py-4 px-6">
                  <span [class]="inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'" class="px-2.5 py-1 rounded-full font-semibold border">
                    {{ inv.status }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right space-x-2">
                  <ng-container *ngIf="inv.status === 'PENDING'">
                    <button (click)="openVietQrModal(inv.id)" class="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/20 transition-all inline-flex items-center gap-1">
                      {{ i18n.t('inv.pay_vietqr') }}
                    </button>
                    <button (click)="openCardModal(inv)" class="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/20 transition-all inline-flex items-center gap-1">
                      {{ i18n.t('inv.pay_card') }}
                    </button>
                  </ng-container>
                  <button (click)="downloadPdf(inv)" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 transition-all inline-flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    {{ i18n.t('inv.pdf_btn') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <app-pagination 
          [currentPage]="page()" 
          [pageSize]="pageSize()" 
          [totalElements]="invoices().length" 
          [totalPages]="totalPages()"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)" />
      </div>

      <!-- VietQR Bank Transfer Modal -->
      <div *ngIf="qrData()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-700 shadow-2xl relative space-y-6 animate-fade-in">
          
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-2">
              <span class="text-xl">🏦</span>
              <div>
                <h3 class="text-base font-bold text-white">{{ i18n.t('inv.vietqr_title') }}</h3>
                <p class="text-xs text-slate-400">{{ i18n.t('inv.vietqr_sub') }}</p>
              </div>
            </div>
            <button (click)="qrData.set(null)" class="text-slate-400 hover:text-white text-lg">✕</button>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-6">
            <!-- QR Image -->
            <div class="bg-white p-3 rounded-2xl shadow-xl shrink-0">
              <img [src]="qrData()?.qrImageUrl" alt="VietQR" class="w-48 h-48 object-contain rounded-xl" />
            </div>

            <!-- Transfer Info -->
            <div class="space-y-2.5 text-xs flex-1 w-full">
              <div>
                <span class="text-slate-400 block text-[11px]">{{ i18n.t('inv.bank_name') }}</span>
                <span class="font-semibold text-white">{{ qrData()?.bankName }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">{{ i18n.t('inv.bank_account') }}</span>
                <span class="font-mono font-bold text-emerald-400 text-sm select-all">{{ qrData()?.accountNumber }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">{{ i18n.t('inv.bank_holder') }}</span>
                <span class="font-semibold text-white uppercase">{{ qrData()?.accountHolderName }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">{{ i18n.t('inv.bank_amount') }}</span>
                <span class="font-bold text-amber-400 text-base">{{ qrData()?.amountVnd | number }} VNĐ</span>
                <span class="text-[10px] text-slate-400 block">({{ qrData()?.amountUsd | currency:'USD' }})</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">{{ i18n.t('inv.bank_memo') }}</span>
                <span class="font-mono font-bold text-brand-400 bg-slate-900 px-2 py-1 rounded select-all">{{ qrData()?.transferMemo }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-slate-800 flex gap-3">
            <button (click)="confirmPaymentManual()" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all">
              {{ i18n.t('inv.bank_confirmed_btn') }}
            </button>
            <button (click)="qrData.set(null)" class="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">
              {{ i18n.t('btn.close') }}
            </button>
          </div>

        </div>
      </div>

      <!-- Stripe / Credit Card Modal -->
      <div *ngIf="selectedCardInvoice()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-700 shadow-2xl relative space-y-6 animate-fade-in">
          
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-2">
              <span class="text-xl">💳</span>
              <div>
                <h3 class="text-base font-bold text-white">{{ i18n.t('inv.card_title') }}</h3>
                <p class="text-xs text-slate-400">{{ i18n.t('inv.card_sub') }}</p>
              </div>
            </div>
            <button (click)="selectedCardInvoice.set(null)" class="text-slate-400 hover:text-white text-lg">✕</button>
          </div>

          <!-- Live Card Preview -->
          <div class="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white space-y-4 shadow-xl">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-mono tracking-widest text-indigo-400 font-bold uppercase">Enterprise Card</span>
              <span class="text-sm font-bold tracking-wider italic text-indigo-300">VISA / MASTERCARD</span>
            </div>
            <div class="text-lg font-mono tracking-widest text-white py-1">
              {{ cardNumber || '•••• •••• •••• ••••' }}
            </div>
            <div class="flex justify-between items-center text-xs">
              <div>
                <span class="text-[9px] text-slate-400 block uppercase">{{ i18n.t('inv.card_holder') }}</span>
                <span class="font-semibold uppercase tracking-wider">{{ cardHolder || 'DEVELOPER' }}</span>
              </div>
              <div class="text-right">
                <span class="text-[9px] text-slate-400 block uppercase">{{ i18n.t('inv.card_expiry') }}</span>
                <span class="font-mono font-semibold">{{ cardExpiry || '12/28' }}</span>
              </div>
            </div>
          </div>

          <!-- Card Form Inputs -->
          <div class="space-y-3.5 text-xs">
            <div>
              <label class="block text-slate-300 font-semibold mb-1">{{ i18n.t('inv.card_number') }}</label>
              <input [(ngModel)]="cardNumber" placeholder="4242 4242 4242 4242" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none focus:border-brand-500" />
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">{{ i18n.t('inv.card_holder') }}</label>
              <input [(ngModel)]="cardHolder" placeholder="NGUYEN VAN A" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white uppercase outline-none focus:border-brand-500" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-300 font-semibold mb-1">{{ i18n.t('inv.card_expiry') }}</label>
                <input [(ngModel)]="cardExpiry" placeholder="12/28" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none focus:border-brand-500" />
              </div>
              <div>
                <label class="block text-slate-300 font-semibold mb-1">{{ i18n.t('inv.card_cvc') }}</label>
                <input type="password" [(ngModel)]="cardCvc" placeholder="123" maxlength="4" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none focus:border-brand-500" />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4 border-t border-slate-800 flex gap-3">
            <button (click)="payWithCardSubmit()" [disabled]="isPayingCard()" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2">
              <span *ngIf="isPayingCard()" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              {{ isPayingCard() ? i18n.t('inv.card_processing') : i18n.t('inv.card_pay_now') + ' (' + (selectedCardInvoice()?.amount | currency:'USD') + ')' }}
            </button>
            <button (click)="selectedCardInvoice.set(null)" class="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">
              {{ i18n.t('btn.cancel') }}
            </button>
          </div>

        </div>
      </div>

    </div>
  `
})
export class InvoicesComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private toastService = inject(ToastService);
  public i18n = inject(TranslationService);

  public invoices = signal<Invoice[]>([]);
  public qrData = signal<VietQrResponse | null>(null);
  public activeInvoiceId = signal<string | null>(null);

  public selectedCardInvoice = signal<Invoice | null>(null);
  public cardNumber = '4242 4242 4242 4242';
  public cardHolder = 'DEVELOPER';
  public cardExpiry = '12/28';
  public cardCvc = '123';
  public isPayingCard = signal(false);

  // Pagination
  public page = signal(0);
  public pageSize = signal(5);

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getMyInvoices().subscribe({
      next: (res) => this.invoices.set(res.data)
    });
  }

  paginatedInvoices(): Invoice[] {
    const start = this.page() * this.pageSize();
    return this.invoices().slice(start, start + this.pageSize());
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.invoices().length / this.pageSize()));
  }

  onPageChange(p: number): void {
    this.page.set(p);
  }

  onPageSizeChange(s: number): void {
    this.pageSize.set(s);
    this.page.set(0);
  }

  generateInvoiceNow(): void {
    this.invoiceService.generateInvoice().subscribe({
      next: () => {
        this.toastService.success('Tự động kết toán hóa đơn thành công!');
        this.loadInvoices();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi kết toán')
    });
  }

  downloadPdf(inv: Invoice): void {
    this.toastService.info('Đang tải tệp hóa đơn PDF...');
    this.invoiceService.downloadInvoicePdf(inv.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice-${inv.invoiceNumber || inv.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.toastService.success('Đã tải hóa đơn PDF thành công!');
      },
      error: (err) => {
        if (inv.s3PdfUrl) {
          window.open(inv.s3PdfUrl, '_blank');
        } else {
          this.toastService.error(err.error?.message || 'Lỗi khi tải file PDF');
        }
      }
    });
  }

  openVietQrModal(invoiceId: string): void {
    this.activeInvoiceId.set(invoiceId);
    this.invoiceService.getVietQr(invoiceId).subscribe({
      next: (res) => this.qrData.set(res.data),
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi tạo mã VietQR')
    });
  }

  confirmPaymentManual(): void {
    const id = this.activeInvoiceId();
    if (!id) return;

    this.invoiceService.payInvoice(id).subscribe({
      next: () => {
        this.toastService.success('Hệ thống đã nhận thanh toán và gạch nợ thành công!');
        this.qrData.set(null);
        this.loadInvoices();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi xác nhận thanh toán')
    });
  }

  openCardModal(invoice: Invoice): void {
    this.selectedCardInvoice.set(invoice);
  }

  payWithCardSubmit(): void {
    const inv = this.selectedCardInvoice();
    if (!inv) return;

    if (!this.cardNumber || !this.cardHolder || !this.cardExpiry || !this.cardCvc) {
      this.toastService.warning('Vui lòng điền đầy đủ thông tin thẻ tín dụng!');
      return;
    }

    this.isPayingCard.set(true);
    this.invoiceService.payWithCreditCard({
      invoiceId: inv.id,
      cardNumber: this.cardNumber,
      cardHolder: this.cardHolder,
      expiry: this.cardExpiry,
      cvc: this.cardCvc
    }).subscribe({
      next: () => {
        this.isPayingCard.set(false);
        this.toastService.success('Thanh toán thẻ quốc tế thành công! Hóa đơn đã được gạch nợ.');
        this.selectedCardInvoice.set(null);
        this.loadInvoices();
      },
      error: (err) => {
        this.isPayingCard.set(false);
        this.toastService.error(err.error?.message || 'Giao dịch thanh toán thẻ thất bại');
      }
    });
  }

  exportCsv(): void {
    this.toastService.info('Đang chuẩn bị file xuất CSV...');
    this.invoiceService.exportInvoicesCsv().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoices_export_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.toastService.success('Đã tải xuống danh sách hóa đơn CSV thành công!');
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Lỗi khi xuất file CSV');
      }
    });
  }
}
