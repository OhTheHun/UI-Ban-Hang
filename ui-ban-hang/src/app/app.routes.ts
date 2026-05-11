import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { customerGuard } from './core/guards/customer.guard';

export const routes: Routes = [
  {
    path: 'Operations/login',
    loadComponent: () =>
      import('./features/admin/pages/admin-login/admin-login.component')
        .then(m => m.AdminLoginComponent)
  },

  {
    path: 'Operations',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component')
        .then(m => m.AdminLayoutComponent),
    canActivate: [roleGuard],
    data: {
      roles: ['Admin', 'Seller', 'WarehouseManager']
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: {
          roles: ['Admin']
        },
        loadComponent: () =>
          import('./features/admin/pages/dashboard/dashboard.component')
            .then(m => m.AdminDashboardComponent)
      },

      {
        path: 'orders',
        canActivate: [roleGuard],
        data: {
          roles: ['Admin']
        },
        loadComponent: () =>
          import('./features/admin/pages/order-management/order-management.component')
            .then(m => m.OrderManagementComponent)
      },

      {
        path: 'staff',
        canActivate: [roleGuard],
        data: {
          roles: ['Admin']
        },
        loadComponent: () =>
          import('./features/admin/pages/staff-management/staff-management.component')
            .then(m => m.StaffManagementComponent)
      },

      {
        path: 'products',
        canActivate: [roleGuard],
        data: {
          roles: ['Admin', 'Seller', 'WarehouseManager']
        },
        loadComponent: () =>
          import('./features/admin/pages/product-management/product-management.component')
            .then(m => m.ProductManagementComponent)
      },

      {
        path: 'suppliers',
        canActivate: [roleGuard],
        data: {
          roles: ['Admin', 'WarehouseManager']
        },
        loadComponent: () =>
          import('./features/admin/pages/supplier-management/supplier-management.component')
            .then(m => m.SupplierManagementComponent)
      },

      {
        path: 'approvals',
        canActivate: [roleGuard],
        data: {
          roles: ['Seller']
        },
        loadComponent: () =>
          import('./features/admin/pages/order-approval/order-approval.component')
            .then(m => m.OrderApprovalComponent)
      },

      {
        path: 'reports',
        canActivate: [roleGuard],
        data: {
          roles: ['Admin', 'Seller', 'WarehouseManager']
        },
        loadComponent: () =>
          import('./features/admin/pages/dashboard/dashboard.component')
            .then(m => m.AdminDashboardComponent)
      }
    ]
  },

  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component')
        .then(m => m.MainLayoutComponent),
    canActivate: [customerGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component')
            .then(m => m.HomeComponent)
      },

      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/profile/profile.component')
            .then(m => m.ProfileComponent)
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/pages/product-list/product-list.component')
            .then(m => m.ProductListComponent)
      },

      {
        path: 'products/:id',
        loadComponent: () =>
          import('./features/products/pages/product-detail/product-detail.component')
            .then(m => m.ProductDetailComponent)
      },

      {
        path: 'cart',
        loadComponent: () =>
          import('./features/cart/pages/cart/cart.component')
            .then(m => m.CartComponent)
      }
    ]
  },

  {
    path: '',
    loadComponent: () =>
      import('./features/auth/components/auth-layout/auth-layout.component')
        .then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login.page')
            .then(m => m.LoginPageComponent)
      },

      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/signup/signup.page')
            .then(m => m.SignupPageComponent)
      }
    ]
  }
];