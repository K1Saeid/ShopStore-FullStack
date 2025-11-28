import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../app/app/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from '../app/app/layouts/auth-layout/auth-layout.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { SigninComponent } from './features/auth/signin/signin.component';

export const routes: Routes = [
  // ADMIN PANEL
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.adminRoutes)
  }
,

  // MAIN LAYOUT
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
          import('./checkout/checkout.component').then(m => m.CheckoutComponent)
      },
      {
        path: 'order-success',
        loadComponent: () =>
          import('./Pages/order-success/order-success.component')
            .then(m => m.OrderSuccessComponent)
      },
      {
        path: 'Order/:id',
        loadComponent: () =>
            import('./Pages/order-details/order-details.component')
            .then(m => m.OrderDetailsComponent)
      }


    ]
  },
  // ⭐ ACCOUNT SYSTEM → صحیح‌ترین محل
      {
        path: 'account',
        children: [
          {
            path: 'profile',
            loadComponent: () =>
              import('./account/profile/profile.component')
                .then(m => m.ProfileComponent)
          },
          
        ]
      },
  // AUTH LAYOUT
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'signin', component: SigninComponent },
      { path: 'signup', component: SignupComponent },
      
    ]
  },

  // FALLBACK (must be last!)
  { path: '**', redirectTo: '' }
];
