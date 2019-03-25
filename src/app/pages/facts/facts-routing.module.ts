import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactCreateComponent } from './fact-create/fact-create.component';
import { FactEditComponent } from './fact-edit/fact-edit.component';
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
            {
                path: 'edit',
                component: FactEditComponent,
                data: {title: 'factEdit'}
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
