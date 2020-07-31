import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Role } from '../enums/role.enum';
import { AuthService } from '../services/auth.service';

@Directive({
    selector: '[iihfShowByRole]',
})
export class ShowByRoleDirective {

    private hasView = false;

    public constructor(
        private readonly authService: AuthService,
        private readonly templateRef: TemplateRef<any>,
        private readonly viewContainer: ViewContainerRef,
    ) {
    }

    @Input()
    public set iihfShowByRole(roles: Role[] | Role) {
        const hasRoles: boolean = this.authService.hasRoles(roles);

        if (hasRoles && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        }

        if (!hasRoles && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
        }
    }
}
