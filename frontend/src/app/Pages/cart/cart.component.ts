import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgStyle, NgFor, NgIf , NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [FormsModule, NgFor, NgIf , RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'

})
export class CartComponent {

  cart: any = { items: [] };
  user: any;

  constructor(
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart(this.user.id).subscribe((res: any) => {
      this.cart = res;
      this.cartService.setCartCount(res.items.length);
    });
  }

  increase(item: any) {
    const qty = item.quantity + 1;

    this.cartService.updateQty(item.id, qty).subscribe(() => {
      item.quantity = qty;
      this.updateTotal();
    });
  }

  decrease(item: any) {
    if (item.quantity == 1) return;

    const qty = item.quantity - 1;

    this.cartService.updateQty(item.id, qty).subscribe(() => {
      item.quantity = qty;
      this.updateTotal();
    });
  }

  remove(itemId: number) {
    this.cartService.removeItem(itemId).subscribe(() => {
      this.cart.items = this.cart.items.filter((x: any) => x.id !== itemId);
      this.updateTotal();
      this.cartService.setCartCount(this.cart.items.length);
    });
  }

  clearCart() {
    this.cartService.clearCart(this.user.id).subscribe(() => {
      this.cart.items = [];
      this.updateTotal();
      this.cartService.setCartCount(0);
    });
  }

  updateTotal() {
    this.cart.totalPrice = this.cart.items
      .reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  }
}

