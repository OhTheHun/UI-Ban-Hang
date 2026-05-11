import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="popup-backdrop" (click)="onCancel.emit()">
      <div class="popup-window" (click)="$event.stopPropagation()">
        <div class="popup-icon" [ngClass]="type">
          <i [class]="icon"></i>
        </div>
        
        <div class="popup-content">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
        </div>

        <div class="popup-actions">
          <button class="btn-cancel" (click)="onCancel.emit()">{{ cancelText }}</button>
          <button class="btn-confirm" [ngClass]="type" (click)="onConfirm.emit()">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    $primary: #0d47a1;
    $danger: #dc2626;
    $success: #16a34a;
    $text-main: #0f172a;
    $text-sub: #475569;
    $border: #e2e8f0;

    .popup-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
      padding: 20px;
      animation: fadeIn 0.2s ease-out;
    }

    .popup-window {
      background: white;
      width: 100%;
      max-width: 400px;
      border-radius: 20px;
      padding: 32px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .popup-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 20px;
      
      &.danger { background: #fef2f2; color: $danger; }
      &.primary { background: #eff6ff; color: $primary; }
      &.success { background: #f0fdf4; color: $success; }
    }

    .popup-content {
      margin-bottom: 32px;
      h3 { font-size: 1.25rem; font-weight: 800; color: $text-main; margin: 0 0 12px 0; }
      p { font-size: 0.938rem; color: $text-sub; line-height: 1.5; margin: 0; }
    }

    .popup-actions {
      display: flex;
      gap: 12px;
      button { flex: 1; padding: 12px; border-radius: 10px; font-weight: 700; font-size: 0.938rem; cursor: pointer; transition: all 0.2s; }
      .btn-cancel { background: white; border: 1px solid $border; color: $text-main; &:hover { background: #f8fafc; } }
      .btn-confirm {
        border: none; color: white;
        &.danger { background: $danger; &:hover { background: #b91c1c; } }
        &.primary { background: $primary; &:hover { background: #0a3679; } }
        &.success { background: $success; &:hover { background: #15803d; } }
      }
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `]
})
export class ConfirmModalComponent {
  @Input() title = 'Xác nhận';
  @Input() message = 'Bạn có chắc chắn muốn thực hiện hành động này?';
  @Input() icon = 'ph-fill ph-question';
  @Input() type: 'primary' | 'danger' | 'success' = 'primary';
  @Input() confirmText = 'Đồng ý';
  @Input() cancelText = 'Quay lại';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
}
