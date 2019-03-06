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

    let sth = {
      "status": "UP",
      "details": {
        "db": {
          "status": "UP",
          "details": {
            "database": "PostgreSQL",
            "hello": 1
          }
        },
        "diskSpace": {
          "status": "UP",
          "details": {
            "total": 225020211200,
            "free": 174585724928,
            "threshold": 10485760
          }
        }
      }
    }

    this.data = sth;

    this.http.get(environment.API_ENDPOINT).subscribe((data: any)=>{
      //alert(JSON.stringify(data));
      this.data = data;
    });
    
  }
  
  useLanguage(language: string) {
    this.translate.use(language);
  }

}
