import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { CoreTableModule } from '../../shared/hazlenut/core-table';
import { MaterialModule } from '../../shared/hazlenut/hazelnut-common';
import { UserCreateComponent } from './user-create/user-create.component';
import { UsersListComponent } from './users-list/users-list.component';
import { SettingRoutineModule } from './users-routing.module';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserFormComponent } from './user-form/user-form.component';

@NgModule({
  declarations: [UsersListComponent, UserCreateComponent, UserEditComponent, UserFormComponent],
  imports: [
        CommonModule,
        SettingRoutineModule,
        FlexLayoutModule,
        MaterialModule,
        TranslateModule.forChild(),
        CoreTableModule,
    ]
})
export class UsersModule { }
