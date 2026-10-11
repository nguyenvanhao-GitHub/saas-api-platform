# 🐍 SmartGate SaaS Developer API - Official Python SDK

Thư viện Python SDK chính thức giúp các lập trình viên Python / Data Scientists / AI Engineers kết nối vào nền tảng **SmartGate SaaS API Platform** chỉ với 1 dòng lệnh.

---

## 📦 Cài Đặt (Installation)

```bash
pip install smartgate-saas-sdk
```

---

## ⚡ Hướng Dẫn Sử Dụng Nhanh (Quickstart)

```python
from smartgate import SmartGateClient

# 1. Khởi tạo Client với API Key
client = SmartGateClient(
    api_key="sk_live_developer_test_key_888",
    base_url="http://localhost:3000"
)

# 🏢 1. Tra cứu thông tin Doanh Nghiệp theo Mã Số Thuế
company = client.lookup_tax_code("0108999888")
print(f"Tên công ty: {company['companyName']}")
print(f"Địa chỉ: {company['address']}")

# 🤖 2. Sinh bài viết Marketing bằng AI
ai_result = client.generate_ai_content("Chiến lược kinh doanh SaaS B2B 2026")
print(f"Tiêu đề: {ai_result['generatedTitle']}")

# 📈 3. Tra cứu Tỷ Giá & Giá Vàng SJC Realtime
rates = client.get_exchange_rates()
print(f"Tỷ giá USD/VND: {rates['exchangeRates']['USD_VND']}")
print(f"Giá vàng SJC: {rates['goldPriceSJC']['sellPriceVND']} VNĐ")

# 🚗 4. Tra cứu Phạt Nguội Phương Tiện
fine = client.check_traffic_fine("30A-999.88")
print(f"Trạng thái vi phạm: {fine['status']}")

# 📲 5. Gửi SMS OTP Brandname
sms = client.send_sms_otp(phone="0988776655", otp_code="892156")
print(f"Trạng thái gửi tin: {sms['status']}")
```
