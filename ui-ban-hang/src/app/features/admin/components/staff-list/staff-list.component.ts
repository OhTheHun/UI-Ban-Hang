import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.scss'
})
export class StaffListComponent {
  @Input({ required: true }) staffList: any[] = [];
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  
  @Output() onPageChange = new EventEmitter<number>();
}
