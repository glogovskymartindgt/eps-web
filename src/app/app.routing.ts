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
                path: 'dashboard',
                loadChildren: './pages/dashboard/dashboard.module#DashboardModule',
                data: {title: 'menu.dashboard', icon: 'person', animation: 'dashboard'},
                canActivate: [AuthGuard]
            },
            {
                path: 'business-areas',
                loadChildren: './pages/business-areas/business-areas.module#BusinessAreasModule',
                data: {title: 'menu.businessAreas', icon: 'person', menu: true, animation: 'tasks'},
                canActivate: [AuthGuard]
            },
            {
                path: 'tasks',
                loadChildren: './pages/tasks/tasks.module#TasksModule',
                data: {title: 'menu.tasks', icon: 'person', animation: 'tasks'},
                canActivate: [AuthGuard]
            },
            {
                path: 'facts',
                loadChildren: './pages/facts/facts.module#FactsModule',
                data: {title: 'menu.facts', icon: 'person', menu: true, animation: 'facts'},
                canActivate: [AuthGuard]
            },
            {
                path: 'reports',
                loadChildren: './pages/reports/reports.module#ReportsModule',
                data: {title: 'menu.reports', icon: 'person', menu: true, animation: 'reports'},
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
