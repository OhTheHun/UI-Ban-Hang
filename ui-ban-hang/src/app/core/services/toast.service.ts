import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private counter = 0;

  getToasts() {
    return this.toasts;
  }

  show(message: string, type: ToastType = 'success') {
    const id = ++this.counter;
    const toast: Toast = { id, message, type };
    
    this.toasts.update(prev => [...prev, toast]);

    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }

  remove(id: number) {
    this.toasts.update(prev => prev.filter(t => t.id !== id));
  }
}
