import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cancel-order-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancel-order-popup.component.html',
  styleUrls: ['./cancel-order-popup.component.scss']
})
export class CancelOrderPopupComponent {
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
}
