import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
    TableChangeEvent,
    TableColumn,
    TableColumnFilter,
    TableConfiguration
} from '../../../shared/hazlenut/core-table';
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';
import { User } from '../../../shared/interfaces/user.interface';
import { UsersService } from '../../../shared/services/data/users.service';

@Component({
    selector: 'iihf-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

    public config: TableConfiguration;
    public data: BrowseResponse<User> = new BrowseResponse<User>();

    public constructor(private readonly usersService: UsersService,
                       private readonly translateService: TranslateService) {
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
