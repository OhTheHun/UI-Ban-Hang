import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  text: string;
  rating: number;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="testimonials">
      <div class="container">
        <h2 class="section-title">Khách Hàng Nói Về MABIXI</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card" *ngFor="let testimonial of testimonials">
            <div class="testimonial-header">
              <img [src]="testimonial.avatar" [alt]="testimonial.name" class="avatar" />
              <div class="testimonial-name">{{ testimonial.name }}</div>
            </div>
            <div class="stars-rating">
              <span class="star" *ngFor="let i of [1,2,3,4,5]">★</span>
            </div>
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './sections.scss'
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [
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
  ];
}
