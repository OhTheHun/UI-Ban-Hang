import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../features/products/services/product.service';
import { Category as ApiCategory } from '../../features/products/models/product.model';

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
  imports: [CommonModule, RouterLink],
  templateUrl: './categories-dropdown.component.html',
  styleUrl: './categories-dropdown.component.scss'
})
export class CategoriesDropdownComponent implements OnInit {
  @Output() categorySelected = new EventEmitter<Category>();

  isOpen = false;
  categories: Category[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getCategories().subscribe({
      next: (apiCategories) => {
        this.categories = apiCategories.map((c) => ({
          id: c.id as any,
          label: c.tenDanhMuc,
          href: `/products?category=${c.id}`,
          description: c.description,
          icon: '' // Unused now
        }));
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

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