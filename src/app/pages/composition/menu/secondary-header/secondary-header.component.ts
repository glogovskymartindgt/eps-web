import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { SecondaryHeader } from 'src/app/shared/interfaces/secondary-header.interface';

@Component({
  selector: 'secondary-header',
  templateUrl: './secondary-header.component.html',
  styleUrls: ['./secondary-header.component.scss']
})
export class SecondaryHeaderComponent implements OnInit {

  public dashboardVisible = true;

  public activeFilter: string = "all";

  public secondaryHeaderTitle: string = "";
  
  constructor(private readonly router: Router,
              private readonly dashBoardService: DashboardService) { }

  ngOnInit() {

    this.dashBoardService.setSecondaryHeaderContent({ isDashboard: true });

        this.dashBoardService.secondaryHeaderNotifier$.subscribe((secondaryHeader: SecondaryHeader)=>{
            if (secondaryHeader.isDashboard) {
                this.dashboardVisible = true;
                this.secondaryHeaderTitle = '';
            } else {
                this.secondaryHeaderTitle = secondaryHeader.title;
                this.dashboardVisible = false;
            }
        });
        
  }

  public toggleFilter(value: 'all' | 'open' | 'closed') {
    
    this.activeFilter = (value === 'all') ? 'all' :
                        (value === 'open') ? 'open' :
                        (value === 'closed') ? 'closed' : 'all';

    this.filterProjects(value);

  }

  private filterProjects(value: 'all' | 'open' | 'closed') {

      // this.dashBoardService.filterProjects(value)
      //   .subscribe((filteredProjects: ProjectInterface[]) => {
      //     console.log(filteredProjects);
      //     this.allProjects = filteredProjects;
      // });

  }

  public routeToDashboard() {
      this.router.navigate(['dashboard']);
      this.dashBoardService.setSecondaryHeaderContent({ isDashboard: true });
  }

}
