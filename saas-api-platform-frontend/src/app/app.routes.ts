import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  // Public Status Page (Unauthenticated)
  {
    path: 'status',
    loadComponent: () => import('./pages/public/status/status.component').then(m => m.PublicStatusComponent)
  },

  // Auth Layout Routes
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },

  // Main Dashboard Layout Routes (Protected by AuthGuard)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      // Developer Portal Routes
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/developer/dashboard/dashboard.component').then(m => m.DeveloperDashboardComponent)
      },
      {
        path: 'marketplace',
        loadComponent: () => import('./pages/developer/marketplace/marketplace.component').then(m => m.MarketplaceComponent)
      },
      {
        path: 'playground',
        loadComponent: () => import('./pages/developer/playground/playground.component').then(m => m.PlaygroundComponent)
      },
      {
        path: 'webhooks',
        loadComponent: () => import('./pages/developer/webhooks/webhooks.component').then(m => m.WebhooksComponent)
      },
      {
        path: 'invoices',
        loadComponent: () => import('./pages/developer/invoices/invoices.component').then(m => m.InvoicesComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/developer/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'alerts',
        loadComponent: () => import('./pages/developer/alerts/alerts.component').then(m => m.AlertsComponent)
      },
      {
        path: 'teams',
        loadComponent: () => import('./pages/developer/teams/teams.component').then(m => m.TeamsComponent)
      },
      {
        path: 'mock-apis',
        loadComponent: () => import('./pages/developer/mock-apis/mock-apis.component').then(m => m.MockApisComponent)
      },
      {
        path: 'ai-copilot',
        loadComponent: () => import('./pages/developer/ai-copilot/ai-copilot.component').then(m => m.AiCopilotComponent)
      },
      {
        path: 'sdk-generator',
        loadComponent: () => import('./pages/developer/sdk-generator/sdk-generator.component').then(m => m.SdkGeneratorComponent)
      },
      {
        path: 'tracing',
        loadComponent: () => import('./pages/developer/tracing/tracing.component').then(m => m.TracingComponent)
      },
      {
        path: 'traffic-replay',
        loadComponent: () => import('./pages/developer/traffic-replay/traffic-replay.component').then(m => m.TrafficReplayComponent)
      },
      {
        path: 'compliance',
        loadComponent: () => import('./pages/developer/compliance/compliance.component').then(m => m.ComplianceComponent)
      },
      {
        path: 'docs-explorer',
        loadComponent: () => import('./pages/docs-explorer/docs-explorer.component').then(m => m.DocsExplorerComponent)
      },

      // Admin Portal Routes (Protected by AdminGuard)
      {
        path: 'admin/dashboard',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'admin/users',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/users/users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'admin/products',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/products/products.component').then(m => m.AdminProductsComponent)
      },
      {
        path: 'admin/endpoint-policies',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/endpoint-policies/endpoint-policies.component').then(m => m.EndpointPoliciesComponent)
      },
      {
        path: 'admin/sla-probes',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/sla-probes/sla-probes.component').then(m => m.SlaProbesComponent)
      },
      {
        path: 'admin/live-logs',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/live-logs/live-logs.component').then(m => m.LiveLogsComponent)
      },
      {
        path: 'admin/coupons',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/coupons/coupons.component').then(m => m.AdminCouponsComponent)
      },
      {
        path: 'admin/firewall',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/firewall/firewall.component').then(m => m.FirewallComponent)
      },
      {
        path: 'admin/audit-logs',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/audit-logs/audit-logs.component').then(m => m.AdminAuditLogsComponent)
      }
    ]
  },

  // Fallback Wildcard
  { path: '**', redirectTo: 'login' }
];
