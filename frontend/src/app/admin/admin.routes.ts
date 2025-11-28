import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'customers/:id',
        loadComponent: () =>
          import('./customers/customer-details/customer-details.component')
            .then(m => m.CustomerDetailsComponent)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./categories/categories.component').then(m => m.CategoriesComponent)
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./products/add/add.component').then(m => m.AddProductComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./products/edit/edit-product.component').then(m => m.EditProductComponent)
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./orders/order-details/order-details.component')
            .then(m => m.AdminOrderDetailsComponent)
      },

      {
        path: 'customers',
        loadComponent: () =>
          import('./customers/customers.component').then(m => m.CustomersComponent)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.component').then(m => m.SettingsComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      

    ]
  }
];
