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

    /** LOAD USER */
    this.userService.currentUser$.subscribe(user => {
      this.user = user;
    });

    // Load user from localStorage if exists
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }

    /** LISTEN FOR CART COUNT CHANGES */
    this.cartService.cartCount.subscribe(count => {
      this.cartCount = count;
    });

    /** LOAD INITIAL CART COUNT */
    this.loadCartCount();
  }

  loadCartCount() {
    const user = this.userService.getCurrentUser();
    if (!user) return;

    this.cartService.getCart(user.id).subscribe({
      next: (res: any) => {
        this.cartService.setCartCount(res.items.length);
      },
      error: () => console.warn("Cart load failed.")
    });
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation(); // جلوگیری از بسته شدن فوری
    this.menuOpen = !this.menuOpen;
  }

  logout(event?: MouseEvent): void {
    event?.preventDefault();

    this.userService.logout();
    localStorage.removeItem('user');

    this.user = null;
    this.menuOpen = false;

    this.router.navigate(['/']);
  }

  /** CLOSE DROPDOWN WHEN CLICK OUTSIDE */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.menuOpen && !this.el.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }
}
