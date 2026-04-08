import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.scss'
})
export class AddAddressComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ province: string; district: string; ward: string; address: string }>();

  province = '';
  district = '';
  ward = '';
  address = '';

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    const data = {
      province: this.province,
      district: this.district,
      ward: this.ward,
      address: this.address
    };
    this.submit.emit(data);
    this.resetForm();
  }

  private resetForm() {
    this.province = '';
    this.district = '';
    this.ward = '';
    this.address = '';
  }
}
