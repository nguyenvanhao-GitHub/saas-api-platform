import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TracingService } from '../../../core/services/tracing.service';
import { RequestTrace, TraceWaterfallDto } from '../../../core/models';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-tracing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">{{ t('tracing.title') }}</h1>
          <p class="text-sm text-slate-400 mt-1">{{ t('tracing.subtitle') }}</p>
        </div>
        <button (click)="loadTraces()" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          {{ t('btn.refresh') }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl p-4 space-y-3">
          <h2 class="text-sm font-bold text-slate-200 uppercase tracking-wider">{{ t('tracing.recent_traces') }}</h2>
          <div class="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            <div *ngFor="let trace of traces()" (click)="selectTrace(trace.traceId)" [ngClass]="selectedTraceId() === trace.traceId ? 'border-brand-500 bg-brand-500/10' : 'border-slate-800 bg-slate-950/40'" class="p-3 rounded-xl border hover:border-slate-700 cursor-pointer transition-all">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold font-mono text-white">{{ trace.httpMethod }} {{ trace.endpoint }}</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded" [ngClass]="trace.httpStatus >= 400 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'">
                  {{ trace.httpStatus }}
                </span>
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{{ trace.traceId }}</span>
                <span class="text-amber-400 font-semibold">{{ trace.durationMs }}ms</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl p-6">
          <div *ngIf="waterfall() as wf; else noSelection">
            <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div>
                <span class="text-xs font-mono text-brand-400 font-semibold">TRACE: {{ wf.traceId }}</span>
                <h3 class="text-lg font-bold text-white mt-0.5">{{ wf.httpMethod }} {{ wf.endpoint }}</h3>
              </div>
              <div class="text-right">
                <div class="text-2xl font-extrabold text-amber-400 font-mono">{{ wf.totalDurationMs }}ms</div>
                <div class="text-[11px] text-slate-500">Total Latency Breakdown</div>
              </div>
            </div>

            <div class="space-y-4">
              <div *ngFor="let span of wf.spans" class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-medium text-slate-300">{{ span.name }}</span>
                  <span class="font-mono text-slate-400">{{ span.durationMs }}ms</span>
                </div>
                <div class="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 flex">
                  <div [style.margin-left.%]="span.offsetPercent" [style.width.%]="span.widthPercent" class="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 shadow-sm transition-all duration-500"></div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-800">
              <div class="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div class="text-[11px] text-slate-500 font-medium">Gateway Latency</div>
                <div class="text-base font-bold text-cyan-400 font-mono mt-0.5">{{ wf.gatewayLatencyMs }}ms</div>
              </div>
              <div class="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div class="text-[11px] text-slate-500 font-medium">Auth / JWT Verify</div>
                <div class="text-base font-bold text-indigo-400 font-mono mt-0.5">{{ wf.authLatencyMs }}ms</div>
              </div>
              <div class="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div class="text-[11px] text-slate-500 font-medium">Upstream DB / Exec</div>
                <div class="text-base font-bold text-emerald-400 font-mono mt-0.5">{{ wf.upstreamLatencyMs }}ms</div>
              </div>
            </div>
          </div>

          <ng-template #noSelection>
            <div class="h-64 flex flex-col items-center justify-center text-slate-500">
              <svg class="w-10 h-10 mb-2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <p class="text-sm">{{ t('tracing.select_trace_prompt') }}</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `
})
export class TracingComponent implements OnInit {
  private tracingService = inject(TracingService);
  private trans = inject(TranslationService);

  traces = signal<RequestTrace[]>([]);
  selectedTraceId = signal<string>('');
  waterfall = signal<TraceWaterfallDto | null>(null);

  t(key: string): string {
    return this.trans.t(key);
  }

  ngOnInit() {
    this.loadTraces();
  }

  loadTraces() {
    this.tracingService.getRecentTraces().subscribe({
      next: (res) => {
        this.traces.set(res);
        if (res.length > 0 && !this.selectedTraceId()) {
          this.selectTrace(res[0].traceId);
        }
      }
    });
  }

  selectTrace(traceId: string) {
    this.selectedTraceId.set(traceId);
    this.tracingService.getWaterfall(traceId).subscribe({
      next: (wf) => this.waterfall.set(wf)
    });
  }
}