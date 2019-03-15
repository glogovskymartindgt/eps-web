import { ProjectInterface } from 'src/app/shared/interfaces/user-data.interface';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
    ListItem,
    TableCellType, TableChangeEvent,
    TableColumn,
    TableColumnFilter,
    TableConfiguration,
    TableFilterType
} from '../../../shared/hazlenut/core-table';
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';
import { UsersService } from '../../../shared/services/data/users.service';

export class User {
    public id: number;
    public login: string;
    public firstName: string;
    public lastName: string;
    public password: string;
    public phoneNumber: string;
    public email: string;
    public nickName: string;
    public profilePicture: string;
    public state: string;
    public created: string;
}

@Component({
    selector: 'iihf-plan-list',
    templateUrl: './plan-list.component.html',
    styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit {
    public config: TableConfiguration;
    public data: BrowseResponse<User> = new BrowseResponse<User>();

    public constructor(private readonly translateService: TranslateService,
                       private readonly usersService: UsersService) {
    }
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


    public ngOnInit() {

        let length = 35;
        for (let i = 0; i < length; i++) {
            this.allProjects.push(this.mockProjectCard());
        }


        this.config = {
            columns: [
                new TableColumn({
                    columnDef: 'firstName',
                    label: this.translateService.instant('user.firstName'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'lastName',
                    label: this.translateService.instant('user.lastName'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'email',
                    label: this.translateService.instant('user.email'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'phoneNumber',
                    label: this.translateService.instant('user.phoneNumber'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
            ],
            paging: true,
        };
    }

    public setTableData(tableChangeEvent?: TableChangeEvent): void {
        this.usersService.browseUsers(tableChangeEvent).subscribe((data) => {
            this.data = data;
        }, () => {
            console.log('error');
        });
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
