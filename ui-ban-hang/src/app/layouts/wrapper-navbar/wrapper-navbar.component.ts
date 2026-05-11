import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubNavbarComponent } from '../sub-navbar/sub-navbar.component';
import { AddAddressComponent } from '../../shared/add-address/add-address.component';
import { AccountDropdownComponent } from '../../shared/account-dropdown/account-dropdown.component';
import { ShoppingCartDropdownComponent } from '../../shared/shopping-cart-dropdown/shopping-cart-dropdown.component';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'header-navbar',
  standalone: true,
  imports: [CommonModule, SubNavbarComponent, AddAddressComponent, AccountDropdownComponent, ShoppingCartDropdownComponent],
  templateUrl: './wrapper-navbar.component.html',
  styleUrl: './wrapper-navbar.component.scss'
})
export class NavbarComponent {
  isAddressModalOpen = false;
  isMenuOpen = false;
  
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  currentAddress = 'Khu B, Khu đô thị An Phú An Khánh';

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user && user.address) {
        this.currentAddress = user.address;
      }
    });
  }

  onSearch(keyword: string) {
    if (keyword && keyword.trim()) {
      this.router.navigate(['/products'], { queryParams: { keyword: keyword.trim() } });
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  openAddressModal() {
    this.isAddressModalOpen = true;
  }

  closeAddressModal() {
    this.isAddressModalOpen = false;
  }

  onAddressSubmit(data: { province: string; district: string; ward: string; address: string }) {
    this.currentAddress = `${data.address}, ${data.ward}, ${data.district}, ${data.province}`;
    this.closeAddressModal();
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onSignup() {
    this.router.navigate(['/register']);
  }

  onLogout() {
    this.authService.logout();
  }

  onProfile() {
    this.router.navigate(['/profile']);
  }
}