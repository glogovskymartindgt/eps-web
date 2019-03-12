import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TRANSLATE } from 'src/app/shared/custom-functions';

import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'iihf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public hidePassword  = true;

  public loginForm: FormGroup;

  public constructor(private readonly router: Router,
                     private readonly formBuilder: FormBuilder) { }

  ngOnInit() {

    this.createForm();

  }

  private createForm() {

    this.loginForm = this.formBuilder.group({
      loginName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

  }

  get loginFormControls() { return this.loginForm.controls; }

  public login() {

    if (this.loginForm.invalid) {
      return;
    }

    this.router.navigate(['/tasks']);

  }

}
