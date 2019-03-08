import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'iihf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public constructor(private readonly router: Router, ) {
  }

  public login(): void {
    this.router.navigate(['/tasks']);
  }

}
