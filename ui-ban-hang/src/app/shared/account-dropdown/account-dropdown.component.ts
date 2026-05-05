import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DropdownService } from '../services/dropdown.service';
import { AuthService } from '../../features/auth/services/auth.service';
@Component({
  selector: 'app-account-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-dropdown.component.html',
  styleUrl: './account-dropdown.component.scss'
})
export class AccountDropdownComponent implements OnInit {
  @Output() login = new EventEmitter<void>();
  @Output() signup = new EventEmitter<void>();
  @Output() profile = new EventEmitter<void>();

  isOpen = false;
  isLoggedIn = false;
  currentUser: any = null;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private dropdownService: DropdownService,
    private authService: AuthService
  ) {
    // Reactive update when auth state changes
    effect(() => {
      this.isLoggedIn = this.authService.isLoggedIn();
      this.currentUser = this.authService.currentUser();
    });
  }

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
    this.authService.logout();
    this.closeDropdown();
  }

  onProfile() {
    this.profile.emit();
    this.closeDropdown();
  }
}