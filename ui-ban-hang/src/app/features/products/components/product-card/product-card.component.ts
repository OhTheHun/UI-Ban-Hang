import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  fallbackImage = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }

  addToCart() {
    console.log('Add to cart', this.product);
  }

  toggleFavorite() {
    console.log('Toggle favorite', this.product);
  }
}