import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagsEditComponent } from './tags-edit/tags-edit.component';
import { TagsListComponent } from './tags-list/tags-list.component';


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
                component: TagsListComponent,
                data: {title: 'fastItemTypesList'}
            },
            {
                path: 'edit',
                component: TagsEditComponent,
                data: {title: 'fastItemTypesEdit'}
            },
        ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagsRoutingModule { }
