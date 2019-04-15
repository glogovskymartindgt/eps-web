import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { AuthService } from '../../../shared/services/auth.service.ts.service';
import { AppConstants } from '../../../shared/utils/constants';

@Component({
    selector: 'iihf-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [fadeEnterLeave]
})
export class LoginComponent implements OnInit {

    public hidePassword = true;
    public version = AppConstants.version;
    public loginForm: FormGroup;

    public constructor(private readonly router: Router,
                       private readonly formBuilder: FormBuilder,
                       private readonly authService: AuthService) {
    }

    public ngOnInit() {
        // console.log('LOCAL STORAGE');
        // for (let i = 0; i < localStorage.length; i++) {
        //     const key = localStorage.key(i);
        //     const value = localStorage.getItem(key);
        //     console.log(key, value);
        // }
        this.createForm();
    }

    private createForm() {
        this.loginForm = this.formBuilder.group({
            userName: [null, [Validators.required]],
            password: [null, [Validators.required]]
        });
    }

    public get loginFormControls() {
        return this.loginForm.controls;
    }

    public login() {
        if (this.loginForm.invalid) {
            return;
        }
        this.authService.login(this.loginForm.value.userName, this.loginForm.value.password);
    }

}
