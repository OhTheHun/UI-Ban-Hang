import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDTO } from '../../services/user-admin.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent {
  @Input({ required: true }) customers: CustomerDTO[] = [];
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  
  @Output() onPageChange = new EventEmitter<number>();
}
