import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Tại Sao Chọn MABIXI?</h2>
        <div class="features-grid">
          <div class="feature-card" *ngFor="let feature of features">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './home_scss/sections.scss'
})
export class FeaturesComponent {
  features: Feature[] = [
    {
      id: 1,
      title: 'Chất Lượng Cao',
      description: 'Sản phẩm kiểm định, đảm bảo vệ sinh an toàn thực phẩm',
      icon: ''
    },
    {
      id: 2,
      title: 'Giao Hàng Nhanh',
      description: 'Giao trong vòng 24-48h, toàn quốc',
      icon: ''
    },
    {
      id: 3,
      title: 'Giá Cạnh Tranh',
      description: 'Giá tốt nhất, thường xuyên có khuyến mãi',
      icon: ''
    },
    {
      id: 4,
      title: 'Hỗ Trợ 24/7',
      description: 'Tư vấn, hỗ trợ khách hàng mọi lúc',
      icon: ''
    }
  ];
}
