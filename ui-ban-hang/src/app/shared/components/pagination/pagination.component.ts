import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  // 🔓 Made public for template access
  readonly totalItemsCount = signal(0);
  readonly pageSizeValue = signal(10);
  readonly currentPageValue = signal(1);

  @Input() set totalItems(value: number) { this.totalItemsCount.set(value); }
  @Input() set pageSize(value: number) { this.pageSizeValue.set(value); }
  @Input() set currentPage(value: number) { this.currentPageValue.set(value); }

  @Output() pageChange = new EventEmitter<number>();

  totalPages = computed(() => Math.max(1, Math.ceil(this.totalItemsCount() / this.pageSizeValue())));
  
  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPageValue();
    const maxVisible = 5;
    
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  onPageClick(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}
