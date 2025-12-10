import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
    
  private apiUrl = `${environment.apiBaseUrl}/cart`;

  
  constructor(private http: HttpClient) { }

  getCart(userId: number) {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  addToCart(item: any, callback?: (success: boolean) => void) {
    this.http.post<any>(`${environment.apiBaseUrl}/Cart/add`, item)
      .subscribe({
        next: (res) => {
          this.cartCount.next(res.cartItemsCount); 
                    callback?.(true);
        },
        error: () => callback?.(false)
      });
  }



  refreshCartCount(userId: number) {
    this.getCart(userId).subscribe((cart: any) => {
      const totalQty = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      this.cartCount.next(totalQty);
    });
  }



  updateQty(itemId: number, qty: number) {
    return this.http.put(`${this.apiUrl}/update-qty/${itemId}/${qty}`, { withCredentials: true }, {});
  }

  removeItem(itemId: number) {
    return this.http.delete(`${this.apiUrl}/item/${itemId}` , { withCredentials: true });
  }

  clearCart(userId: number) {
    return this.http.delete(`${this.apiUrl}/clear/${userId}` , { withCredentials: true });
  }
 
 cartCount = new BehaviorSubject<number>(0);
setCartCount(count: number) {
  this.cartCount.next(count);
}

}
