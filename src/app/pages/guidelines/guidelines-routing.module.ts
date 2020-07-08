import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuidelineCreateComponent } from './guideline-detail/guideline-create.component';
import { GuidelineListComponent } from './guideline-list/guideline-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list',
            },
            {
                path: 'list',
                component: GuidelineListComponent,
                data: {title: 'guidelineList'}
            },
            {
                path: 'create',
                component: GuidelineCreateComponent,
                data: {title: 'guidelineCreate'}
            },
            {
                path: 'edit',
                component: GuidelineCreateComponent,
                data: {title: 'guidelineEdit'}
            }
        ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuidelinesRoutingModule { }
