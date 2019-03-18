import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
              private readonly dashboardService: DashboardService) { }

  ngOnInit() {

    this.dashboardService.setSecondaryHeaderContent({ isDashboard: true });

        this.dashboardService.secondaryHeaderNotifier$.subscribe((secondaryHeader: SecondaryHeader)=>{
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

      // this.dashboardService.filterProjects(value)
      //   .subscribe((filteredProjects: ProjectInterface[]) => {
      //     console.log(filteredProjects);
      //     this.allProjects = filteredProjects;
      // });

  }

  public routeToDashboard() {
      this.router.navigate(['dashboard']);
      this.dashboardService.setSecondaryHeaderContent({ isDashboard: true });
  }

}
