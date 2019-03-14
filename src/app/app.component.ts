import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'iihf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  public constructor(private translate: TranslateService, private http: HttpClient) {
    translate.setDefaultLang('en');
  }

  public ngOnInit(){ }

  public useLanguage(language: string) {
    this.translate.use(language);
  }

}
