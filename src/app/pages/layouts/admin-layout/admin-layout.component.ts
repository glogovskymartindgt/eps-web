import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeEnterLeave, moveDown, routeAnimations } from '../../../shared/hazlenut/hazelnut-common/animations';
import { HazelnutConfig } from '../../../shared/hazlenut/hazelnut-common/config/hazelnut-config';
import { NotificationService } from '../../../shared/services/notification.service';
import { AppConstants } from '../../../shared/utils/constants';

@Component({
  selector: 'iihf-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  animations: [fadeEnterLeave, routeAnimations, moveDown],
})
export class AdminLayoutComponent implements OnInit {

  public showVersion = false;
  public version;
  public language = HazelnutConfig.LANGUAGE;

  public constructor(
    public translate: TranslateService,
    public router: Router,
    public notificationService: NotificationService,
  ) {
  }

  public ngOnInit(): void {
    const browserLang: string = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|sk/) ? browserLang : 'sk');
    this.version = AppConstants.version;
  }

  public toggleShowVersion(): void {
    this.showVersion = !this.showVersion;
  }

  public toggleLanguage() {
    this.language = this.language === 'sk' ? 'en' : 'sk';
    this.translate.use(this.language);
    setTimeout(() => {
      // this.notificationService.openInfoNotification('info.translationApply');
    }, 500);
  }

}
