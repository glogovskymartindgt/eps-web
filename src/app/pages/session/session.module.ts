import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../shared/hazlenut/hazelnut-common';
import { LoginComponent } from './login/login.component';
import { sessionRoutes } from './session-routing.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(sessionRoutes),
    FlexLayoutModule,
    TranslateModule.forChild(),
  ]
})
export class SessionModule { }
