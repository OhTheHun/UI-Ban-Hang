import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownService } from '../services/dropdown.service';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-shopping-cart-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart-dropdown.component.html',
  styleUrl: './shopping-cart-dropdown.component.scss'
})
export class ShoppingCartDropdownComponent implements OnInit {
  @Output() cartItemClicked = new EventEmitter<CartItem>();
  @Output() viewCart = new EventEmitter<void>();

  constructor(private elementRef: ElementRef<HTMLElement>, private dropdownService: DropdownService) {}

  ngOnInit() {
    this.dropdownService.dropdownOpen$.subscribe((openedDropdownId: string | null) => {
      if (openedDropdownId !== 'shopping-cart' && this.isOpen) {
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

  cartItems: CartItem[] = [

  ];
  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
  get totalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.dropdownService.openDropdown('shopping-cart');
    }
  }
  onCartItemClick(item: CartItem) {
    this.cartItemClicked.emit(item);
    this.closeDropdown();
  }
  onViewCart() {
    this.viewCart.emit();
    this.closeDropdown();
  }
  onRemoveItem(item: CartItem) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
  }
  closeDropdown() {
    this.isOpen = false;
  }
}