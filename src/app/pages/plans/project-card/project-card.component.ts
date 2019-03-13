import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'iihf-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {

  @Input() Project: Project;

  constructor() { }

  ngOnInit() {

    this.Project = {
      id: 1,
      name: "2021 IIHF ICE HOCKEY WORLDCHAMPIONSHIP",
      logo: "https://picsum.photos/76/103",
      country_1: "Belarus",
      country_2: "Latvia",
      venue_city_1: "Minsk",
      venue_city_2: "Riga",
      state: "open"
    }

  }

}

interface Project {
  id: number;
  name: string;
  logo: string;
  country_1: string;
  country_2: string;
  venue_city_1: string;
  venue_city_2: string;
  state: string;
}