import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../shared/services/auth.service.ts.service';

// import { TRANSLATE } from 'src/app/shared/custom-functions';

@Component({
    selector: 'iihf-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public hide = true;

    public loginForm: FormGroup;

    // public sth = TRANSLATE('login.login');

    public constructor(
        private readonly router: Router,
        private fb: FormBuilder,
        private translate: TranslateService,
        private readonly authService: AuthService
    ) {
    }

    public ngOnInit() {
        this.createForm();
    }

    private createForm() {
        this.loginForm = this.fb.group({
            email: [null, [Validators.required]],
            password: [null, [Validators.required]]
        });
    }

    public get f() {
        return this.loginForm.controls;
    }

    public getErrorMessage(value: 'email' | 'password') {
        if (value === 'email') {
            return this.f.email.hasError('required') ? 'You must enter a value' :
                this.f.email.hasError('email') ? 'Not a valid email' : '';
        } else if (value === 'password') {
            return 'Password is required';
            // return TRANSLATE('login.login');
        }
    }

    public login() {
        if (this.loginForm.invalid) {
            return;
        }
        this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
    }

}
