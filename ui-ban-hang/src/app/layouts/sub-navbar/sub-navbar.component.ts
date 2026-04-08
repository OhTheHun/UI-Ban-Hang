import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesDropdownComponent } from '../../shared/categories-dropdown/categories-dropdown.component';

interface MenuItem {
  label: string;
  href: string;
  active?: boolean;
}

@Component({
  selector: 'app-sub-navbar',
  standalone: true,
  imports: [CommonModule, CategoriesDropdownComponent],
  templateUrl: './sub-navbar.component.html',
  styleUrl: './sub-navbar.component.scss'
})
export class SubNavbarComponent {
  isFilterOpen = false;

  menuItems: MenuItem[] = [
    {
      label: 'Khuyến mãi',
      href: '/promotions',
      active: false
    },
    {
      label: 'Chỉ có tại MABIXI',
      href: '/mabixi-exclusive',
      active: false
    },
    {
      label: 'Tin tức',
      href: '/news',
      active: false
    }
  ];

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  onCategorySelected(category: any) {
    console.log('Category selected:', category);
  }
}
