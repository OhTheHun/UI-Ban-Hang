import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Category {
  id: number;
  label: string;
  href: string;
  icon: string;
  description?: string;
  featured?: boolean;
}

@Component({
  selector: 'app-categories-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-dropdown.component.html',
  styleUrl: './categories-dropdown.component.scss'
})
export class CategoriesDropdownComponent {
  @Output() categorySelected = new EventEmitter<Category>();

  isOpen = false;

  categories: Category[] = [
    {
      id: 1,
      label: 'Điện thoại',
      href: '/categories/phones',
      icon: '📱',
      description: 'Smartphone mới nhất',
      featured: true
    },
    {
      id: 2,
      label: 'Laptop',
      href: '/categories/laptops',
      icon: '💻',
      description: 'Máy tính xách tay',
      featured: true
    },
    {
      id: 3,
      label: 'Tablet',
      href: '/categories/tablets',
      icon: '📱',
      description: 'Máy tính bảng'
    },
    {
      id: 4,
      label: 'Phụ kiện',
      href: '/categories/accessories',
      icon: '🎧',
      description: 'Phụ kiện công nghệ'
    },
    {
      id: 5,
      label: 'Smartwatch',
      href: '/categories/smartwatches',
      icon: '⌚',
      description: 'Đồng hồ thông minh'
    },
    {
      id: 6,
      label: 'Gaming',
      href: '/categories/gaming',
      icon: '🎮',
      description: 'Thiết bị gaming'
    },
    {
      id: 7,
      label: 'Âm thanh',
      href: '/categories/audio',
      icon: '🔊',
      description: 'Tai nghe, loa'
    },
    {
      id: 8,
      label: 'TV & Màn hình',
      href: '/categories/tvs',
      icon: '📺',
      description: 'Smart TV, màn hình'
    }
  ];

  featuredCategories = this.categories.filter(cat => cat.featured);
  regularCategories = this.categories.filter(cat => !cat.featured);

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  openDropdown() {
    this.isOpen = true;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  onCategoryClick(category: Category) {
    this.categorySelected.emit(category);
    this.closeDropdown();
  }
}