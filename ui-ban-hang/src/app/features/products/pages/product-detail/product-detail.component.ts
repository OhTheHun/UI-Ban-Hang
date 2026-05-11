import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product = signal<any>(null);
  selectedImage = signal<string>('');
  isLoading = signal<boolean>(true);
  
  // Local quantity before adding to cart
  localQuantity = signal<number>(1);

  // Sync with cart
  isInCart = computed(() => {
    const p = this.product();
    return p ? this.cartService.isInCart(p.id)() : false;
  });

  cartQuantity = computed(() => {
    const p = this.product();
    return p ? this.cartService.getItemQuantity(p.id)() : 0;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadProduct(id);
    });
  }

  loadProduct(id: string) {
    this.isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (data: Product) => {
        const mappedProduct = {
          ...data,
          id: id, // Đảm bảo ID từ route luôn được gán vào object (vì API detail có thể không trả về ID)
          images: data.image_Url ? [data.image_Url] : [
            'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
          ]
        };
        this.product.set(mappedProduct);
        this.selectedImage.set(mappedProduct.images[0]);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  updateLocalQty(delta: number) {
    const newQty = this.localQuantity() + delta;
    if (newQty >= 1) this.localQuantity.set(newQty);
  }

  updateCartQty(delta: number) {
    const p = this.product();
    if (p) {
      const current = this.cartService.getItemQuantity(p.id)();
      this.cartService.updateQuantity(p.id, current + delta);
    }
  }

  onAddToCart() {
    if (this.product()) {
      this.cartService.addToCart(this.product(), this.localQuantity());
    }
  }

  onBuyNow() {
    if (!this.isInCart()) {
      this.onAddToCart();
    }
    this.router.navigate(['/cart']);
  }
}
