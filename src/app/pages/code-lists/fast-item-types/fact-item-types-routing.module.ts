import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactCreateComponent } from '../../facts/fact-create/fact-create.component';
import { FactEditComponent } from '../../facts/fact-edit/fact-edit.component';
import { FastItemTypesCreateComponent } from './fast-item-types-create/fast-item-types-create.component';
import { FastItemTypesEditComponent } from './fast-item-types-edit/fast-item-types-edit.component';
import { FastItemTypesListComponent } from './fast-item-types-list/fast-item-types-list.component';


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
                component: FastItemTypesListComponent,
                data: {title: 'fastItemTypesList'}
            },
            {
                path: 'create',
                component: FastItemTypesCreateComponent,
                data: {title: 'fastItemTypesCreate'}
            },
            {
                path: 'edit',
                component: FastItemTypesEditComponent,
                data: {title: 'fastItemTypesEdit'}
            },
        ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactItemTypesRoutingModule { }
