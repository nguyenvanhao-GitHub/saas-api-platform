import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockApiService } from '../../../core/services/mock-api.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { MockEndpoint } from '../../../core/models';

@Component({
  selector: 'app-mock-apis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">{{ t('mock.title') }}</h1>
          <p class="text-sm text-slate-400 mt-1">{{ t('mock.subtitle') }}</p>
        </div>

        <button (click)="showCreateModal.set(true)" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2">
          {{ t('mock.create_btn') }}
        </button>
      </div>

      <!-- Create Modal -->
      <div *ngIf="showCreateModal()" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="glass-panel p-6 rounded-2xl border border-slate-700 max-w-2xl w-full space-y-4 shadow-2xl">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">{{ t('mock.create_btn') }}</h3>
            <button (click)="showCreateModal.set(false)" class="text-slate-400 hover:text-white">&times;</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">{{ t('mock.field_name') }}</label>
              <input [(ngModel)]="newName" placeholder="e.g. Danh Sách Đơn Hàng Demo" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-brand-500" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">HTTP Method</label>
              <select [(ngModel)]="newMethod" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-brand-500">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">{{ t('mock.field_path') }}</label>
              <input [(ngModel)]="newPath" placeholder="/orders/recent hoặc /products/v2" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono outline-none focus:border-brand-500" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">HTTP Status</label>
              <select [(ngModel)]="newStatus" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-brand-500">
                <option [ngValue]="200">200 OK</option>
                <option [ngValue]="201">201 Created</option>
                <option [ngValue]="400">400 Bad Request</option>
                <option [ngValue]="404">404 Not Found</option>
                <option [ngValue]="500">500 Server Error</option>
              </select>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider">JSON Response Body</label>
              <span ngNonBindable class="text-[10px] text-brand-400 font-mono">Dynamic Tags: &#123;&#123;timestamp&#125;&#125;, &#123;&#123;uuid&#125;&#125;, &#123;&#123;randomNumber&#125;&#125;, &#123;&#123;date&#125;&#125;</span>
            </div>
            <textarea [(ngModel)]="newBody" rows="6" class="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs outline-none focus:border-brand-500 whitespace-pre"></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button (click)="showCreateModal.set(false)" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all">
              {{ t('btn.cancel') }}
            </button>
            <button (click)="createMock()" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all">
              {{ t('btn.save') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Test Modal -->
      <div *ngIf="testResult()" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="glass-panel p-6 rounded-2xl border border-slate-700 max-w-xl w-full space-y-4 shadow-2xl">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <span>⚡ Gateway Mock Execution Output</span>
            </h3>
            <button (click)="testResult.set(null)" class="text-slate-400 hover:text-white">&times;</button>
          </div>
          <pre class="p-4 rounded-xl bg-black/70 border border-slate-800 font-mono text-xs text-emerald-400 max-h-80 overflow-y-auto whitespace-pre-wrap">{{ testResult() }}</pre>
          <div class="flex justify-end">
            <button (click)="testResult.set(null)" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all">
              {{ t('btn.close') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mock List -->
      <div class="space-y-4">
        <div *ngIf="mocks().length === 0" class="glass-panel p-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-xs">
          {{ t('mock.empty') }}
        </div>

        <div *ngFor="let m of mocks()" class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1.5">
              <div class="flex items-center gap-3">
                <span [class]="m.httpMethod === 'GET' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : m.httpMethod === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : m.httpMethod === 'DELETE' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'" class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border">
                  {{ m.httpMethod }}
                </span>
                <span class="font-mono text-sm font-bold text-white">/api/v1/mock{{ m.path }}</span>
                <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                  HTTP {{ m.responseStatus }}
                </span>
              </div>
              <p class="text-xs text-slate-300 font-semibold">{{ m.name }}</p>
              <p class="text-[11px] text-slate-400 font-mono">Đã gọi: <strong class="text-emerald-400">{{ m.callCount }} lần</strong></p>
            </div>

            <div class="flex items-center gap-2">
              <button (click)="testCall(m)" class="px-3.5 py-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-xs font-semibold border border-brand-500/20 transition-all flex items-center gap-1.5">
                ⚡ Test Mock
              </button>
              <button (click)="toggleMock(m.id)" [class]="m.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'" class="px-3 py-2 rounded-xl text-xs font-semibold border transition-all">
                {{ m.isActive ? 'Đang Bật' : 'Tạm Dừng' }}
              </button>
              <button (click)="deleteMock(m.id)" class="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-all" title="Xóa">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MockApisComponent implements OnInit {
  private mockService = inject(MockApiService);
  private toastService = inject(ToastService);
  private translationService = inject(TranslationService);

  public mocks = signal<MockEndpoint[]>([]);
  public showCreateModal = signal(false);
  public testResult = signal<string | null>(null);

  public newName = 'Danh Sách Đơn Hàng Demo';
  public newPath = '/orders/recent';
  public newMethod = 'GET';
  public newStatus = 200;
  public newBody = JSON.stringify({
    status: 'SUCCESS',
    orderId: 'ORD-{{randomNumber}}',
    transactionId: '{{uuid}}',
    createdAt: '{{timestamp}}',
    items: [
      { id: 'ITM-1', name: 'Cloud Server Pro', price: 99.0 },
      { id: 'ITM-2', name: 'API Quota Booster 100k', price: 29.0 }
    ]
  }, null, 2);

  public t = (k: string) => this.translationService.t(k);

  ngOnInit(): void {
    this.loadMocks();
  }

  loadMocks(): void {
    this.mockService.getMyMocks().subscribe({
      next: (res) => this.mocks.set(res.data)
    });
  }

  createMock(): void {
    if (!this.newName.trim() || !this.newPath.trim()) {
      this.toastService.warning('Vui lòng nhập Tên và Đường dẫn Mock API!');
      return;
    }

    this.mockService.createMock({
      name: this.newName,
      path: this.newPath,
      httpMethod: this.newMethod,
      responseStatus: this.newStatus,
      responseBody: this.newBody
    }).subscribe({
      next: () => {
        this.toastService.success('Đã tạo Mock API thành công!');
        this.showCreateModal.set(false);
        this.loadMocks();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Lỗi khi tạo Mock API')
    });
  }

  testCall(m: MockEndpoint): void {
    this.toastService.info('Đang gọi Gateway Mock Endpoint...');
    this.mockService.testCallMock(m.path, m.httpMethod).subscribe({
      next: (res) => {
        this.testResult.set(JSON.stringify(res, null, 2));
        this.toastService.success('Gọi Mock API Gateway thành công!');
        this.loadMocks();
      },
      error: (err) => {
        this.testResult.set(JSON.stringify(err.error || err, null, 2));
        this.toastService.error('Phản hồi từ Mock API');
      }
    });
  }

  toggleMock(id: string): void {
    this.mockService.toggleMock(id).subscribe({
      next: () => {
        this.toastService.success('Đã cập nhật trạng thái');
        this.loadMocks();
      }
    });
  }

  deleteMock(id: string): void {
    if (confirm('Xóa Mock Endpoint này?')) {
      this.mockService.deleteMock(id).subscribe({
        next: () => {
          this.toastService.success('Đã xóa Mock Endpoint');
          this.loadMocks();
        }
      });
    }
  }
}