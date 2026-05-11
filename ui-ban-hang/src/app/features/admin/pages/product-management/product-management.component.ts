import { Component, signal, computed, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductAdminService, ProductAdmin } from '../../services/product-admin.service';
import { LookupService, CategoryLookup, DonViTinhLookup, SupplierLookup } from '../../services/lookup.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  searchQuery = '';
  categoryFilter = 'all';
  statusFilter = 'all';
  sortBy = 'name';

  // State
  products = signal<ProductAdmin[]>([]);
  categories = signal<CategoryLookup[]>([]);
  units = signal<DonViTinhLookup[]>([]);
  suppliers = signal<SupplierLookup[]>([]);
  isLoading = signal(false);
  isAdmin = computed(() => this.authService.currentUser()?.role === 'Admin');

  // Modals
  selectedProduct = signal<ProductAdmin | null>(null);
  showAddModal = signal(false);
  isEditMode = signal(false);
  showDeleteConfirm = signal(false);
  productToDelete = signal<ProductAdmin | null>(null);
  addProductForm: FormGroup;

  // Dropdown Action
  activeDropdownId: string | null = null;
  dropdownPosition = { top: '0px', left: '0px' };

  constructor(
    private productAdminService: ProductAdminService,
    private lookupService: LookupService,
    private toastService: ToastService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.addProductForm = this.fb.group({
      productName: ['', Validators.required],
      sku: ['', Validators.required],
      categoryId: ['', Validators.required],
      supplierId: ['', Validators.required],
      donViTinhId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPrice: [0, [Validators.required, Validators.min(0)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      imageUrl: [''],
      status: [2] // Default Active (based on user info: Active = 2)
    });
  }

  ngOnInit() {
    this.fetchInitialData();
    this.fetchProducts();
  }

  fetchInitialData() {
    this.lookupService.getCategories().subscribe((res: CategoryLookup[]) => this.categories.set(res));
    this.lookupService.getDonViTinhs().subscribe((res: DonViTinhLookup[]) => this.units.set(res));
    this.lookupService.getSuppliers().subscribe((res: SupplierLookup[]) => this.suppliers.set(res));
  }

  fetchProducts() {
    this.isLoading.set(true);
    const params = {
      keyword: this.searchQuery || undefined,
      categoryId: this.categoryFilter !== 'all' ? this.categoryFilter : undefined,
      status: this.statusFilter !== 'all' ? +this.statusFilter : undefined
    };

    this.productAdminService.getProducts(params).subscribe({
      next: (res) => {
        this.products.set(res);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch() {
    this.fetchProducts();
  }

  filteredProducts = computed(() => {
    const prods = this.products();
    if (!Array.isArray(prods)) return [];

    let result = [...prods];

    return result.sort((a, b) => {
      if (this.sortBy === 'name') return a.productName.localeCompare(b.productName);
      if (this.sortBy === 'price_asc') return a.price - b.price;
      if (this.sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });
  });

  // Modals
  viewProduct(product: ProductAdmin) {
    this.selectedProduct.set(product);
    this.activeDropdownId = null;
  }

  closeProduct() {
    this.selectedProduct.set(null);
  }

  openAddModal() {
    if (!this.isAdmin()) return;
    this.isEditMode.set(false);
    this.showAddModal.set(true);
  }

  openEditModal(product: ProductAdmin) {
    if (!this.isAdmin()) return;
    this.isEditMode.set(true);
    this.selectedProduct.set(product);
    this.addProductForm.patchValue({
      productName: product.productName,
      sku: product.sku,
      categoryId: product.categoryId,
      supplierId: product.supplierId,
      donViTinhId: product.donViTinhId,
      price: product.price,
      discountPrice: product.discountPrice,
      cost: product.cost,
      description: product.description,
      imageUrl: product.imageUrl,
      status: product.status
    });
    this.showAddModal.set(true);
    this.activeDropdownId = null;
  }

  closeAddModal() {
    this.showAddModal.set(false);
    this.addProductForm.reset({ status: 2, price: 0, discountPrice: 0, cost: 0 });
    if (this.isEditMode()) {
      this.selectedProduct.set(null);
    }
  }

  submitAddProduct() {
    if (!this.isAdmin()) return;
    if (this.addProductForm.valid) {
      const productData = this.addProductForm.value;

      if (this.isEditMode()) {
        const id = this.selectedProduct()?.id;
        if (id) {
          this.productAdminService.updateProduct({ ...productData, id }).subscribe({
            next: () => {
              this.toastService.success('Cập nhật sản phẩm thành công');
              this.fetchProducts();
              this.closeAddModal();
            },
            error: (err) => {
              this.toastService.error('Lỗi khi cập nhật sản phẩm');
              console.error('Error updating product:', err);
            }
          });
        }
      } else {
        this.productAdminService.addProduct(productData).subscribe({
          next: () => {
            this.toastService.success('Thêm sản phẩm thành công');
            this.fetchProducts();
            this.closeAddModal();
          },
          error: (err) => {
            this.toastService.error('Lỗi khi thêm sản phẩm');
            console.error('Error adding product:', err);
          }
        });
      }
    }
  }

  deleteProduct(product: ProductAdmin) {
    if (!this.isAdmin()) return;
    this.productToDelete.set(product);
    this.showDeleteConfirm.set(true);
    this.activeDropdownId = null;
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm.set(false);
    this.productToDelete.set(null);
  }

  confirmDelete() {
    const product = this.productToDelete();
    if (product) {
      this.productAdminService.deleteProduct(product.id).subscribe({
        next: () => {
          this.toastService.success('Xóa sản phẩm thành công');
          this.fetchProducts();
          this.closeDeleteConfirm();
        },
        error: (err) => {
          this.toastService.error('Lỗi khi xóa sản phẩm');
          console.error('Error deleting product:', err);
        }
      });
    }
  }

  // Action Dropdown
  toggleDropdown(event: MouseEvent, productId: string) {
    event.stopPropagation();
    if (this.activeDropdownId === productId) {
      this.activeDropdownId = null;
    } else {
      this.activeDropdownId = productId;
      this.updateDropdownPosition(event);
    }
  }

  updateDropdownPosition(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    this.dropdownPosition = {
      top: `${rect.bottom + window.scrollY + 5}px`,
      left: `${rect.left + window.scrollX - 120}px`
    };
  }

  @HostListener('document:click')
  hostClick() {
    this.activeDropdownId = null;
  }

  get activeProduct(): ProductAdmin | undefined {
    return this.products().find(p => p.id === this.activeDropdownId);
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Bản nháp';
      case 1: return 'Hết hàng';
      case 2: return 'Đang bán';
      case 3: return 'Ngừng bán';
      default: return 'Không xác định';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 2: return 'status-active';
      case 1: return 'status-outofstock';
      case 0: return 'status-draft';
      case 3: return 'status-inactive';
      default: return 'status-default';
    }
  }

  getCategoryName(id: string): string {
    return this.categories().find(c => c.id === id)?.tenDanhMuc || 'N/A';
  }
}

