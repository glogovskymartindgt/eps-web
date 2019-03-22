import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactCreateComponent } from './fact-create/fact-create.component';
import { FactListComponent } from './fact-list/fact-list.component';

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
                component: FactListComponent,
                data: {title: 'factList'}
            },
            {
                path: 'create',
                component: FactCreateComponent,
                data: {title: 'factCreate'}
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FactsRoutingModule {
}
