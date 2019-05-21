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

/**
 * Login component
 */
export class LoginComponent implements OnInit {

    public hidePassword = true;
    public version = AppConstants.version;
    public loginForm: FormGroup;

    public constructor(private readonly router: Router,
                       private readonly formBuilder: FormBuilder,
                       private readonly authService: AuthService) {
    }

    public ngOnInit() {
        this.createForm();
    }

    /**
     * Default form setup
     */
    private createForm() {
        this.loginForm = this.formBuilder.group({
            userName: [null, [Validators.required]],
            password: [null, [Validators.required]]
        });
    }

    /**
     * Getter for login form  controls
     */
    public get loginFormControls() {
        return this.loginForm.controls;
    }

    /**
     * Call login in API
     */
    public login() {
        if (this.loginForm.invalid) {
            return;
        }
        this.authService.login(this.loginForm.value.userName, this.loginForm.value.password);
    }

}
