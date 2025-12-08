import { Routes } from '@angular/router';

// LAYOUTS
import { MainLayoutComponent } from './app/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './app/layouts/auth-layout/auth-layout.component';

// FEATURES
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { SigninComponent } from './features/auth/signin/signin.component';
import { SignupComponent } from './Pages/signup/signup.component';

export const routes: Routes = [

  // ================== ADMIN ==================
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.adminRoutes)
  },

  // ================== MAIN LAYOUT ==================
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },

      {
        path: 'products',
        loadComponent: () =>
          import('./Core/container/container.component')
            .then(m => m.ContainerComponent)
      },

      { path: 'product/:id', component: ProductDetailComponent },

      {
        path: 'cart',
        loadComponent: () =>
          import('./Pages/cart/cart.component')
            .then(m => m.CartComponent)
      },

      {
        path: 'checkout',
        loadComponent: () =>
          import('./checkout/checkout.component')
            .then(m => m.CheckoutComponent)
      },

      {
        path: 'order-success',
        loadComponent: () =>
          import('./Pages/order-success/order-success.component')
            .then(m => m.OrderSuccessComponent)
      },

      {
        path: 'order/:id',
        loadComponent: () =>
          import('./Pages/order-details/order-details.component')
            .then(m => m.OrderDetailsComponent)
      }
    ]
  },

  // ================== ACCOUNT ==================
  {
    path: 'account',
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./account/profile/profile.component')
            .then(m => m.ProfileComponent)
      }
    ]
  },

  // ================== AUTH LAYOUT ==================
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'signin', component: SigninComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },

  // ================== 404 ==================
  { path: '**', redirectTo: '' }
];
