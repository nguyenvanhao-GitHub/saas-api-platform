# 🚀 SmartGate SaaS Developer API - Official JavaScript / TypeScript SDK

Thư viện SDK chính thức giúp các lập trình viên kết nối và sử dụng toàn bộ hệ sinh thái **SaaS API Gateway & Metered Billing** chỉ với 1 dòng mã.

---

## 📦 Cài Đặt (Installation)

```bash
npm install @smartgate/saas-sdk
# Hoặc bằng Yarn / PNPM
yarn add @smartgate/saas-sdk
pnpm add @smartgate/saas-sdk
```

---

## ⚡ Hướng Dẫn Sử Dụng Nhanh Trong 1 Phút (Quickstart)

```typescript
import { SmartGateClient } from '@smartgate/saas-sdk';

// 1. Khởi tạo Client với API Key của bạn
const client = new SmartGateClient({
  apiKey: 'sk_live_developer_test_key_888',
  baseUrl: 'http://localhost:3000' // Tùy chọn, mặc định localhost:3000
});

async function main() {
  // 🏢 1. Tra cứu Mã Số Thuế Doanh Nghiệp
  const company = await client.lookupTaxCode('0108999888');
  console.log('Tên công ty:', company.companyName);

  // 🤖 2. Sinh bài viết Marketing bằng AI
  const article = await client.generateAiContent('Chiến lược tối ưu hóa API Gateway');
  console.log('Tiêu đề AI:', article.generatedTitle);

  // 📈 3. Tra cứu Tỷ Giá & Giá Vàng SJC
  const rates = await client.getExchangeRates();
  console.log('Giá vàng SJC:', rates.goldPriceSJC.sellPriceVND);

  // 🚗 4. Tra cứu Phạt Nguội
  const fine = await client.checkTrafficFine('30A-999.88');
  console.log('Trạng thái phạt:', fine.status);

  // 📲 5. Gửi SMS OTP
  const sms = await client.sendSmsOtp('0988776655', '892156');
  console.log('Kết quả gửi SMS:', sms.status);
}

main().catch(console.error);
```
