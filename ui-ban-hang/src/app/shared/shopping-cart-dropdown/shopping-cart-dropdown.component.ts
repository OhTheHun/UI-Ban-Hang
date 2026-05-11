import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DropdownService } from '../services/dropdown.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-shopping-cart-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart-dropdown.component.html',
  styleUrl: './shopping-cart-dropdown.component.scss'
})
export class ShoppingCartDropdownComponent implements OnInit {
  @Output() viewCart = new EventEmitter<void>();

  private cartService = inject(CartService);
  private dropdownService = inject(DropdownService);
  private elementRef = inject(ElementRef<HTMLElement>);
  private router = inject(Router);

  cartItems = this.cartService.cartItems;
  totalItems = this.cartService.totalItems;
  totalPrice = this.cartService.totalPrice;

  isOpen = false;

  ngOnInit() {
    this.dropdownService.dropdownOpen$.subscribe((openedDropdownId: string | null) => {
      if (openedDropdownId !== 'shopping-cart' && this.isOpen) {
        this.isOpen = false;
      }
    });
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null) {
    if (target && target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.dropdownService.openDropdown('shopping-cart');
    }
  }

  onRemoveItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  onViewCart() {
    this.viewCart.emit();
    this.isOpen = false;
    this.router.navigate(['/cart']);
  }
}