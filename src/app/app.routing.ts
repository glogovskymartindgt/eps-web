import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './pages/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './pages/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth-guard';

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
        canActivate: [AuthGuard]
      },
      {
        path: 'plans',
        loadChildren: './pages/plans/plans.module#PlansModule',
        data: {title: 'menu.plans', icon: 'person', menu: true, animation: 'plans'},
        canActivate: [AuthGuard]
      },
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
