import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TRANSLATE } from './shared/custom-functions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'iihf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  data;

  status = TRANSLATE('header.status');

  constructor(private translate: TranslateService, private http: HttpClient) {
    translate.setDefaultLang('en');
  }

  ngOnInit(){

    this.http.get(environment.API_ENDPOINT+"actuator/health").subscribe((data: any)=>{
      this.data = data;
    });
    
  }
  
  useLanguage(language: string) {
    this.translate.use(language);
  }

}
