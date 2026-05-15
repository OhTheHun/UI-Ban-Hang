import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImportService } from '../../services/import.service';
import { Import } from '../../models/import.model';
import { ImportFormComponent } from '../../components/import-form/import-form.component';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-import-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ImportFormComponent],
  templateUrl: './import-management.component.html',
  styleUrls: ['./import-management.component.scss']
})
export class ImportManagementComponent implements OnInit {
  imports = signal<Import[]>([]);
  isLoading = signal(false);
  
  // Filters
  fromDate = '';
  toDate = '';
  productName = '';

  showCreateForm = signal(false);

  constructor(
    private importService: ImportService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.fetchImports();
  }

  fetchImports() {
    this.isLoading.set(true);
    const filter = {
      fromDate: this.fromDate || undefined,
      toDate: this.toDate || undefined,
      productName: this.productName || undefined
    };

    this.importService.getImports(filter).subscribe({
      next: (res) => {
        this.imports.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error loading imports:', err);
      }
    });
  }

  onSearch() {
    this.fetchImports();
  }

  openCreateForm() {
    this.showCreateForm.set(true);
  }

  closeCreateForm() {
    this.showCreateForm.set(false);
  }

  handleCreateImport(importData: any) {
    this.importService.createImport(importData).subscribe({
      next: () => {
        this.toastService.success('Tạo phiếu nhập thành công');
        this.closeCreateForm();
        this.fetchImports();
      },
      error: (err) => {
        this.toastService.error('Lỗi khi tạo phiếu nhập');
        console.error('Error creating import:', err);
      }
    });
  }
}
