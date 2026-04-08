import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownService } from '../services/dropdown.service';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

@Component({
  selector: 'app-account-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-dropdown.component.html',
  styleUrl: './account-dropdown.component.scss'
})
export class AccountDropdownComponent implements OnInit {
  @Output() login = new EventEmitter<void>();
  @Output() signup = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() profile = new EventEmitter<void>();

  constructor(private elementRef: ElementRef<HTMLElement>, private dropdownService: DropdownService) {}

  ngOnInit() {
    this.dropdownService.dropdownOpen$.subscribe((openedDropdownId: string | null) => {
      if (openedDropdownId !== 'account' && this.isOpen) {
        this.closeDropdown();
      }
    });
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null) {
    if (target && target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.closeDropdown();
    }
  }

  isOpen = false;
  // Mock authentication state - thay thế bằng service thực tế
  isLoggedIn = false; // Thay đổi để test trạng thái khác nhau

  currentUser: User | null = this.isLoggedIn ? {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    avatar: 'https://via.placeholder.com/40x40/0d47a1/ffffff?text=NV'
  } : null;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.dropdownService.openDropdown('account');
    }
  }

  openDropdown() {
    this.isOpen = true;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  onLogin() {
    this.login.emit();
    this.closeDropdown();
  }

  onSignup() {
    this.signup.emit();
    this.closeDropdown();
  }

  onLogout() {
    this.logout.emit();
    this.closeDropdown();
  }

  onProfile() {
    this.profile.emit();
    this.closeDropdown();
  }
}