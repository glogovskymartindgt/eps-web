import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeEnterLeave } from '../../../shared/hazelnut/hazelnut-common/animations';
import { AuthService } from '../../../shared/services/auth.service';
import { AppConstants } from '../../../shared/utils/constants';

@Component({
    selector: 'iihf-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [fadeEnterLeave]
})

/**
 * Login component
 */ export class LoginComponent implements OnInit {

    public hidePassword = true;
    public version = AppConstants.version;
    public loginForm: FormGroup;

    public constructor(
        private readonly router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly route: ActivatedRoute) {
    }

    /**
     * Getter for login form controls
     */
    public get loginFormControls(): any {
        return this.loginForm.controls;
    }

    public ngOnInit(): void {
        this.createForm();
    }

    /**
     * Call login in API
     */
    public login(): void | undefined {
        if (this.loginForm.invalid) {
            return;
        }
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
        this.authService.loginBackend(this.loginForm.value.userName, this.loginForm.value.password, returnUrl);
    }

    /**
     * Default form setup
     */
    private createForm(): void {
        this.loginForm = this.formBuilder.group({
            userName: [
                null,
                [Validators.required]
            ],
            password: [
                null,
                [Validators.required]
            ]
        });
    }

}
