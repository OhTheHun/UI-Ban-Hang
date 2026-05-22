import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImportService } from '../../services/import.service';
import { Import } from '../../models/import.model';
import { ImportFormComponent } from '../../components/import-form/import-form.component';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../auth/services/auth.service';

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
  approvingImportId = signal<string | null>(null);

  fromDate = '';
  toDate = '';
  productName = '';
  statusFilter: 'all' | 'Pending' | 'Success' = 'all';

  showCreateForm = signal(false);

  constructor(
    private importService: ImportService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchImports();
  }

  fetchImports() {
    this.isLoading.set(true);
    const filter = {
      fromDate: this.fromDate || undefined,
      toDate: this.toDate || undefined,
      productName: this.productName || undefined,
      status: this.statusFilter !== 'all' ? this.statusFilter : undefined
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
    if (!this.canCreateImport()) {
      this.toastService.error('Chỉ quản lý kho mới được tạo phiếu nhập kho');
      return;
    }

    this.showCreateForm.set(true);
  }

  closeCreateForm() {
    this.showCreateForm.set(false);
  }

  canCreateImport(): boolean {
    return this.authService.currentUser()?.role === 'WareHouseManager';
  }

  canApproveImport(): boolean {
    return this.authService.currentUser()?.role === 'Admin';
  }

  getImportId(item: Import): string {
    return item.id || item.importId || '';
  }

  isPending(item: Import): boolean {
    const status = (item.status || '').toString().trim().toLowerCase();
    return status === 'pending' || status === '0' || !status;
  }

  getStatusLabel(status?: string): string {
    const normalized = (status || '').toString().trim().toLowerCase();
    if (normalized === 'success' || normalized === 'succes' || normalized === '1') return 'Success';
    return 'Pending';
  }

  getStatusClass(status?: string): string {
    return this.getStatusLabel(status).toLowerCase();
  }

  approveImport(item: Import): void {
    const importId = this.getImportId(item);
    if (!importId || this.approvingImportId()) return;

    this.approvingImportId.set(importId);

    this.importService.approveImport(importId).subscribe({
      next: () => {
        this.toastService.success('Duyệt phiếu nhập kho thành công');
        this.approvingImportId.set(null);
        this.fetchImports();
      },
      error: (err) => {
        this.toastService.error('Không thể duyệt phiếu nhập kho');
        console.error('Error approving import:', err);
        this.approvingImportId.set(null);
      }
    });
  }

  handleCreateImport(importData: any) {
    if (!this.canCreateImport()) {
      this.toastService.error('Chỉ quản lý kho mới được tạo phiếu nhập kho');
      return;
    }

    this.importService.createImport(importData).subscribe({
      next: () => {
        this.toastService.success('Tạo phiếu nhập kho thành công. Phiếu đang chờ admin duyệt.');
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
