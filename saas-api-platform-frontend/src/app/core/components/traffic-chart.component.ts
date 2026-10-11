import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DailyTraffic {
  day: string;
  date: string;
  requests: number;
}

@Component({
  selector: 'app-traffic-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      
      <!-- Chart Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-emerald-400 font-bold">📈</span>
            <h3 class="text-base font-bold text-white">{{ title }}</h3>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">Biểu đồ lưu lượng API và tần suất truy vấn trong 7 ngày gần nhất</p>
        </div>

        <!-- Chart Type Switcher -->
        <div class="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button (click)="chartType.set('area')" [class]="chartType() === 'area' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'" class="px-3 py-1 rounded-lg text-xs font-semibold transition-all">
            Biểu Đồ Miền (Area)
          </button>
          <button (click)="chartType.set('bar')" [class]="chartType() === 'bar' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'" class="px-3 py-1 rounded-lg text-xs font-semibold transition-all">
            Biểu Đồ Cột (Bar)
          </button>
        </div>
      </div>

      <!-- Total & Average Summary Pills -->
      <div class="flex items-center gap-4 text-xs font-mono">
        <div class="flex items-center gap-1.5 text-slate-300">
          <span class="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
          <span>Tổng tuần: <strong class="text-white">{{ totalWeeklyRequests() | number }} req</strong></span>
        </div>
        <div class="flex items-center gap-1.5 text-slate-300">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Trung bình: <strong class="text-emerald-400">{{ avgDailyRequests() | number }} req/ngày</strong></span>
        </div>
        <div class="flex items-center gap-1.5 text-slate-300">
          <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          <span>SLA Uptime: <strong class="text-indigo-400">99.98%</strong></span>
        </div>
      </div>

      <!-- Interactive SVG Chart Area -->
      <div class="relative h-64 w-full pt-4">
        
        <!-- Area / Line Chart View -->
        <div *ngIf="chartType() === 'area'" class="w-full h-full">
          <svg class="w-full h-48 overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#6366f1" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Background Grid Lines -->
            <line x1="0" y1="40" x2="700" y2="40" stroke="#334155" stroke-dasharray="4 4" stroke-opacity="0.4" />
            <line x1="0" y1="90" x2="700" y2="90" stroke="#334155" stroke-dasharray="4 4" stroke-opacity="0.4" />
            <line x1="0" y1="140" x2="700" y2="140" stroke="#334155" stroke-dasharray="4 4" stroke-opacity="0.4" />
            <line x1="0" y1="190" x2="700" y2="190" stroke="#334155" stroke-opacity="0.8" />

            <!-- Gradient Area Fill -->
            <path [attr.d]="svgAreaPath()" fill="url(#chartGradient)" />

            <!-- Main Line Stroke -->
            <path [attr.d]="svgLinePath()" fill="none" stroke="#818cf8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-lg" />

            <!-- Data Point Circles -->
            <g *ngFor="let pt of chartPoints(); let i = index">
              <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="5.5" fill="#1e1b4b" stroke="#a5b4fc" stroke-width="2.5" class="hover:r-7 transition-all cursor-pointer" />
            </g>
          </svg>

          <!-- Day Labels -->
          <div class="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-2">
            <span *ngFor="let item of data">{{ item.day }} ({{ item.date }})</span>
          </div>
        </div>

        <!-- Bar Chart View -->
        <div *ngIf="chartType() === 'bar'" class="w-full h-full flex items-end justify-between gap-3 px-4 pb-6">
          <div *ngFor="let item of data" class="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
            <span class="text-[10px] font-mono text-brand-400 opacity-0 group-hover:opacity-100 transition-all font-bold">
              {{ item.requests | number }}
            </span>
            <div class="w-full max-w-[48px] bg-slate-800 group-hover:bg-gradient-to-t group-hover:from-brand-600 group-hover:to-indigo-500 rounded-t-xl transition-all duration-300 overflow-hidden relative"
                 [style.height.%]="(item.requests / maxRequests()) * 85">
              <div class="w-full h-full bg-gradient-to-t from-brand-600/80 to-indigo-500/80 rounded-t-xl"></div>
            </div>
            <div class="text-center">
              <span class="text-[11px] font-bold text-slate-300 block">{{ item.day }}</span>
              <span class="text-[9px] text-slate-500 block">{{ item.date }}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class TrafficChartComponent {
  @Input() title: string = 'Lưu Lượng API 7 Ngày Gần Nhất';
  
  @Input() data: DailyTraffic[] = [
    { day: 'T2', date: '09/08', requests: 420 },
    { day: 'T3', date: '10/08', requests: 680 },
    { day: 'T4', date: '11/08', requests: 1250 },
    { day: 'T5', date: '12/08', requests: 980 },
    { day: 'T6', date: '13/08', requests: 1840 },
    { day: 'T7', date: '14/08', requests: 2450 },
    { day: 'CN', date: '15/08', requests: 3120 }
  ];

  public chartType = signal<'area' | 'bar'>('area');

  maxRequests = computed(() => {
    const max = Math.max(...this.data.map(d => d.requests));
    return max > 0 ? max : 1000;
  });

  totalWeeklyRequests = computed(() => {
    return this.data.reduce((acc, curr) => acc + curr.requests, 0);
  });

  avgDailyRequests = computed(() => {
    return Math.round(this.totalWeeklyRequests() / this.data.length);
  });

  chartPoints = computed(() => {
    const max = this.maxRequests() * 1.2;
    const width = 700;
    const height = 180;
    const step = width / (this.data.length - 1);

    return this.data.map((item, index) => {
      const x = index * step;
      const y = height - (item.requests / max) * height + 10;
      return { x, y, requests: item.requests };
    });
  });

  svgLinePath = computed(() => {
    const pts = this.chartPoints();
    if (pts.length === 0) return '';
    return pts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  });

  svgAreaPath = computed(() => {
    const pts = this.chartPoints();
    if (pts.length === 0) return '';
    const line = this.svgLinePath();
    const lastX = pts[pts.length - 1].x;
    return `${line} L ${lastX} 190 L 0 190 Z`;
  });
}
