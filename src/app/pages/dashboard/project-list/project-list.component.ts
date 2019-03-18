import { Component, OnInit } from '@angular/core';
import { ProjectInterface } from 'src/app/shared/interfaces/project.interface';

@Component({
    selector: 'project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss']
})

export class ProjectListComponent implements OnInit {

    public constructor() {
    }

    public allProjects: ProjectInterface[] = [];

    private mockID = 0;

    private mockedProject: ProjectInterface = {
        id: 1,
        name: '2021 IIHF ICE HOCKEY WORLDCHAMPIONSHIP',
        logo: 'https://picsum.photos/76/103',
        country_1: 'Belarus',
        country_2: 'Latvia',
        venue_city_1: 'Minsk',
        venue_city_2: 'Riga',
        state: 'open'
    };

    public ngOnInit() {

        const length = 35;
        for (let i = 0; i < length; i++) {
            this.allProjects.push(this.mockProjectCard());
        }

    }

    private mockProjectCard(): ProjectInterface {

        const newState = (this.mockID % 2 === 0) ? 'open' : 'closed';

        const card: ProjectInterface = {
            id: 1 + this.mockID,
            name: '2021 IIHF ICE HOCKEY WORLDCHAMPIONSHIP' + this.mockID,
            logo: 'https://picsum.photos/76/103',
            country_1: 'Belarus' + this.mockID,
            country_2: 'Latvia' + this.mockID,
            venue_city_1: 'Minsk' + this.mockID,
            venue_city_2: 'Riga' + this.mockID,
            state: newState
        };

        this.mockID++;

        return card;

    }

}
