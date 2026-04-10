import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="categories-section">
      <div class="container">
        <h2 class="section-title">Danh Mục Ưa Chuộng</h2>
        <div class="categories-grid">
          <div class="category-card" *ngFor="let category of categories()">
            <div class="category-icon-lg">{{ category.icon }}</div>
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-desc">{{ category.description }}</p>
            <a href="#" class="category-link">Xem Thêm →</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: [
    './home_scss/categories.component.scss',
    './home_scss/sections.scss'
  ]

})
export class CategoriesComponent {
  categories = signal<Category[]>([
    { id: 1, name: 'Khô Gà', icon: '', description: 'Thịt gà khô thơm ngon' },
    { id: 2, name: 'Khô Bò', icon: '', description: 'Thịt bò khô chất lượng cao' },
    { id: 3, name: 'Cơm Cháy', icon: '', description: 'Cơm cháy giòn rụm' },
    { id: 4, name: 'Quần Áo', icon: '', description: 'Quần áo chất lượng' }
  ]);
}
