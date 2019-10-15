import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {CoreTableModule} from '../../shared/hazlenut/core-table';
import {MaterialModule} from '../../shared/hazlenut/hazelnut-common';
import {SettingRoutineModule} from '../settings/settings-routing.module';
import { UsersListComponent } from './users-list/users-list.component';

@NgModule({
  declarations: [UsersListComponent],
    imports: [
        CommonModule,
        SettingRoutineModule,
        FlexLayoutModule,
        MaterialModule,
        TranslateModule.forChild(),
        CoreTableModule,
    ]
})
export class SettingsModule { }
