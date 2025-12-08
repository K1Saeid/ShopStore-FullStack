import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { TopMenuComponent } from "./top-menu/top-menu.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { TopHeaderComponent } from "./top-header/top-header.component";

import { UserService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    RouterLink,
    TopMenuComponent,
    MainMenuComponent,
    TopHeaderComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: any = null;
  menuOpen: boolean = false;
  cartCount: number = 0;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private el: ElementRef,
    private router: Router
  ) {}

  ngOnInit(): void {

    // ⭐ فقط BehaviorSubject را گوش می‌کنیم — دیگر localStorage نمی‌خوانیم
    this.userService.currentUser$.subscribe(user => {
      this.user = user;

      // اگر لاگ‌اوت شده → سبد صفر
      if (!user) {
        this.cartCount = 0;
      }
    });

    // ⭐ هر تغییری در تعداد سبد خرید
    this.cartService.cartCount.subscribe(count => {
      this.cartCount = count;
    });

    // ⭐ اگر کاربر لاگین است → تعداد اولیه سبد را لود کن
    this.loadCartCount();
  }

  loadCartCount() {
    const user = this.userService.getCurrentUser();
    if (!user) return;

    this.cartService.getCart(user.id).subscribe({
      next: (res: any) => {
        const totalQty = res.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0;
        this.cartService.setCartCount(totalQty);
      },
      error: () => console.warn("Cart load failed.")
    });
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  logout(event?: MouseEvent): void {
    event?.preventDefault();

    // از سرویس لاگ‌اوت کن
    this.userService.logout();

    // UI آپدیت شود
    this.user = null;
    this.menuOpen = false;

    // انتقال به صفحه لاگین
    this.router.navigate(['/auth/signin']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.menuOpen && !this.el.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }
}
