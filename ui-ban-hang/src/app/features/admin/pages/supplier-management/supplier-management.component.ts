import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierDTO } from '../../models/supplier.dto';
import { SupplierAdminService } from '../../services/supplier-admin.service';

@Component({
  selector: 'app-supplier-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supplier-management.component.html',
  styleUrls: ['./supplier-management.component.scss']
})
export class SupplierManagementComponent implements OnInit {
  suppliers: SupplierDTO[] = [];
  isLoading = true;

  constructor(
    private supplierService: SupplierAdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.isLoading = true;
    this.supplierService.getSuppliers().subscribe({
      next: (res: any) => {
        console.log('Supplier API Response:', res);
        this.suppliers = res.suppliers || res.Suppliers || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Supplier API Error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusLabel(status: string): string {
    return status === 'Active' ? 'Đang hợp tác' : 'Ngừng hợp tác';
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }
}
