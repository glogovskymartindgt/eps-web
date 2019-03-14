import { ProjectInterface } from 'src/app/shared/interfaces/user-data.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'iihf-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit {

  public allProjects: ProjectInterface[] = [];

  private mockID: number = 0;

  private mockedProject: ProjectInterface = {
    id: 1,
    name: "2021 IIHF ICE HOCKEY WORLDCHAMPIONSHIP",
    logo: "https://picsum.photos/76/103",
    country_1: "Belarus",
    country_2: "Latvia",
    venue_city_1: "Minsk",
    venue_city_2: "Riga",
    state: "open"
  };

  constructor() { }

  ngOnInit() {

    let length = 35;
    for (let i = 0; i < length; i++) {
      this.allProjects.push(this.mockProjectCard());
    }

  }

  private mockProjectCard(): ProjectInterface {

    let newState = (this.mockID % 2 === 0) ? 'open' : 'closed';

    let card: ProjectInterface = {
        id: 1 + this.mockID,
        name: "2021 IIHF ICE HOCKEY WORLDCHAMPIONSHIP" + this.mockID,
        logo: "https://picsum.photos/76/103",
        country_1: "Belarus" + this.mockID,
        country_2: "Latvia" + this.mockID,
        venue_city_1: "Minsk" + this.mockID,
        venue_city_2: "Riga" + this.mockID,
        state: newState
    }

    this.mockID++;

    return card;
    
  }

}
