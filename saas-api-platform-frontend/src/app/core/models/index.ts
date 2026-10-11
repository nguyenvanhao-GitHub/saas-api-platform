// Core TypeScript Models matching Spring Boot Backend API

export interface ApiResponse<T> {
  code: number;
  message: string;
  timestamp: string;
  path?: string;
  correlationId?: string;
  data: T;
  errors?: Record<string, string>;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ROLE_DEVELOPER' | 'ROLE_ADMIN';
  apiKey: string;
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  apiKey: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  basePrice: number;
  planType: 'FIXED' | 'METERED';
  rateLimitPerMinute: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  user: User;
  product: Product;
  status: 'ACTIVE' | 'CANCELLED';
  totalRequestsUsed: number;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  user: User;
  amount: number;
  s3PdfUrl: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: string;
}

export interface VietQrResponse {
  invoiceNumber: string;
  amountUsd: number;
  amountVnd: number;
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  transferMemo: string;
  qrImageUrl: string;
  quickPaymentDeepLink: string;
}

export interface WebhookEndpoint {
  id: string;
  targetUrl: string;
  secretKey: string;
  events: string;
  status: string;
  createdAt: string;
}

export interface WebhookDeliveryLog {
  id: string;
  eventType: string;
  payload: string;
  responseStatus: number;
  responseBody: string;
  latencyMs?: number;
  retryCount?: number;
  status?: string;
  success: boolean;
  createdAt: string;
}

export interface ApiKeyItem {
  id: string;
  userId: string;
  keyName: string;
  apiKey: string;
  maskedKey: string;
  scopes?: string;
  ipWhitelist?: string;
  rateLimitPerMinute: number;
  isActive: boolean;
  expiresAt?: string;
  lastUsedAt?: string;
  createdAt: string;
}

export interface CreateApiKeyDto {
  keyName: string;
  scopes?: string;
  ipWhitelist?: string;
  rateLimitPerMinute?: number;
  expiresAt?: string;
}

export interface PublicServiceStatus {
  name: string;
  category: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';
  latencyMs: number;
  uptime: string;
}

export interface PublicStatusData {
  overallStatus: string;
  overallUptime: string;
  avgLatencyMs: number;
  servicesCount: number;
  services: PublicServiceStatus[];
  lastUpdated: string;
  activeIncidents: any[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxUses: number;
  timesUsed: number;
  expiresAt: string;
  status: string;
  discountedAmount?: number;
  finalPrice?: number;
}

export interface UsageStats {
  userId: string;
  email: string;
  apiKey: string;
  totalRequestsUsed: number;
  requestsThisMinute: number;
  rateLimitPerMinute: number;
  remainingQuotaThisMinute: number;
}

export interface AdminDashboard {
  totalUsers: number;
  totalActiveSubscriptions: number;
  totalApiProducts: number;
  totalRevenue: number;
  totalApiRequestsProcessed: number;
  subscriptionsByPlanType: Record<string, number>;
}

export interface DeveloperDashboard {
  apiKey: string;
  totalRequestsUsed: number;
  requestsThisMinute: number;
  rateLimitPerMinute: number;
  totalSpent: number;
  activeSubscriptions: Subscription[];
  recentInvoices: Invoice[];
}

export interface AuditLog {
  id: string;
  userEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  clientIp: string;
  userAgent: string;
  description: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'BILLING' | 'SECURITY';
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface UnreadCount {
  unreadCount: number;
}

export interface SocialLoginRequest {
  provider: 'GOOGLE' | 'GITHUB';
  socialId?: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface CardPaymentRequest {
  invoiceId: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvc: string;
  stripePaymentMethodId?: string;
}

export interface UsageAlert {
  id: string;
  userId: string;
  thresholdPercentage: number;
  channel: 'IN_APP' | 'EMAIL' | 'SLACK' | 'DISCORD';
  destination?: string;
  isTriggered: boolean;
  lastTriggeredAt?: string;
  createdAt: string;
}

export interface CreateAlertDto {
  thresholdPercentage: number;
  channel: string;
  destination?: string;
}

export interface TeamMember {
  id: string;
  organizationId: string;
  userId?: string;
  invitedEmail: string;
  role: 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'VIEWER';
  status: 'ACTIVE' | 'PENDING' | 'REVOKED';
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  members: TeamMember[];
}

export interface TeamInviteDto {
  email: string;
  role: string;
}

export interface TimeSeriesPoint {
  timeLabel: string;
  totalRequests: number;
  successRequests: number;
  clientErrors: number;
  serverErrors: number;
  avgLatencyMs: number;
}

export interface EndpointUsage {
  endpoint: string;
  method: string;
  callCount: number;
  percentage: number;
  avgLatencyMs: number;
  category: string;
}

export interface AnalyticsOverview {
  totalRequests24h: number;
  successRate: number;
  avgLatencyMs: number;
  rateLimitBlocks: number;
  timeSeries: TimeSeriesPoint[];
  topEndpoints: EndpointUsage[];
}

export interface MockEndpoint {
  id: string;
  userId: string;
  name: string;
  path: string;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  responseStatus: number;
  responseBody: string;
  responseHeaders?: string;
  isActive: boolean;
  callCount: number;
  createdAt: string;
}

export interface CreateMockDto {
  name: string;
  path: string;
  httpMethod: string;
  responseStatus: number;
  responseBody: string;
  responseHeaders?: string;
}

export interface AiCopilotMessage {
  id?: string;
  prompt: string;
  reply: string;
  codeSnippet?: string;
  language?: string;
  tokensEstimated?: number;
  createdAt?: string;
  isUser?: boolean;
}

export interface IpFirewallRule {
  id: string;
  ruleType: 'ALLOW' | 'DENY';
  cidrIp: string;
  description?: string;
  isActive: boolean;
  blockedHits: number;
  createdAt: string;
}

export interface CreateFirewallDto {
  ruleType: string;
  cidrIp: string;
  description?: string;
}

export interface EndpointPolicy {
  id: string;
  endpointPath: string;
  httpMethod: string;
  rateLimitPerMin: number;
  burstCapacity: number;
  jsonSchemaValidation?: string;
  isPiiMaskingEnabled: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface CreateEndpointPolicyDto {
  endpointPath: string;
  httpMethod: string;
  rateLimitPerMin: number;
  burstCapacity: number;
  jsonSchemaValidation?: string;
  isPiiMaskingEnabled: boolean;
}

export interface RequestTrace {
  id: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  serviceName: string;
  endpoint: string;
  httpMethod: string;
  httpStatus: number;
  durationMs: number;
  gatewayLatencyMs: number;
  authLatencyMs: number;
  upstreamLatencyMs: number;
  timestamp: string;
}

export interface SpanDetail {
  spanId: string;
  name: string;
  durationMs: number;
  offsetPercent: number;
  widthPercent: number;
  status: string;
}

export interface TraceWaterfallDto {
  traceId: string;
  endpoint: string;
  httpMethod: string;
  httpStatus: number;
  totalDurationMs: number;
  gatewayLatencyMs: number;
  authLatencyMs: number;
  upstreamLatencyMs: number;
  timestamp: string;
  spans: SpanDetail[];
}

export interface TrafficReplayJob {
  id: string;
  name: string;
  targetEnvUrl: string;
  recordedRequestsCount: number;
  successCount: number;
  failedCount: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface CreateReplayJobDto {
  name: string;
  targetEnvUrl: string;
  requestCount: number;
}

export interface SlaProbe {
  id: string;
  name: string;
  targetUrl: string;
  httpMethod: string;
  expectedStatus: number;
  checkIntervalSeconds: number;
  lastLatencyMs: number;
  uptimePercentage: number;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  lastCheckedAt?: string;
  createdAt: string;
}

export interface CreateSlaProbeDto {
  name: string;
  targetUrl: string;
  httpMethod?: string;
  expectedStatus?: number;
  checkIntervalSeconds?: number;
}
