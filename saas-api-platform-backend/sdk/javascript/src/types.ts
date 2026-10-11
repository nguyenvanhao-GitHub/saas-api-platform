export interface SmartGateConfig {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  timestamp: string;
  data: T;
  remainingQuota?: number;
  requestsThisMinute?: number;
}

export interface TaxLookupResult {
  service: string;
  taxCode: string;
  companyName: string;
  internationalName: string;
  shortName: string;
  address: string;
  representative: string;
  foundedDate: string;
  status: string;
  mainIndustry: string;
}

export interface AiContentResult {
  service: string;
  topic: string;
  generatedTitle: string;
  summary: string;
  seoKeywords: string[];
  wordCount: number;
  aiModel: string;
}

export interface ExchangeRatesResult {
  service: string;
  baseCurrency: string;
  exchangeRates: Record<string, number>;
  goldPriceSJC: {
    buyPriceVND: number;
    sellPriceVND: number;
    unit: string;
  };
  updatedAt: string;
}
