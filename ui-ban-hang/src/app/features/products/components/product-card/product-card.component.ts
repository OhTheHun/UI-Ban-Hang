import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {

  @Input() product!: any;

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  fallbackImage = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

  goToDetail() {
    if (this.product?.id) {
      this.router.navigate(['/products', this.product.id]);
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }

  toggleFavorite() {
    console.log('Toggle favorite', this.product);
  }
}