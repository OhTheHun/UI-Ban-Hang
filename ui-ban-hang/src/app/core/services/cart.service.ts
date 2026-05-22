import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items = signal<CartItem[]>([]);

  cartItems = computed(() => this.items());
  totalItems = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  totalPrice = computed(() => this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0));

  isInCart(productId: string) {
    return computed(() => !!this.items().find(item => item.id === productId));
  }

  getItemQuantity(productId: string) {
    return computed(() => this.items().find(item => item.id === productId)?.quantity || 0);
  }

  addToCart(product: any, quantity: number = 1) {
    const productId = product.id || product.productId; // Fallback for ID field names
    
    if (!productId) {
      return;
    }

    this.items.update(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, {
        id: productId,
        name: product.productName || product.name,
        price: product.discountPrice || product.price,
        quantity: quantity,
        image: product.image_Url || product.image
      }];
    });
  }

  removeFromCart(productId: string) {
    this.items.update(prevItems => prevItems.filter(item => item.id !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.items.update(prevItems => 
      prevItems.map(item => item.id === productId ? { ...item, quantity } : item)
    );
  }

  clearCart() {
    this.items.set([]);
  }
}
