import { Component, signal, computed, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
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
  readonly pageSize = 10;
  currentPage = signal(1);

  // State
  products = signal<ProductAdmin[]>([]);
  categories = signal<CategoryLookup[]>([]);
  units = signal<DonViTinhLookup[]>([]);
  suppliers = signal<SupplierLookup[]>([]);
  isLoading = signal(false);
  isSavingProduct = signal(false);
  productImagePreview = signal('');
  selectedProductImageFile = signal<File | null>(null);
  isAdmin = computed(() => this.authService.currentUser()?.role === 'WareHouseManager');

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
      sku: [''],
      categoryId: ['', Validators.required],
      supplierId: [''],
      donViTinhId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPrice: [0],
      cost: [0],
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
        this.currentPage.set(1);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch() {
    this.currentPage.set(1);
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

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize));
  });

  paginatedProducts = computed(() => {
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;

    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = Math.min(this.currentPage(), total);
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });

  visibleFrom = computed(() => {
    if (!this.filteredProducts().length) return 0;
    return (Math.min(this.currentPage(), this.totalPages()) - 1) * this.pageSize + 1;
  });

  visibleTo = computed(() => {
    return Math.min(
      Math.min(this.currentPage(), this.totalPages()) * this.pageSize,
      this.filteredProducts().length
    );
  });

  goToPage(page: number) {
    const nextPage = Math.min(Math.max(page, 1), this.totalPages());
    this.currentPage.set(nextPage);
    this.activeDropdownId = null;
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage() - 1);
  }

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
    this.selectedProduct.set(null);
    this.resetProductImageState();
    this.addProductForm.reset({ status: 2, price: 0, discountPrice: 0, cost: 0, imageUrl: '' });
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
    this.productImagePreview.set(product.imageUrl || '');
    this.selectedProductImageFile.set(null);
    this.showAddModal.set(true);
    this.activeDropdownId = null;
  }

  closeAddModal() {
    this.showAddModal.set(false);
    this.addProductForm.reset({ status: 2, price: 0, discountPrice: 0, cost: 0 });
    this.resetProductImageState();
    if (this.isEditMode()) {
      this.selectedProduct.set(null);
    }
  }

  submitAddProduct() {
    if (!this.isAdmin()) return;

    if (this.addProductForm.invalid || this.isSavingProduct()) {
      this.addProductForm.markAllAsTouched();
      return;
    }

    const selectedFile = this.selectedProductImageFile();
    this.isSavingProduct.set(true);

    const productData = {
      ...this.addProductForm.getRawValue(),
      imageFile: selectedFile
    };

    const request$ = this.isEditMode()
      ? this.productAdminService.updateProduct({
        ...productData,
        id: this.selectedProduct()?.id
      })
      : this.productAdminService.addProduct(productData);

    request$
      .pipe(finalize(() => this.isSavingProduct.set(false)))
      .subscribe({
        next: () => {
          this.toastService.success(
            this.isEditMode()
              ? 'Cập nhật sản phẩm thành công'
              : 'Thêm sản phẩm thành công'
          );
          this.fetchProducts();
          this.closeAddModal();
        },
        error: (err: unknown) => {
          this.toastService.error(
            this.isEditMode()
              ? 'Lỗi khi cập nhật sản phẩm'
              : 'Lỗi khi thêm sản phẩm'
          );
          console.error('Error saving product:', err);
        }
      });
  }

  onProductImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastService.warning('Vui lòng chọn file hình ảnh');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastService.warning('Hình ảnh không được vượt quá 5MB');
      input.value = '';
      return;
    }

    this.selectedProductImageFile.set(file);
    this.productImagePreview.set(URL.createObjectURL(file));
  }

  removeProductImage() {
    this.selectedProductImageFile.set(null);
    this.productImagePreview.set('');
    this.addProductForm.patchValue({ imageUrl: '' });
  }

  private resetProductImageState() {
    this.selectedProductImageFile.set(null);
    this.productImagePreview.set('');
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
