import requests
from typing import Dict, Any, Optional
from .exceptions import SmartGateAuthenticationError, SmartGateRateLimitError, SmartGateApiError

class SmartGateClient:
    """
    Client chính thức kết nối hệ sinh thái SmartGate SaaS API
    """
    def __init__(self, api_key: str, base_url: str = "http://localhost:3000", timeout: int = 10):
        if not api_key:
            raise SmartGateAuthenticationError("API Key là bắt buộc. Khởi tạo: SmartGateClient(api_key='sk_live_...')")
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json",
            "User-Agent": "SmartGate-Python-SDK/1.0.0"
        })

    def execute(self, endpoint: str, payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Thực thi gọi Endpoint qua SaaS Gateway có bảo vệ Redis Rate Limit
        """
        url = f"{self.base_url}/api/v1/gateway/execute"
        params = {"endpoint": endpoint}

        try:
            response = self.session.post(url, params=params, json=payload, timeout=self.timeout)
            
            if response.status_code == 401 or response.status_code == 403:
                raise SmartGateAuthenticationError("API Key không hợp lệ hoặc không có quyền truy cập.")
            elif response.status_code == 429:
                raise SmartGateRateLimitError("Lưu lượng gọi API đã vượt quá hạn mức (Rate Limit Exceeded).")
            elif not response.ok:
                try:
                    err_json = response.json()
                    msg = err_json.get("message", response.text)
                except Exception:
                    msg = response.text
                raise SmartGateApiError(response.status_code, msg)

            return response.json()
        except requests.exceptions.RequestException as e:
            raise SmartGateApiError(500, f"Lỗi kết nối mạng đến SmartGate Gateway: {str(e)}")

    def lookup_tax_code(self, tax_code: str = "0108999888") -> Dict[str, Any]:
        """1. 🏢 Tra cứu Mã Số Thuế & Thông tin Doanh Nghiệp Quốc Gia"""
        res = self.execute("/v1/business/tax-lookup", {"taxCode": tax_code})
        return res.get("data", {}).get("data", {})

    def generate_ai_content(self, topic: str) -> Dict[str, Any]:
        """2. 🤖 AI Tạo Nội Dung Marketing & SEO"""
        res = self.execute("/v1/ai/generate-content", {"topic": topic})
        return res.get("data", {}).get("data", {})

    def get_exchange_rates(self) -> Dict[str, Any]:
        """3. 📈 Tra Cứu Tỷ Giá Ngoại Tệ & Giá Vàng SJC Realtime"""
        res = self.execute("/v1/finance/exchange-rates")
        return res.get("data", {}).get("data", {})

    def check_traffic_fine(self, plate_number: str) -> Dict[str, Any]:
        """4. 🚗 Tra Cứu Phạt Nguội Giao Thông Toàn Quốc"""
        res = self.execute("/v1/traffic/traffic-fine-lookup", {"plateNumber": plate_number})
        return res.get("data", {}).get("data", {})

    def send_sms_otp(self, phone: str, otp_code: str) -> Dict[str, Any]:
        """5. 📲 Gửi Tin Nhắn SMS OTP / Zalo ZNS Brandname"""
        res = self.execute("/v1/telecom/sms-otp-send", {"phone": phone, "otpCode": otp_code})
        return res.get("data", {}).get("data", {})
