import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './pages/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './pages/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth-guard';

/**
 * Menu property in routes for showing screen option in app menu
 */
export const routes: Routes = [
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
                loadChildren: (): any => import('./pages/dashboard/dashboard.module').then((module: any): any => module.DashboardModule),
                data: {
                    title: 'menu.dashboard',
                    icon: 'person',
                    animation: 'dashboard'
                },
                canActivate: [AuthGuard]
            },
            {
                path: 'project',
                loadChildren: (): any => import('./pages/project/project.module').then((module: any): any => module.ProjectModule),
                data: {
                    title: 'menu.project',
                    icon: 'person',
                    menu: true,
                    animation: 'project'
                },
                canActivate: [AuthGuard]
            },
            {
                path: 'action-points',
                loadChildren: (): any => import('./pages/action-points/action-points.module').then((module: any): any => module.ActionPointsModule),
                data: {
                    title: 'menu.actionPoints',
                    icon: 'person',
                    menu: true,
                    animation: 'action-points'
                },
                canActivate: [AuthGuard]
            },
            {
                path: 'guidelines',
                loadChildren: (): any => import('./pages/guidelines/guidelines.module').then((module: any): any => module.GuidelinesModule),
                data: {
                    title: 'menu.guidelines',
                    icon: 'person',
                    menu: true,
                    animation: 'guidelines'
                },
                canActivate: [AuthGuard]
            },
            {
                path: 'tasks',
                loadChildren: (): any => import('./pages/tasks/tasks.module').then((module: any): any => module.TasksModule),
                data: {
                    title: 'menu.tasks',
                    icon: 'person',
                    animation: 'tasks'
                },
                canActivate: [AuthGuard]
            },
            {
                path: 'facts',
                loadChildren: (): any => import('./pages/facts/facts.module').then((module: any): any => module.FactsModule),
                data: {
                    title: 'menu.facts',
                    icon: 'person',
                    menu: true,
                    animation: 'facts'
                },
                canActivate: [AuthGuard]
            },
            {
                path: 'all-facts',
                loadChildren: (): any => import('./pages/facts/facts.module').then((module: any): any => module.FactsModule),
                data: {
                    title: 'menu.allFacts',
                    icon: 'person',
                    menu: true,
                    animation: 'facts'
                },
                canActivate: [AuthGuard]
            },
            {
                path: 'reports',
                loadChildren: (): any => import('./pages/reports/reports.module').then((module: any): any => module.ReportsModule),
                data: {
                    title: 'menu.reports',
                    icon: 'person',
                    menu: false,
                    animation: 'reports'
                },
                canActivate: [AuthGuard]
            },
            {
                path: 'team',
                loadChildren: (): any => import('./pages/team/team.module').then((module: any): any => module.TeamModule),
                data: {
                    title: 'menu.team',
                    icon: 'team',
                    menu: true,
                    animation: 'team'
                },
                canActivate: [AuthGuard]
            },
            {
                path: 'users',
                loadChildren: (): any => import('./pages/users/users.module').then((module: any): any => module.UsersModule),
                data: {
                    title: 'menu.users',
                    icon: 'person',
                    menu: true,
                    animation: 'users',
                    section: 'settings'
                },
                canActivate: [AuthGuard]
            },
            {
                path: 'profile',
                loadChildren: (): any => import('./pages/profile/profile.module').then((module: any): any => module.ProfileModule),
                data: {
                    title: 'menu.profile',
                    icon: 'person',
                    animation: 'profile',
                },
                canActivate: [AuthGuard]
            }
        ],
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'authentication',
                loadChildren: (): any => import('./pages/session/session.module').then((module: any): any => module.SessionModule),
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'authentication',
    },

];
