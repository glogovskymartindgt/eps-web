import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import { TranslateService } from '@ngx-translate/core';
import { TRANSLATE } from 'src/app/shared/custom-functions';
import { AuthService } from '../../../shared/services/auth.service.ts.service';

@Component({
  selector: 'iihf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public hidePassword  = true;

  public loginForm: FormGroup;

  public constructor(private readonly router: Router,
                     private readonly formBuilder: FormBuilder,
                     private readonly authService: AuthService) { }

  public ngOnInit() {
    this.createForm();
  }

  private createForm() {
      this.loginForm = this.formBuilder.group({
          loginName: [null, [Validators.required]],
          password: [null, [Validators.required]]
      });
  }

    public get loginFormControls() { return this.loginForm.controls; }

  public login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.value.loginName, this.loginForm.value.password);
  }

}
