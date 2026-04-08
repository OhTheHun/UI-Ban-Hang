import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero.component';
import { CategoriesComponent } from './components/categories.component';
import { FeaturedProductsComponent } from './components/featured-products.component';
import { FeaturesComponent } from './components/features.component';
import { FlashSaleComponent } from './components/flash-sale.component';
import { TestimonialsComponent } from './components/testimonials.component';
import { BlogComponent } from './components/blog.component';
import { NewsletterComponent } from './components/newsletter.component';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    CategoriesComponent,
    FeaturedProductsComponent,
    FeaturesComponent,
    FlashSaleComponent,
    TestimonialsComponent,
    BlogComponent,
    NewsletterComponent
  ],
  template: `
    <app-hero></app-hero>
    <app-categories></app-categories>
    <app-featured-products></app-featured-products>
    <app-features></app-features>
    <app-flash-sale [flashSaleProducts]="flashSaleProducts()"></app-flash-sale>
    <app-testimonials></app-testimonials>
    <app-blog></app-blog>
    <app-newsletter></app-newsletter>
  `,
})
export class HomeComponent {
  categories = signal<Category[]>([
    {
      id: 1,
      name: 'Khô Gà',
      icon: '🍗',
      description: 'Thịt gà khô thơm ngon'
    },
    {
      id: 2,
      name: 'Khô Bò',
      icon: '🥩',
      description: 'Thịt bò khô chất lượng cao'
    },
    {
      id: 3,
      name: 'Cơm Cháy',
      icon: '🍘',
      description: 'Cơm cháy giòn rụm'
    },
    {
      id: 4,
      name: 'Quần Áo',
      icon: '👔',
      description: 'Quần áo chất lượng'
    }
  ]);

  products = signal<Product[]>([
    // Khô Gà
    {
      id: 1,
      name: 'Khô Gà Vị Cay',
      category: 'Khô Gà',
      price: 89000,
      originalPrice: 120000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Khô+Gà+Cay',
      rating: 4.8,
      reviews: 245
    },
    {
      id: 2,
      name: 'Khô Gà Nướp',
      category: 'Khô Gà',
      price: 79000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Khô+Gà+Nướp',
      rating: 4.7,
      reviews: 189
    },
    {
      id: 3,
      name: 'Khô Gà Lá Chanh',
      category: 'Khô Gà',
      price: 84000,
      originalPrice: 110000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Khô+Gà+Chanh',
      rating: 4.9,
      reviews: 312
    },
    {
      id: 4,
      name: 'Khô Gà Xốt Chuối',
      category: 'Khô Gà',
      price: 95000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Khô+Gà+Chuối',
      rating: 4.6,
      reviews: 156
    },
    // Khô Bò
    {
      id: 5,
      name: 'Khô Bò Sốt Tiêu',
      category: 'Khô Bò',
      price: 129000,
      originalPrice: 160000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Khô+Bò+Tiêu',
      rating: 4.9,
      reviews: 428
    },
    {
      id: 6,
      name: 'Khô Bò Xà Lách',
      category: 'Khô Bò',
      price: 119000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Khô+Bò+Lách',
      rating: 4.8,
      reviews: 367
    },
    {
      id: 7,
      name: 'Khô Bò Nướu Cay',
      category: 'Khô Bò',
      price: 139000,
      originalPrice: 180000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Khô+Bò+Cay',
      rating: 5,
      reviews: 521
    },
    {
      id: 8,
      name: 'Khô Bò Rơm',
      category: 'Khô Bò',
      price: 109000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Khô+Bò+Rơm',
      rating: 4.7,
      reviews: 234
    },
    // Cơm Cháy
    {
      id: 9,
      name: 'Cơm Cháy Tôm Tít',
      category: 'Cơm Cháy',
      price: 45000,
      originalPrice: 60000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Cơm+Cháy+Tôm',
      rating: 4.6,
      reviews: 298
    },
    {
      id: 10,
      name: 'Cơm Cháy Muối Tôm',
      category: 'Cơm Cháy',
      price: 39000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Cơm+Cháy+Muối',
      rating: 4.5,
      reviews: 145
    },
    {
      id: 11,
      name: 'Cơm Cháy Rau Ngoài',
      category: 'Cơm Cháy',
      price: 42000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Cơm+Cháy+Rau',
      rating: 4.7,
      reviews: 267
    },
    {
      id: 12,
      name: 'Cơm Cháy Cá Mặn',
      category: 'Cơm Cháy',
      price: 48000,
      originalPrice: 65000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Cơm+Cháy+Cá',
      rating: 4.8,
      reviews: 401
    },
    // Quần Áo
    {
      id: 13,
      name: 'Áo Thun Nam Premium',
      category: 'Quần Áo',
      price: 159000,
      originalPrice: 210000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Áo+Thun+Nam',
      rating: 4.7,
      reviews: 523
    },
    {
      id: 14,
      name: 'Áo Thun Nữ Tay Lỡ',
      category: 'Quần Áo',
      price: 145000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Áo+Nữ+Tay+Lỡ',
      rating: 4.8,
      reviews: 678
    },
    {
      id: 15,
      name: 'Quần Jean Nam',
      category: 'Quần Áo',
      price: 289000,
      originalPrice: 380000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Quần+Jean+Nam',
      rating: 4.9,
      reviews: 892
    },
    {
      id: 16,
      name: 'Váy Nữ Xếp Ly',
      category: 'Quần Áo',
      price: 229000,
      image: 'https://via.placeholder.com/300x300/ffca28/ffffff?text=Váy+Nữ+Ly',
      rating: 4.6,
      reviews: 445
    }
  ]);

  testimonials = signal([
    {
      id: 1,
      name: 'Nguyễn Thị Hương',
      avatar: 'https://via.placeholder.com/60x60/0d47a1/ffffff?text=NTH',
      text: 'Sản phẩm chất lượng, giá cả hợp lý. Mình đã mua nhiều lần rồi, luôn hài lòng!',
      rating: 5
    },
    {
      id: 2,
      name: 'Trần Minh Tuấn',
      avatar: 'https://via.placeholder.com/60x60/0d47a1/ffffff?text=TMT',
      text: 'Giao hàng nhanh, đóng gói cẩn thận. MABIXI làm ơn tiếp tục phục vụ nhé!',
      rating: 5
    },
    {
      id: 3,
      name: 'Hoàng Linh Chi',
      avatar: 'https://via.placeholder.com/60x60/0d47a1/ffffff?text=HLC',
      text: 'Khô thịt ngon lắm, nhân viên tư vấn rất nhiệt tình. Sẽ ủng hộ đài!',
      rating: 4.5
    }
  ]);

  blogPosts = signal([
    {
      id: 1,
      title: 'Cách chọn khô thịt chất lượng',
      excerpt: 'Hướng dẫn chi tiết cách chọn khô gà, khô bò tươi ngon, đảm bảo vệ sinh...',
      image: 'https://via.placeholder.com/400x250/ffca28/ffffff?text=Blog+1',
      date: '15/03/2025',
      category: 'Tips'
    },
    {
      id: 2,
      title: 'Cách bảo quản khô đồ lâu dài',
      excerpt: 'Những mẹo giữ khô thịt luôn tươi ngon, giòn rụm trong mùa hè...',
      image: 'https://via.placeholder.com/400x250/ffca28/ffffff?text=Blog+2',
      date: '12/03/2025',
      category: 'Bảo quản'
    },
    {
      id: 3,
      title: 'Xu hướng thời trang Việt Nam 2025',
      excerpt: 'Những bộ đồ trendy, thoải mái phù hợp với thời tiết Việt Nam...',
      image: 'https://via.placeholder.com/400x250/ffca28/ffffff?text=Blog+3',
      date: '08/03/2025',
      category: 'Thời trang'
    }
  ]);

  features = signal([
    {
      id: 1,
      title: 'Chất Lượng Cao',
      description: 'Sản phẩm kiểm định, đảm bảo vệ sinh an toàn thực phẩm',
      icon: '✓'
    },
    {
      id: 2,
      title: 'Giao Hàng Nhanh',
      description: 'Giao trong vòng 24-48h, toàn quốc',
      icon: '⚡'
    },
    {
      id: 3,
      title: 'Giá Cạnh Tranh',
      description: 'Giá tốt nhất, thường xuyên có khuyến mãi',
      icon: '💰'
    },
    {
      id: 4,
      title: 'Hỗ Trợ 24/7',
      description: 'Tư vấn, hỗ trợ khách hàng mọi lúc',
      icon: '📞'
    }
  ]);

  featuredProducts = computed(() => this.products().slice(0, 8));
  flashSaleProducts = computed(() => this.products().filter(p => p.category === 'Quần Áo').slice(0, 4));

  getRenderStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getDiscountPercent(price: number, originalPrice: number): number {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }
}