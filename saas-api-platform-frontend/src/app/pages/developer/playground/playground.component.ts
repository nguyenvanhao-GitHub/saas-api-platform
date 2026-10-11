import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { GatewayService } from '../../../core/services/gateway.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { environment } from '../../../../environments/environment';

interface ApiPreset {
  id: string;
  category: 'BUSINESS' | 'AI' | 'FINANCE' | 'TRANSPORT' | 'TELECOM';
  name: string;
  icon: string;
  endpoint: string;
  desc: string;
}

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8">
      
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">{{ i18n.t('play.title') }}</h1>
        <p class="text-sm text-slate-400 mt-1">{{ i18n.t('play.subtitle') }}</p>
      </div>

      <!-- Catalog of 10 Commercial API Services Selector -->
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">🌟</span>
            <h3 class="text-sm font-bold text-white uppercase tracking-wider">{{ i18n.t('play.catalog_title') }}</h3>
          </div>

          <!-- Category Filter Pills -->
          <div class="flex flex-wrap gap-1.5">
            <button (click)="activeCategory.set('ALL')" [class]="activeCategory() === 'ALL' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all">{{ i18n.t('play.cat_all') }}</button>
            <button (click)="activeCategory.set('BUSINESS')" [class]="activeCategory() === 'BUSINESS' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all">{{ i18n.t('play.cat_business') }}</button>
            <button (click)="activeCategory.set('AI')" [class]="activeCategory() === 'AI' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all">{{ i18n.t('play.cat_ai') }}</button>
            <button (click)="activeCategory.set('FINANCE')" [class]="activeCategory() === 'FINANCE' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all">{{ i18n.t('play.cat_finance') }}</button>
            <button (click)="activeCategory.set('TRANSPORT')" [class]="activeCategory() === 'TRANSPORT' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all">{{ i18n.t('play.cat_transport') }}</button>
            <button (click)="activeCategory.set('TELECOM')" [class]="activeCategory() === 'TELECOM' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all">{{ i18n.t('play.cat_telecom') }}</button>
          </div>
        </div>

        <!-- Grid of Services -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          <div *ngFor="let item of filteredPresets()" (click)="selectEndpoint(item.endpoint)"
               [class.border-brand-500]="endpoint === item.endpoint"
               [class.bg-brand-600-10]="endpoint === item.endpoint"
               class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-2">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-base">{{ item.icon }}</span>
                <span class="text-xs font-bold text-white truncate">{{ item.name }}</span>
              </div>
              <p class="text-[11px] text-slate-400 line-clamp-2">{{ item.desc }}</p>
            </div>
            <span class="font-mono text-[10px] text-brand-400 truncate block bg-slate-950 px-2 py-0.5 rounded border border-slate-900">{{ item.endpoint }}</span>
          </div>
        </div>

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Request Builder Column -->
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 class="text-base font-bold text-white">{{ i18n.t('play.req_config') }}</h3>

          <!-- HTTP Method & Endpoint -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Endpoint URL</label>
            <div class="flex items-center gap-2">
              <span class="px-3 py-2.5 rounded-xl bg-slate-900 font-mono font-bold text-xs text-brand-400 border border-slate-800 shrink-0">POST</span>
              <input [(ngModel)]="endpoint" placeholder="/v1/business/tax-lookup" class="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white font-mono text-xs outline-none focus:border-brand-500" />
            </div>
          </div>

          <!-- API Key Header -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Header [ X-API-KEY ]</label>
            <input [(ngModel)]="apiKey" placeholder="sk_live_..." class="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white font-mono text-xs outline-none focus:border-brand-500" />
          </div>

          <!-- Rapid Fire Testing (Spam tester to trigger 429 Rate Limit) -->
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span class="text-xs font-semibold text-slate-300 block">{{ i18n.t('play.burst_title') }}</span>
            <p class="text-[11px] text-slate-400">{{ i18n.t('play.burst_hint') }}</p>
            <button (click)="sendBurstRequests()" [disabled]="isLoading()" class="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/20 transition-all">
              {{ i18n.t('play.burst_btn') }}
            </button>
          </div>

          <button (click)="sendRequest()" [disabled]="isLoading() || !apiKey" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2">
            <span *ngIf="isLoading()" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            {{ isLoading() ? '...' : i18n.t('play.send_btn') }}
          </button>
        </div>

        <!-- Response Console Column -->
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-bold text-white">{{ i18n.t('play.console_title') }}</h3>
              <div class="flex items-center gap-2" *ngIf="responseStatus()">
                <span [class]="responseStatus() === 200 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'" class="px-2.5 py-1 rounded-full text-xs font-mono font-bold border">
                  HTTP {{ responseStatus() }}
                </span>
                <span class="text-xs font-mono text-slate-400 font-semibold">{{ latency() }} ms</span>
              </div>
            </div>

            <!-- JSON Body Viewer -->
            <pre class="w-full h-80 p-4 rounded-xl bg-slate-950 border border-slate-900 font-mono text-xs text-emerald-400 overflow-y-auto select-all leading-relaxed whitespace-pre-wrap">{{ responseBody() || '// JSON response console output.' }}</pre>
          </div>

          <div class="text-[11px] text-slate-500 font-mono text-right">
            Gateway Endpoint: {{ gatewayEndpoint }}
          </div>
        </div>

      </div>

      <!-- Multi-Language Developer SDK / Code Snippet Generator -->
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono font-bold text-sm">
              &lt;/&gt;
            </div>
            <div>
              <h3 class="text-base font-bold text-white">{{ i18n.t('play.snippet_title') }}</h3>
              <p class="text-xs text-slate-400">{{ i18n.t('play.snippet_sub') }}</p>
            </div>
          </div>

          <!-- Language Selector Tabs -->
          <div class="flex items-center gap-1.5 overflow-x-auto bg-slate-950 p-1 rounded-xl border border-slate-800">
            @for (lang of snippetLanguages; track lang.id) {
              <button 
                (click)="selectedSnippetLang.set(lang.id)"
                [class]="selectedSnippetLang() === lang.id ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                {{ lang.label }}
              </button>
            }
          </div>
        </div>

        <!-- Code Box -->
        <div class="relative group">
          <pre class="w-full p-4 rounded-xl bg-slate-950 border border-slate-900 font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">{{ getSnippetCode() }}</pre>
          <button 
            (click)="copySnippet()"
            class="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            {{ i18n.t('play.copy_snippet') }}
          </button>
        </div>
      </div>

    </div>
  `
})
export class PlaygroundComponent implements OnInit {
  private authService = inject(AuthService);
  private gatewayService = inject(GatewayService);
  private toastService = inject(ToastService);
  public i18n = inject(TranslationService);

  public gatewayEndpoint = `${environment.apiBaseUrl}/gateway/execute`;
  public endpoint = '/v1/business/tax-lookup';
  public apiKey = '';
  public isLoading = signal(false);
  public responseStatus = signal<number | null>(null);
  public latency = signal<number>(0);
  public responseBody = signal<string>('');
  public activeCategory = signal<string>('ALL');

  public selectedSnippetLang = signal<'curl' | 'python' | 'node' | 'java' | 'go' | 'php'>('curl');

  public snippetLanguages: { id: 'curl' | 'python' | 'node' | 'java' | 'go' | 'php'; label: string }[] = [
    { id: 'curl', label: 'cURL' },
    { id: 'python', label: 'Python (requests)' },
    { id: 'node', label: 'Node.js (axios)' },
    { id: 'java', label: 'Java 17 (HttpClient)' },
    { id: 'go', label: 'Go (net/http)' },
    { id: 'php', label: 'PHP (cURL)' }
  ];

  public presets: ApiPreset[] = [
    { id: '1', category: 'BUSINESS', name: 'Tra Cứu Mã Số Thuế', icon: '🏢', endpoint: '/v1/business/tax-lookup', desc: 'Tra cứu thông tin công ty, ĐKKD, đại diện pháp luật' },
    { id: '2', category: 'BUSINESS', name: 'Mã BIN & Ngân Hàng', icon: '🏦', endpoint: '/v1/business/bank-bin-lookup', desc: 'Danh sách 54 ngân hàng NAPAS & VietQR' },
    { id: '3', category: 'AI', name: 'AI Tạo Content Marketing', icon: '🤖', endpoint: '/v1/ai/generate-content', desc: 'Tạo bài viết SEO, tiêu đề giật tít, hashtags' },
    { id: '4', category: 'AI', name: 'AI Phân Tích Cảm Xúc', icon: '🧠', endpoint: '/v1/ai/sentiment-analysis', desc: 'Phân tích đánh giá khách hàng (Tích cực / Tiêu cực)' },
    { id: '5', category: 'AI', name: 'AI OCR Quét Thẻ CCCD', icon: '🪪', endpoint: '/v1/ai/ocr-id-card', desc: 'Trích xuất tự động thông tin trên CCCD gắn chip' },
    { id: '6', category: 'FINANCE', name: 'Tỷ Giá & Giá Vàng SJC', icon: '📈', endpoint: '/v1/finance/exchange-rates', desc: 'Tỷ giá ngoại tệ USD/EUR và giá vàng SJC realtime' },
    { id: '7', category: 'FINANCE', name: 'Giá Crypto Realtime', icon: '🪙', endpoint: '/v1/finance/crypto-price', desc: 'Giá Bitcoin, Ethereum, Solana và vốn hóa thị trường' },
    { id: '8', category: 'TRANSPORT', name: 'Tra Cứu Phạt Nguội', icon: '🚗', endpoint: '/v1/traffic/traffic-fine-lookup', desc: 'Tra cứu vi phạm giao thông theo biển số xe toàn quốc' },
    { id: '9', category: 'TRANSPORT', name: 'Đơn Vị Hành Chính 63 Tỉnh', icon: '📍', endpoint: '/v1/geo/vietnam-provinces', desc: 'Danh mục 63 tỉnh/thành, quận/huyện chuẩn TCTK' },
    { id: '10', category: 'TELECOM', name: 'Gửi Tin Nhắn SMS OTP', icon: '📲', endpoint: '/v1/telecom/sms-otp-send', desc: 'Cổng gửi SMS Brandname và Zalo ZNS xác thực' }
  ];

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user?.apiKey) {
      this.apiKey = user.apiKey;
    }
  }

  filteredPresets(): ApiPreset[] {
    const cat = this.activeCategory();
    if (cat === 'ALL') return this.presets;
    return this.presets.filter(p => p.category === cat);
  }

  selectEndpoint(ep: string): void {
    this.endpoint = ep;
    this.sendRequest();
  }

  sendRequest(): void {
    if (!this.apiKey) {
      this.toastService.warning('Vui lòng nhập API Key trước khi gửi request!');
      return;
    }
    this.isLoading.set(true);
    const start = performance.now();

    this.gatewayService.executeApi(this.apiKey, this.endpoint).subscribe({
      next: (res) => {
        this.latency.set(Math.round(performance.now() - start));
        this.responseStatus.set(200);
        this.responseBody.set(JSON.stringify(res, null, 2));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.latency.set(Math.round(performance.now() - start));
        const status = err.status || 400;
        this.responseStatus.set(status);
        this.responseBody.set(JSON.stringify(err.error || { error: 'Network error' }, null, 2));
        this.isLoading.set(false);
        if (status === 429) {
          this.toastService.error('HTTP 429: Vượt quá hạn mức Rate Limit (Too Many Requests)!', 'Rate Limit Exceeded');
        } else if (status === 401 || status === 403) {
          this.toastService.error('HTTP 401/403: API Key không hợp lệ hoặc không có quyền truy cập gói này!', 'Unauthorized');
        }
      }
    });
  }

  sendBurstRequests(): void {
    this.toastService.info('Đang gửi đồng loạt 10 requests kiểm tra Rate Limiter...');
    for (let i = 0; i < 10; i++) {
      setTimeout(() => this.sendRequest(), i * 50);
    }
  }

  getSnippetCode(): string {
    const key = this.apiKey || 'YOUR_API_KEY';
    const ep = this.endpoint || '/v1/business/tax-lookup';
    const fullUrl = `${this.gatewayEndpoint}?endpoint=${encodeURIComponent(ep)}`;
    const lang = this.selectedSnippetLang();

    switch (lang) {
      case 'curl':
        return `curl -X POST "${fullUrl}" \\
  -H "X-API-KEY: ${key}" \\
  -H "Content-Type: application/json"`;

      case 'python':
        return `import requests

url = "${fullUrl}"
headers = {
    "X-API-KEY": "${key}",
    "Content-Type": "application/json"
}

response = requests.post(url, headers=headers)
print("Status:", response.status_code)
print("Data:", response.json())`;

      case 'node':
        return `const axios = require('axios');

async function callSaaSGateway() {
  try {
    const response = await axios.post('${fullUrl}', {}, {
      headers: {
        'X-API-KEY': '${key}',
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

callSaaSGateway();`;

      case 'java':
        return `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class SaaSClient {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("${fullUrl}"))
                .header("X-API-KEY", "${key}")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("Status: " + response.statusCode());
        System.out.println("Body: " + response.body());
    }
}`;

      case 'go':
        return `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "${fullUrl}"
	req, _ := http.NewRequest("POST", url, nil)
	req.Header.Set("X-API-KEY", "${key}")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println("Status:", resp.Status)
	fmt.Println("Body:", string(body))
}`;

      case 'php':
        return `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "${fullUrl}",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_HTTPHEADER => [
    "X-API-KEY: ${key}",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}`;
    }
  }

  copySnippet(): void {
    navigator.clipboard.writeText(this.getSnippetCode());
    this.toastService.success('Đã sao chép mã nguồn tích hợp vào clipboard!');
  }
}
