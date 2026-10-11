import { ApiResponse, SmartGateConfig, TaxLookupResult, AiContentResult, ExchangeRatesResult } from './types';

export class SmartGateClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(config: SmartGateConfig) {
    if (!config.apiKey) {
      throw new Error('[SmartGate SDK] API Key là bắt buộc. Khởi tạo: new SmartGateClient({ apiKey: "sk_live_..." })');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl?.replace(/\/$/, '') || 'http://localhost:3000';
    this.timeoutMs = config.timeoutMs || 10000;
  }

  /**
   * Gọi bất kỳ Endpoint nào qua SaaS Gateway với bảo vệ Redis Rate Limit
   */
  public async execute(endpoint: string, params?: Record<string, any>): Promise<ApiResponse> {
    const url = `${this.baseUrl}/api/v1/gateway/execute?endpoint=${encodeURIComponent(endpoint)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey
        },
        body: params ? JSON.stringify(params) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const json = await response.json();
      if (!response.ok) {
        throw new Error(`[SmartGate API Error ${response.status}] ${json.message || 'Yêu cầu thất bại'}`);
      }

      return json;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`[SmartGate SDK] Yêu cầu bị Timeout sau ${this.timeoutMs}ms`);
      }
      throw err;
    }
  }

  /**
   * 1. 🏢 Tra cứu Mã Số Thuế & Doanh Nghiệp Quốc Gia
   */
  public async lookupTaxCode(taxCode?: string): Promise<TaxLookupResult> {
    const res = await this.execute('/v1/business/tax-lookup', { taxCode });
    return res.data.data as TaxLookupResult;
  }

  /**
   * 2. 🤖 AI Tạo Nội Dung & Bài Viết Marketing SEO
   */
  public async generateAiContent(topic: string): Promise<AiContentResult> {
    const res = await this.execute('/v1/ai/generate-content', { topic });
    return res.data.data as AiContentResult;
  }

  /**
   * 3. 📈 Tra Cứu Tỷ Giá Ngoại Tệ & Giá Vàng SJC Realtime
   */
  public async getExchangeRates(): Promise<ExchangeRatesResult> {
    const res = await this.execute('/v1/finance/exchange-rates');
    return res.data.data as ExchangeRatesResult;
  }

  /**
   * 4. 🚗 Tra Cứu Phạt Nguội Phương Tiện Giao Thông
   */
  public async checkTrafficFine(plateNumber: string): Promise<any> {
    const res = await this.execute('/v1/traffic/traffic-fine-lookup', { plateNumber });
    return res.data.data;
  }

  /**
   * 5. 📲 Gửi Tin Nhắn SMS OTP / Zalo ZNS
   */
  public async sendSmsOtp(phone: string, otpCode: string): Promise<any> {
    const res = await this.execute('/v1/telecom/sms-otp-send', { phone, otpCode });
    return res.data.data;
  }
}
