import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration: number;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toasts = signal<ToastItem[]>([]);

  show(type: ToastType, message: string, title?: string, duration: number = 4500): void {
    const id = Math.random().toString(36).substring(2, 9);
    const friendlyMessage = this.humanizeMessage(message);
    const friendlyTitle = title || this.getDefaultTitle(type);

    const newToast: ToastItem = { 
      id, 
      type, 
      title: friendlyTitle, 
      message: friendlyMessage, 
      duration,
      createdAt: Date.now()
    };
    
    this.toasts.update(current => [...current, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, title?: string, duration: number = 4000): void {
    this.show('success', message, title, duration);
  }

  error(message: string, title?: string, duration: number = 5500): void {
    this.show('error', message, title, duration);
  }

  info(message: string, title?: string, duration: number = 4000): void {
    this.show('info', message, title, duration);
  }

  warning(message: string, title?: string, duration: number = 5000): void {
    this.show('warning', message, title, duration);
  }

  remove(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }

  private getDefaultTitle(type: ToastType): string {
    switch (type) {
      case 'success': return 'Thành Công';
      case 'error': return 'Thông Báo Lỗi';
      case 'warning': return 'Lưu Ý';
      case 'info': return 'Thông Tin Hệ Thống';
    }
  }

  private humanizeMessage(raw: string): string {
    if (!raw) return 'Đã xử lý yêu cầu thành công.';
    if (typeof raw !== 'string') return JSON.stringify(raw);

    if (raw.includes('Http failure response') || raw.includes('Unknown Error')) {
      return 'Không thể kết nối đến máy chủ Backend. Vui lòng kiểm tra lại dịch vụ đang chạy trên cổng 8080.';
    }
    if (raw.includes('401') || raw.includes('Unauthorized') || raw.includes('Bad credentials')) {
      return 'Thông tin đăng nhập hoặc phiên làm việc không hợp lệ. Vui lòng kiểm tra lại tài khoản hoặc đăng nhập lại.';
    }
    if (raw.includes('403') || raw.includes('Forbidden') || raw.includes('Access Denied')) {
      return 'Bạn không có quyền thực hiện thao tác này trên hệ thống.';
    }
    if (raw.includes('429') || raw.includes('Too Many Requests') || raw.includes('Rate limit exceeded')) {
      return 'Tần suất gửi yêu cầu quá nhanh đã vượt quá hạn mức Rate Limit. Vui lòng thử lại sau giây lát.';
    }
    return raw;
  }
}
