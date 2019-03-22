import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessAreaListComponent } from './business-area-list/business-area-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list',
                data: {title: 'businessAreaList'},
            },
            {
                path: 'list',
                component: BusinessAreaListComponent,
                data: {title: 'businessAreaList'},
            },
        ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessAreasRoutingModule { }
