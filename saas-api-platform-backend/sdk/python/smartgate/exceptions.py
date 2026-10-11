class SmartGateError(Exception):
    """Lớp cơ sở cho toàn bộ lỗi của SmartGate SDK"""
    pass

class SmartGateAuthenticationError(SmartGateError):
    """Ném ra khi API Key không hợp lệ hoặc đã bị khóa"""
    pass

class SmartGateRateLimitError(SmartGateError):
    """Ném ra khi vượt quá giới hạn gọi API (HTTP 429)"""
    pass

class SmartGateApiError(SmartGateError):
    """Lỗi phản hồi từ Gateway API"""
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message
        super().__init__(f"[SmartGate Error {status_code}] {message}")
