import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
    TableCellType,
    TableChangeEvent,
    TableColumn,
    TableColumnFilter,
    TableConfiguration,
    TableFilterType,
    TableResponse
} from '../../../shared/hazelnut/core-table';
import { BrowseResponse } from '../../../shared/hazelnut/hazelnut-common/models';
import { TableContainer } from '../../../shared/interfaces/table-container.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { UserDataService } from '../../../shared/services/data/user-data.service';

@Component({
    selector: 'iihf-team-list',
    templateUrl: './team-list.component.html',
    styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit, TableContainer<User> {
    @ViewChild('updateColumn', {static: false})
    public updateColumn: TemplateRef<HTMLElement>;

    public tableConfiguration: TableConfiguration;
    public tableData: TableResponse<User>;

    public loading: boolean;

    public constructor(
        private readonly userDataService: UserDataService,
    ) {
    }

    public ngOnInit(): void {
        this.setTableConfiguration();
    }

    public getData(tableRequest: TableChangeEvent): void {
        this.userDataService.browseUsers(tableRequest)
            .subscribe((userBrowseResponse: BrowseResponse<User>): void => {
                this.tableData = userBrowseResponse;
            });
    }

    private setTableConfiguration(): void {
        this.tableConfiguration = {
            columns: [
                new TableColumn({
                    columnDef: 'firstName',
                    labelKey: 'team.firstName',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'lastName',
                    labelKey: 'team.lastName',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'organization',
                    labelKey: 'team.organization',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'function',
                    labelKey: 'team.function',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'phone',
                    labelKey: 'team.phone',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'mobile',
                    labelKey: 'team.mobile',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'email',
                    labelKey: 'team.email',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: ' ',
                    label: ' ',
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.updateColumn,
                    filter: new TableColumnFilter({
                        type: TableFilterType.CLEAR_FILTERS,
                    }),
                }),

            ]
        };
    }

}
