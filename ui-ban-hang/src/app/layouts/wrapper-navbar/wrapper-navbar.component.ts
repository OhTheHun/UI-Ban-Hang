import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubNavbarComponent } from '../sub-navbar/sub-navbar.component';
import { AddAddressComponent } from '../../shared/add-address/add-address.component';
import { AccountDropdownComponent } from '../../shared/account-dropdown/account-dropdown.component';
import { ShoppingCartDropdownComponent } from '../../shared/shopping-cart-dropdown/shopping-cart-dropdown.component';

@Component({
  selector: 'header-navbar',
  standalone: true,
  imports: [CommonModule, SubNavbarComponent, AddAddressComponent, AccountDropdownComponent, ShoppingCartDropdownComponent],
  templateUrl: './wrapper-navbar.component.html',
  styleUrl: './wrapper-navbar.component.scss'
})
export class NavbarComponent {
  isAddressModalOpen = false;
  currentAddress = 'Khu B, Khu đô thị An Phú An Khánh';

  openAddressModal() {
    this.isAddressModalOpen = true;
  }

  closeAddressModal() {
    this.isAddressModalOpen = false;
  }

  onAddressSubmit(data: { province: string; district: string; ward: string; address: string }) {
    // Cập nhật địa chỉ hiện tại dựa trên dữ liệu từ modal
    this.currentAddress = `${data.address}, ${data.ward}, ${data.district}, ${data.province}`;
    this.closeAddressModal();
  }

  onLogin() {
    console.log('Navigate to login page');
  }

  onSignup() {
    console.log('Navigate to signup page');
  }

  onLogout() {
    console.log('Logout user');
  }

  onProfile() {
    console.log('Navigate to profile page');
  }
}