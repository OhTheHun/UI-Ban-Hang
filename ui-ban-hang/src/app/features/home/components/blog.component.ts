import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="blog-section">
      <div class="container">
        <h2 class="section-title">Bài Viết & Tin Tức</h2>
        <div class="blog-grid">
          <article class="blog-card" *ngFor="let post of blogPosts">
            <!-- <img [src]="post.image" [alt]="post.title" class="blog-image" /> -->
            <div class="blog-content">
              <span class="blog-category">{{ post.category }}</span>
              <h3 class="blog-title">{{ post.title }}</h3>
              <p class="blog-excerpt">{{ post.excerpt }}</p>
              <div class="blog-footer">
                <span class="blog-date">{{ post.date }}</span>
                <a href="#" class="blog-link">Đọc Thêm →</a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
  styleUrl: './home_scss/sections.scss'
})
export class BlogComponent {
  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Cách chọn khô thịt chất lượng',
      excerpt: 'Hướng dẫn chi tiết cách chọn khô gà, khô bò tươi ngon, đảm bảo vệ sinh...',
      image: 'https://placehold.jp/400x250.png?text=Blog',
      date: '15/03/2025',
      category: 'Tips'
    },
    {
      id: 2,
      title: 'Cách bảo quản khô đồ lâu dài',
      excerpt: 'Những mẹo giữ khô thịt luôn tươi ngon, giòn rụm trong mùa hè...',
      image: 'https://placehold.jp/400x250.png?text=Blog',
      date: '12/03/2025',
      category: 'Bảo quản'
    },
    {
      id: 3,
      title: 'Xu hướng thời trang Việt Nam 2025',
      excerpt: 'Những bộ đồ trendy, thoải mái phù hợp với thời tiết Việt Nam...',
      image: 'https://placehold.jp/400x250.png?text=Blog',
      date: '08/03/2025',
      category: 'Thời trang'
    }
  ];
}
