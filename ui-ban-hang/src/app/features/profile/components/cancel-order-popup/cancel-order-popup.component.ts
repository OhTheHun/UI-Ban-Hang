import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cancel-order-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cancel-order-popup.component.html',
  styleUrls: ['./cancel-order-popup.component.scss']
})
export class CancelOrderPopupComponent {
  @Output() onConfirm = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<void>();

  reason = '';
  submitted = false;

  confirm(): void {
    this.submitted = true;

    const value = this.reason.trim();
    if (!value) return;

    this.onConfirm.emit(value);
  }
}
