import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportListComponent } from './report-list/report-list.component';

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
                component: ReportListComponent,
                data: {title: 'reportList'}
            },
        ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
