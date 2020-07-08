import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../shared/components/components.module';
import { AbstractInputsModule } from '../../shared/hazelnut/abstract-inputs';
import { CoreTableModule } from '../../shared/hazelnut/core-table';
import { MaterialModule } from '../../shared/hazelnut/hazelnut-common';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersListComponent } from './users-list/users-list.component';
import { SettingRoutineModule } from './users-routing.module';

@NgModule({
  declarations: [UsersListComponent, UserCreateComponent, UserEditComponent, UserFormComponent],
  imports: [
        CommonModule,
        ComponentsModule,
        SettingRoutineModule,
        FlexLayoutModule,
        MaterialModule,
        TranslateModule.forChild(),
        FormsModule,
        ReactiveFormsModule,
        CoreTableModule,
        AbstractInputsModule,
    ]
})
export class UsersModule { }
