import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Role } from '../../../shared/enums/role.enum';
import { ListItem, TableCellType, TableChangeEvent, TableColumn, TableColumnFilter, TableConfiguration, TableFilterType } from '../../../shared/hazelnut/core-table';
import { StringUtils } from '../../../shared/hazelnut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter } from '../../../shared/hazelnut/hazelnut-common/models';
import { User } from '../../../shared/interfaces/user.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { RoutingStorageService } from '../../../shared/services/routing-storage.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TableChangeStorageService } from '../../../shared/services/table-change-storage.service';

@Component({
    selector: 'iihf-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
    @ViewChild('updateColumn', {static: true}) public updateColumn: TemplateRef<any>;
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
                       private readonly userDataService: UserDataService,
                       private readonly router: Router,
                       private readonly routingStorageService: RoutingStorageService,
                       private readonly tableChangeStorageService: TableChangeStorageService,
                       private readonly authService: AuthService) {
    }

    public ngOnInit(): void {
        this.setTableData();
        this.config = {
            stickyEnd: 7,
            columns: [
                new TableColumn({
                    columnDef: 'id',
                    labelKey: 'users.userId',
                    align: 'right',
                    type: TableCellType.NUMBER_SIMPLE,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'first_name',
                    labelKey: 'users.firstName',
                    filter: new TableColumnFilter({}),
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.firstNameColumn,
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'last_name',
                    labelKey: 'users.lastName',
                    filter: new TableColumnFilter({}),
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.lastNameColumn,
                    sorting: true,
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
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'email',
                    labelKey: 'users.email',
                    filter: new TableColumnFilter({}),
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.emailColumn,
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'account_status',
                    labelKey: 'users.state',
                    filter: new TableColumnFilter({
                        valueType: 'STRING',
                        type: TableFilterType.SELECT,
                        select: [
                            new ListItem('', null),
                            new ListItem('ACTIVE', this.translateService.instant('users.active')),
                            new ListItem('INACTIVE', this.translateService.instant('users.inactive'))
                        ]
                    }),
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.stateColumn,
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
                    sorting: true,
                }),
            ],
            paging: true,
        };
        if (!this.isInitialized && this.isReturnFromDetail() && this.tableChangeStorageService.getUsersLastTableChangeEvent()) {
            if (this.tableChangeStorageService.getUsersLastTableChangeEvent().filters) {
                this.config.predefinedFilters = this.tableChangeStorageService.getUsersLastTableChangeEvent().filters;
            }
            if (this.tableChangeStorageService.getUsersLastTableChangeEvent().pageIndex) {
                this.config.predefinedPageIndex = this.tableChangeStorageService.getUsersLastTableChangeEvent().pageIndex;
            }
            if (this.tableChangeStorageService.getUsersLastTableChangeEvent().pageSize) {
                this.config.predefinedPageSize = this.tableChangeStorageService.getUsersLastTableChangeEvent().pageSize;
            }
            if (this.tableChangeStorageService.getUsersLastTableChangeEvent().sortDirection) {
                this.config.predefinedSortDirection = this.tableChangeStorageService.getUsersLastTableChangeEvent()
                                                          .sortDirection
                                                          .toLowerCase();
            }
            if (this.tableChangeStorageService.getUsersLastTableChangeEvent().sortActive) {
                this.config.predefinedSortActive = StringUtils.convertSnakeToCamel(this.tableChangeStorageService.getUsersLastTableChangeEvent()
                                                                                       .sortActive
                                                                                       .toLowerCase());
            }
        }
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
            if (!this.isInitialized && this.isReturnFromDetail() && this.tableChangeStorageService.getUsersLastTableChangeEvent()) {
                tableChangeEvent.pageIndex = this.tableChangeStorageService.getUsersLastTableChangeEvent().pageIndex;
                tableChangeEvent.pageSize = this.tableChangeStorageService.getUsersLastTableChangeEvent().pageSize;
                tableChangeEvent.sortDirection = this.tableChangeStorageService.getUsersLastTableChangeEvent().sortDirection;
                tableChangeEvent.sortActive = this.tableChangeStorageService.getUsersLastTableChangeEvent().sortActive;
            }

            // Api call
            this.userDataService.browseUsers(tableChangeEvent)
                .pipe(finalize((): any => this.loading = false))
                .subscribe((data: BrowseResponse<User>): void => {
                    this.data = data;
                    this.isInitialized = true;
                }, (): void => {
                    this.notificationService.openErrorNotification('error.api');
                });
            this.tableChangeStorageService.setUsersLastTableChangeEvent(tableChangeEvent);
            this.lastTableChangeEvent = tableChangeEvent;
        }
    }

    public edit(id: number): void {
        this.router.navigate(['users/edit'], {
            queryParams: {id}
        });
    }

    public createUser(): void {
        this.router.navigate(['users/create']);
    }

    public hasRoleCreateUser(): boolean {
        return this.authService.hasRole(Role.RoleCreateUser);
    }

    public hasRoleReadUser(): boolean {
        return this.authService.hasRole(Role.RoleReadUser);
    }

    public hasRoleUpdateUser(): boolean {
        return this.authService.hasRole(Role.RoleUpdateUser);
    }

    public canSeeDetail(): boolean {
        return this.hasRoleUpdateUser() || this.hasRoleReadUser();
    }

    private isReturnFromDetail(): boolean {
        return this.routingStorageService.getPreviousUrl()
                   .includes('users/edit') || this.routingStorageService.getPreviousUrl()
                                                  .includes('users/create');
    }

}
