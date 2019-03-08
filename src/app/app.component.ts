import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { TRANSLATE } from './shared/custom-functions';

@Component({
  selector: 'iihf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  public data;

  public status = TRANSLATE('header.status');

  public constructor(private translate: TranslateService, private http: HttpClient) {
    translate.setDefaultLang('en');
  }

  public ngOnInit(){

    // this.http.get(environment.API_ENDPOINT+"actuator/health").subscribe((data: any)=>{
    //   this.data = data;
    // });

  }

  public useLanguage(language: string) {
    this.translate.use(language);
  }

}
