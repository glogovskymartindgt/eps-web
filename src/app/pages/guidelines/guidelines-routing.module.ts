import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from '../../shared/enums/role.enum';
import { RouteNames } from '../../shared/enums/route-names.enum';
import { ChildrenRouteGuard } from '../../shared/services/children-route-guard';
import { GuidelineCreateComponent } from './guideline-detail/guideline-create.component';
import { GuidelineEditComponent } from './guideline-detail/guideline-edit.component';
import { GuidelineListComponent } from './guideline-list/guideline-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: RouteNames.LIST,
            },
            {
                path: RouteNames.LIST,
                component: GuidelineListComponent,
                data: {title: 'guidelineList'}
            },
            {
                path: RouteNames.CREATE,
                component: GuidelineCreateComponent,
                data: {
                    title: 'guidelineCreate',
                    roles: Role.RoleCreateGuideline,
                    redirectTo: [RouteNames.GUIDELINES, RouteNames.LIST],
                },
                canActivate: [ChildrenRouteGuard],
            },
            {
                path: `${RouteNames.EDIT}/:id`,
                component: GuidelineEditComponent,
                data: {
                    title: 'guidelineEdit',
                    roles: [Role.RoleUpdateGuideline, Role.RoleReadGuideline, Role.RoleReadGuidelineInAssignProject],
                    redirectTo: [RouteNames.GUIDELINES, RouteNames.LIST],
                },
                canActivate: [ChildrenRouteGuard],
            }
        ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuidelinesRoutingModule { }
