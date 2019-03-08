import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './pages/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './pages/layouts/auth-layout/auth-layout.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'authentication',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    data: {menu: false},
    children: [
      {
        path: 'tasks',
        loadChildren: './pages/tasks/tasks.module#TasksModule',
        data: {title: 'menu.tasks', icon: 'person', menu: true, animation: 'tasks'},
        // canActivate: [AuthGuard]
      },
  //     {
  //       path: 'admins',
  //       loadChildren: './pages/admins/admins.module#AdminsModule',
  //       data: {title: 'menu.admins', icon: 'perm_identity', menu: true, animation: 'admins'},
  //       canActivate: [AuthGuard]
  //     },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: './pages/session/session.module#SessionModule',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication',
  },

];
