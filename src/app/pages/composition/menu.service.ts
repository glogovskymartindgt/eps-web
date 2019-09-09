import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MenuService implements OnInit {

  public selectedOptionPath = 'project';

  public constructor(private readonly router: Router) {
  }

  public ngOnInit(): void {
  }

  public setSelectedOption(newSelectedOptionPath): void {
    this.selectedOptionPath = newSelectedOptionPath;
  }

}
