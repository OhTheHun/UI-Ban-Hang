import { Component, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProductAdminService, ProductAdmin } from '../../services/product-admin.service';

@Component({
  selector: 'app-import-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './import-form.component.html',
  styleUrls: ['./import-form.component.scss']
})
export class ImportFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  importForm: FormGroup;
  products = signal<ProductAdmin[]>([]);
  isLoadingProducts = signal(false);

  constructor(
    private fb: FormBuilder,
    private productAdminService: ProductAdminService
  ) {
    this.importForm = this.fb.group({
      note: [''],
      details: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.addDetail(); // Add one row by default
  }

  loadProducts() {
    this.isLoadingProducts.set(true);
    this.productAdminService.getProducts({}).subscribe({
      next: (res) => {
        this.products.set(res);
        this.isLoadingProducts.set(false);
      },
      error: () => this.isLoadingProducts.set(false)
    });
  }

  get details() {
    return this.importForm.get('details') as FormArray;
  }

  addDetail() {
    const detailGroup = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      importPrice: [0, [Validators.required, Validators.min(0)]],
      totalPrice: [{ value: 0, disabled: true }]
    });
    this.details.push(detailGroup);
  }

  removeDetail(index: number) {
    this.details.removeAt(index);
  }

  calculateRowTotal(index: number) {
    const detail = this.details.at(index);
    const quantity = detail.get('quantity')?.value || 0;
    const price = detail.get('importPrice')?.value || 0;
    const total = quantity * price;
    detail.get('totalPrice')?.setValue(total);
    return total;
  }

  get totalAmount(): number {
    return this.details.controls.reduce((acc, control, index) => {
      const quantity = control.get('quantity')?.value || 0;
      const price = control.get('importPrice')?.value || 0;
      return acc + (quantity * price);
    }, 0);
  }

  onSubmit() {
    if (this.importForm.valid) {
      const rawValue = this.importForm.getRawValue();
      // Loại bỏ totalPrice ảo trước khi gửi API
      const submitData = {
        note: rawValue.note,
        details: rawValue.details.map((d: any) => ({
          productId: d.productId,
          quantity: d.quantity,
          importPrice: d.importPrice
        }))
      };
      this.submitForm.emit(submitData);
    } else {
      this.importForm.markAllAsTouched();
    }
  }

  onClose() {
    this.close.emit();
  }

  onProductChange(index: number) {
    const detail = this.details.at(index);
    const productId = detail.get('productId')?.value;
    if (productId) {
      const p = this.products().find(x => x.id === productId);
      if (p) {
        detail.patchValue({ importPrice: p.price });
        this.calculateRowTotal(index);
      }
    }
  }
}
