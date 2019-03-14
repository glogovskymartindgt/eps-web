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

    public ngOnInit() {
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

}
