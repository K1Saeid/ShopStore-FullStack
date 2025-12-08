import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = `${environment.apiBaseUrl}/cart`;

  cartCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  // ============================
  // GET CART
  // ============================
  getCart(userId: number) {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  // ============================
  // ADD TO CART
  // ============================
  addToCart(item: any, callback?: (success: boolean) => void) {
    this.http.post<any>(`${this.apiUrl}/add`, item)
      .subscribe({
        next: (res) => {
          this.cartCount.next(res.cartItemsCount);
          callback?.(true);
        },
        error: () => callback?.(false)
      });
  }

  // ============================
  // UPDATE QUANTITY
  // ============================
  updateQty(itemId: number, qty: number) {
    return this.http.put(`${this.apiUrl}/update-qty/${itemId}/${qty}`, {});
  }

  // ============================
  // REMOVE ITEM
  // ============================
  removeItem(itemId: number) {
    return this.http.delete(`${this.apiUrl}/item/${itemId}`);
  }

  // ============================
  // CLEAR CART (server-side)
  // ============================
  clearCart(userId: number) {
    return this.http.delete(`${this.apiUrl}/clear/${userId}`);
  }

  // ============================
  // CART COUNT
  // ============================
  setCartCount(count: number) {
    this.cartCount.next(count);
  }

  clearCartCount() {
    this.cartCount.next(0);
  }
}
