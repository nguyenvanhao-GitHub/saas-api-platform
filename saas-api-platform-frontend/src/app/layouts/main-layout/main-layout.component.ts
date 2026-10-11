import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { TranslationService } from '../../core/services/translation.service';
import { AppNotification } from '../../core/models';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="h-screen w-screen overflow-hidden bg-slate-950 flex flex-col md:flex-row text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
      
      <!-- Sidebar Navigation (Fixed Height & Scrollable Menu) -->
      <aside class="w-full md:w-72 h-full bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 z-20 backdrop-blur-xl shadow-2xl overflow-hidden">
        
        <!-- Brand Logo Header -->
        <div class="h-16 px-5 flex items-center justify-between border-b border-slate-800/90 bg-slate-950/40">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 ring-1 ring-white/20">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span class="font-black text-sm tracking-tight text-white block uppercase">SaaS API Hub</span>
              <span class="text-[10px] text-brand-400 font-mono tracking-wider font-semibold">Master Edition v3.0</span>
            </div>
          </div>
          <span class="px-2 py-0.5 text-[10px] font-bold rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20">
            PRO
          </span>
        </div>

        <!-- Categorized Navigation Menu -->
        <div class="flex-1 px-3.5 py-5 space-y-6 overflow-y-auto custom-scrollbar">
          
          <!-- Group 1: Core Platform -->
          <div>
            <div class="px-2.5 mb-2 flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{{ i18n.t('nav.section_core') }}</span>
              <span class="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">5</span>
            </div>
            <nav class="space-y-1">
              <a routerLink="/dashboard" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span>{{ i18n.t('nav.dashboard') }}</span>
              </a>
              <a routerLink="/marketplace" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                <span>{{ i18n.t('nav.marketplace') }}</span>
              </a>
              <a routerLink="/playground" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <span>{{ i18n.t('nav.playground') }}</span>
              </a>
              <a routerLink="/profile" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                <span>{{ i18n.t('nav.profile') }}</span>
              </a>
              <a routerLink="/webhooks" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span>{{ i18n.t('nav.webhooks') }}</span>
              </a>
            </nav>
          </div>

          <!-- Group 2: Billing & Quotas -->
          <div>
            <div class="px-2.5 mb-2 flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{{ i18n.t('nav.section_billing') }}</span>
              <span class="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">4</span>
            </div>
            <nav class="space-y-1">
              <a routerLink="/invoices" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span>{{ i18n.t('nav.invoices') }}</span>
              </a>
              <a routerLink="/alerts" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span>{{ i18n.t('nav.alerts') }}</span>
              </a>
              <a routerLink="/teams" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span>{{ i18n.t('nav.teams') }}</span>
              </a>
              <a routerLink="/compliance" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span>{{ i18n.t('nav.compliance') }}</span>
              </a>
            </nav>
          </div>

          <!-- Group 3: Developer Tools & AI -->
          <div>
            <div class="px-2.5 mb-2 flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{{ i18n.t('nav.section_tools') }}</span>
              <span class="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">4</span>
            </div>
            <nav class="space-y-1">
              <a routerLink="/docs-explorer" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <span>{{ i18n.t('nav.docs_explorer') }}</span>
              </a>
              <a routerLink="/ai-copilot" routerLinkActive="bg-purple-600/20 text-purple-300 font-semibold border-l-2 border-purple-500 shadow-sm shadow-purple-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span>{{ i18n.t('nav.ai_copilot') }}</span>
              </a>
              <a routerLink="/mock-apis" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>{{ i18n.t('nav.mock_apis') }}</span>
              </a>
              <a routerLink="/sdk-generator" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <span>{{ i18n.t('nav.sdk') }}</span>
              </a>
            </nav>
          </div>

          <!-- Group 4: Observability & Traffic -->
          <div>
            <div class="px-2.5 mb-2 flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{{ i18n.t('nav.section_observability') }}</span>
              <span class="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">3</span>
            </div>
            <nav class="space-y-1">
              <a routerLink="/tracing" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                <span>{{ i18n.t('nav.tracing') }}</span>
              </a>
              <a routerLink="/traffic-replay" routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-500 shadow-sm shadow-brand-500/10" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ i18n.t('nav.replay') }}</span>
              </a>
              <a routerLink="/status" target="_blank" class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <div class="flex items-center gap-3">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{{ i18n.t('nav.status') }}</span>
                </div>
                <span class="text-[10px] text-emerald-400 font-mono">99.99%</span>
              </a>
            </nav>
          </div>

          <!-- Group 5: Enterprise Administration (Role Admin Only) -->
          <div *ngIf="authService.isAdmin()" class="pt-2 border-t border-slate-800/80">
            <div class="px-2.5 mb-2 flex items-center justify-between">
              <span class="text-[11px] font-bold text-rose-400 uppercase tracking-wider">{{ i18n.t('nav.section_admin') }}</span>
              <span class="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded font-mono">ADMIN</span>
            </div>
            <nav class="space-y-1">
              <a routerLink="/admin/dashboard" routerLinkActive="bg-rose-600/20 text-rose-300 font-semibold border-l-2 border-rose-500" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                <span>{{ i18n.t('nav.admin_dashboard') }}</span>
              </a>
              <a routerLink="/admin/users" routerLinkActive="bg-rose-600/20 text-rose-300 font-semibold border-l-2 border-rose-500" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <span>{{ i18n.t('nav.admin_users') }}</span>
              </a>
              <a routerLink="/admin/products" routerLinkActive="bg-rose-600/20 text-rose-300 font-semibold border-l-2 border-rose-500" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <span>{{ i18n.t('nav.admin_products') }}</span>
              </a>
              <a routerLink="/admin/endpoint-policies" routerLinkActive="bg-rose-600/20 text-rose-300 font-semibold border-l-2 border-rose-500" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                <span>{{ i18n.t('nav.policies') }}</span>
              </a>
              <a routerLink="/admin/sla-probes" routerLinkActive="bg-rose-600/20 text-rose-300 font-semibold border-l-2 border-rose-500" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span>{{ i18n.t('nav.sla') }}</span>
              </a>
              <a routerLink="/admin/live-logs" routerLinkActive="bg-rose-600/20 text-rose-300 font-semibold border-l-2 border-rose-500" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>{{ i18n.t('nav.live_logs') }}</span>
              </a>
              <a routerLink="/admin/coupons" routerLinkActive="bg-rose-600/20 text-rose-300 font-semibold border-l-2 border-rose-500" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                <span>{{ i18n.t('nav.admin_coupons') }}</span>
              </a>
              <a routerLink="/admin/firewall" routerLinkActive="bg-rose-600/20 text-rose-300 font-semibold border-l-2 border-rose-500" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span>{{ i18n.t('nav.admin_firewall') }}</span>
              </a>
              <a routerLink="/admin/audit-logs" routerLinkActive="bg-rose-600/20 text-rose-300 font-semibold border-l-2 border-rose-500" class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span>{{ i18n.t('nav.admin_audit') }}</span>
              </a>
            </nav>
          </div>

        </div>

        <!-- User Profile Pill & Quick Logout -->
        <div class="p-3.5 border-t border-slate-800/90 bg-slate-950/60">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5 overflow-hidden">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 border border-brand-400/30 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-md">
                {{ authService.currentUser()?.fullName?.charAt(0) || 'U' }}
              </div>
              <div class="truncate">
                <div class="flex items-center gap-1.5">
                  <p class="text-xs font-bold text-white truncate">{{ authService.currentUser()?.fullName || 'User' }}</p>
                  <span *ngIf="authService.isAdmin()" class="px-1 py-0.2 rounded text-[9px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">ADMIN</span>
                </div>
                <p class="text-[11px] text-slate-400 truncate font-mono">{{ authService.currentUser()?.email }}</p>
              </div>
            </div>
            <button (click)="logout()" [title]="i18n.t('btn.logout')" class="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20">
              <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>

      </aside>

      <!-- Main Content Area (Header Sticky + Independent Main Scroll) -->
      <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        <!-- Header Bar -->
        <header class="h-16 bg-slate-900/60 border-b border-slate-800/90 px-6 flex items-center justify-between backdrop-blur-xl shrink-0 z-10">
          <div class="flex items-center gap-4">
            <a routerLink="/status" target="_blank" class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-sm shadow-emerald-500/5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> {{ i18n.t('status.operational') }}
            </a>
          </div>

          <div class="flex items-center gap-3">
            <!-- Notification Bell Dropdown -->
            <div class="relative">
              <button (click)="toggleNotifications()" class="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-all flex items-center justify-center hover:border-slate-600">
                <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                @if (notificationService.unreadCount() > 0) {
                  <span class="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold text-white bg-rose-500 rounded-full animate-pulse shadow-md shadow-rose-500/40">
                    {{ notificationService.unreadCount() > 99 ? '99+' : notificationService.unreadCount() }}
                  </span>
                }
              </button>

              <!-- Notifications Dropdown Menu -->
              @if (showNotifications()) {
                <div class="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div class="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-xs uppercase tracking-wider text-white">🔔 {{ i18n.t('notif.title') }}</span>
                      <span class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                        {{ notificationService.unreadCount() }} {{ i18n.t('notif.new') }}
                      </span>
                    </div>
                    @if (notificationService.unreadCount() > 0) {
                      <button (click)="markAllAsRead()" class="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
                        {{ i18n.t('notif.mark_all_read') }}
                      </button>
                    }
                  </div>

                  <div class="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    @for (n of notificationService.notifications(); track n.id) {
                      <div (click)="markAsRead(n)" class="p-3.5 hover:bg-slate-800/50 transition-all cursor-pointer flex gap-3 items-start" [class.bg-slate-800]="!n.isRead">
                        <div class="w-2 h-2 mt-1.5 rounded-full shrink-0" [class.bg-brand-400]="!n.isRead" [class.bg-slate-700]="n.isRead"></div>
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-bold text-slate-200 truncate">{{ n.title }}</p>
                          <p class="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{{ n.content }}</p>
                          <span class="text-[10px] text-slate-500 font-mono mt-1 block">{{ n.createdAt | date:'HH:mm dd/MM/yyyy' }}</span>
                        </div>
                      </div>
                    } @empty {
                      <div class="p-8 text-center text-slate-500 text-xs">
                        {{ i18n.t('notif.empty') }}
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Language Switcher Toggle Button -->
            <button (click)="i18n.toggleLanguage()" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700/80 flex items-center gap-2 transition-all hover:border-slate-600 shadow-sm">
              <span>{{ i18n.currentLang() === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English' }}</span>
              <span class="text-[10px] text-brand-400 font-mono uppercase bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                {{ i18n.currentLang() === 'vi' ? 'VI' : 'EN' }}
              </span>
            </button>

            <!-- Swagger Docs Link -->
            <a routerLink="/docs-explorer" class="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all items-center gap-1.5 border border-slate-700/80 hover:border-slate-600 shadow-sm">
              <svg class="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              {{ i18n.t('btn.docs') }}
            </a>

            <!-- Prominent Logout Button -->
            <button (click)="logout()" class="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm shadow-rose-500/10 cursor-pointer">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{{ i18n.t('btn.logout') }}</span>
            </button>
          </div>
        </header>

        <!-- Router Outlet Page Content (Independent Scroll) -->
        <main class="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <router-outlet></router-outlet>
        </main>

      </div>

    </div>
  `
})
export class MainLayoutComponent implements OnInit {
  public authService = inject(AuthService);
  public notificationService = inject(NotificationService);
  public i18n = inject(TranslationService);
  private router = inject(Router);

  public showNotifications = signal(false);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.notificationService.fetchUnreadCount().subscribe();
    }
  }

  toggleNotifications(): void {
    this.showNotifications.update(v => !v);
    if (this.showNotifications()) {
      this.notificationService.getMyNotifications().subscribe();
    }
  }

  markAsRead(n: AppNotification): void {
    if (!n.isRead) {
      this.notificationService.markAsRead(n.id).subscribe();
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
