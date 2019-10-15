import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ListItem, TableCellType, TableChangeEvent, TableColumn, TableColumnFilter, TableConfiguration, TableFilterType } from '../../../shared/hazlenut/core-table';
import { BrowseResponse, Filter } from '../../../shared/hazlenut/hazelnut-common/models';
import { Fact } from '../../../shared/interfaces/fact.interface';
import { FactService } from '../../../shared/services/data/fact.service';
import { UsersService } from '../../../shared/services/data/users.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { RoutingStorageService } from '../../../shared/services/routing-storage.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TableChangeStorageService } from '../../../shared/services/table-change-storage.service';

const SETTINGS_USERS = 'settings/users';

@Component({
    selector: 'users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
    @ViewChild('updateColumn', {static: true}) public updateColumn: TemplateRef<any>;
    @ViewChild('idColumn', {static: true}) public idColumn: TemplateRef<any>;
    @ViewChild('firstNameColumn', {static: true}) public firstNameColumn: TemplateRef<any>;
    @ViewChild('lastNameColumn', {static: true}) public lastNameColumn: TemplateRef<any>;
    @ViewChild('visibleColumn', {static: true}) public visibleColumn: TemplateRef<any>;
    @ViewChild('emailColumn', {static: true}) public emailColumn: TemplateRef<any>;
    @ViewChild('stateColumn', {static: true}) public stateColumn: TemplateRef<any>;

    public config: TableConfiguration;
    public loading = false;
    public isInitialized = false;
    public data = new BrowseResponse<any>([]);

    private lastTableChangeEvent: TableChangeEvent;
    private allTaskFilters: Filter[] = [];

    public constructor(public readonly projectEventService: ProjectEventService,
                private readonly translateService: TranslateService,
                private readonly notificationService: NotificationService,
                private readonly usersService: UsersService,
                private readonly router: Router,
                private readonly routingStorageService: RoutingStorageService,
                private readonly tableChangeStorageService: TableChangeStorageService) {}

    public ngOnInit() {
        this.setTableData();
        this.config = {
            stickyEnd: 7,
            columns: [
                new TableColumn({
                    columnDef: 'id',
                    labelKey: 'users.userId',
                    filter: new TableColumnFilter({}),
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.idColumn,
                }),
                new TableColumn({
                    columnDef: 'first_name',
                    labelKey: 'users.firstName',
                    filter: new TableColumnFilter({}),
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.firstNameColumn,
                }),
                new TableColumn({
                    columnDef: 'last_name',
                    labelKey: 'users.lastName',
                    filter: new TableColumnFilter({}),
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.lastNameColumn,
                }),
                new TableColumn({
                    columnDef: 'flag_active',
                    labelKey: 'users.visible',
                    filter: new TableColumnFilter({
                        valueType: 'STRING',
                        type: TableFilterType.SELECT_STRING,
                        select: [
                            new ListItem('', ''),
                            new ListItem('TRUE', 'Yes'),
                            new ListItem('FALSE', 'No'),
                        ]
                    }),
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.visibleColumn,
                }),
                new TableColumn({
                    columnDef: 'email',
                    labelKey: 'users.email',
                    filter: new TableColumnFilter({}),
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.emailColumn,
                }),
                new TableColumn({
                    columnDef: 'account_status',
                    labelKey: 'users.state',
                    filter: new TableColumnFilter({
                        valueType: 'STRING',
                        type: TableFilterType.SELECT,
                        select: [
                            new ListItem('', null),
                            new ListItem('ACTIVE', 'Active')
                        ]
                    }),
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.stateColumn,
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
            ],
            paging: true,
        };
    }

    /**
     * Set report table data from API
     */
    public setTableData(tableChangeEvent?: TableChangeEvent): void {
        this.loading = true;

        if (tableChangeEvent && tableChangeEvent.filters && tableChangeEvent.filters.length > 0) {
            this.allTaskFilters = tableChangeEvent.filters;
        }

        if (tableChangeEvent) {
            // Set paging and sort when initializating table
            if (!this.isInitialized && this.tableChangeStorageService.getFactsLastTableChangeEvent()
            ) {
                tableChangeEvent.pageIndex = this.tableChangeStorageService.getFactsLastTableChangeEvent().pageIndex;
                tableChangeEvent.pageSize = this.tableChangeStorageService.getFactsLastTableChangeEvent().pageSize;
                tableChangeEvent.sortDirection = this.tableChangeStorageService.getFactsLastTableChangeEvent().sortDirection;
                tableChangeEvent.sortActive = this.tableChangeStorageService.getFactsLastTableChangeEvent().sortActive;
            }
            // Api call
            this.usersService.browseUsers(tableChangeEvent).subscribe((data) => {
                this.data = data;
                this.loading = false;
                this.isInitialized = true;
            }, (e) => {
                this.loading = false;
                this.notificationService.openErrorNotification('error.api');
            });

            this.tableChangeStorageService.setFactsLastTableChangeEvent(tableChangeEvent);
            this.lastTableChangeEvent = tableChangeEvent;
        }
    }
}
