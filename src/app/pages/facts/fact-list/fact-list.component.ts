import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize, switchMap, take } from 'rxjs/operators';
import { ChoiceButtonOptions } from 'src/app/shared/interfaces/choice-button-options.interface';
import { RequestNames } from '../../../shared/enums/request-names.enum';
import { Role } from '../../../shared/enums/role.enum';
import { ImportChoiceType } from 'src/app/shared/enums/import-choice-type.enum'

import {
    TableCellType,
    TableChangeEvent,
    TableColumn,
    TableColumnFilter,
    TableConfiguration,
    TableFilterType
} from '../../../shared/hazelnut/core-table';
import { BrowseResponse, Filter } from '../../../shared/hazelnut/hazelnut-common/models';
import { FileManager } from '../../../shared/hazelnut/hazelnut-common/utils/file-manager';
import { Fact } from '../../../shared/interfaces/fact.interface';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { RoutingStorageService } from '../../../shared/services/routing-storage.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TableChangeStorageService } from '../../../shared/services/table-change-storage.service';
import { GetFileNameFromContentDisposition } from '../../../shared/utils/headers';
import { tableLastStickyColumn } from '../../../shared/utils/table-last-sticky-column';
import { ProjectAttachmentService } from '../../project/services/project-attachment.service';
import { OptionDialogComponent } from 'src/app/shared/components/dialog/option-dialog/option-dialog.component';
import { ListOption } from 'src/app/shared/interfaces/list-option.interface';
import { Observable } from 'rxjs';
import { BlobManager } from 'src/app/shared/utils/blob-manager';


const ALL_FACTS = 'all-facts';

@Component({
    selector: 'iihf-fact-list',
    templateUrl: './fact-list.component.html',
    styleUrls: ['./fact-list.component.scss']
})

/**
 * Fact list used in screens Facts and Figures | All Facts and Figures
 */

export class FactListComponent implements OnInit {
    @ViewChild('updateColumn', {static: true}) public updateColumn: TemplateRef<any>;
    @ViewChild('firstValueColumn', {static: true}) public firstValueColumn: TemplateRef<any>;
    @ViewChild('secondValueColumn', {static: true}) public secondValueColumn: TemplateRef<any>;
    @ViewChild('totalValueColumn', {static: true}) public totalValueColumn: TemplateRef<any>;
    @ViewChild('categoryColumn', {static: true}) public categoryColumn: TemplateRef<any>;
    @ViewChild('projectTypeFilter', {static: true})
    public projectTypeFilter: TemplateRef<{ columnConfig: TableColumn, control: FormControl }>;

    public config: TableConfiguration;
    public loading = false;
    public data = new BrowseResponse<Fact>([]);
    public allFacts = false;
    public role: typeof Role = Role;

    private lastTableChangeEvent: TableChangeEvent;
    private allTaskFilters: Filter[] = [];

    private importOptions: ChoiceButtonOptions
    private importedFile: File
    public documentFileTypes = [
        'xls',
        'xlsx',
    ];


    public constructor(
        private readonly matDialog: MatDialog,
        public readonly projectEventService: ProjectEventService,
        private readonly translateService: TranslateService,
        private readonly notificationService: NotificationService,
        private readonly factService: FactService,
        public readonly router: Router,
        private readonly routingStorageService: RoutingStorageService,
        private readonly tableChangeStorageService: TableChangeStorageService,
        private readonly projectAttachmentService: ProjectAttachmentService
    ) {
    }

    public ngOnInit(): void {
        this.tableChangeStorageService.isReturnFromDetail = this.isReturnFromDetail();
        this.setImportOptions();
        this.setTableConfiguration();
    }

    /**
     * Route to create screen of fact
     */
    public createFact(): void {
        this.router.navigate(['facts/create']);
    }

    /**
     * Route to edit screen of fact detail
     * @param id
     * @param year
     * @param projectId
     */
    public update(id: number, year: number, projectId: number): void {
        if (this.router.url.includes(ALL_FACTS)) {
            this.router.navigate(['all-facts/edit'], {
                queryParams: {
                    id,
                    projectId,
                    year
                }
            });
        } else {
            this.router.navigate(['facts/edit'], {
                queryParams: {
                    id,
                    projectId
                }
            });
        }
    }

    public setTableData(tableChangeEvent?: TableChangeEvent): void {
        this.loading = true;
        let projectFilter = null;
        // Create filter which will be use in Facts and Figures screen API call
        if (!this.allFacts) {
            projectFilter = new Filter('PROJECT_ID', this.projectEventService.instant.id, 'NUMBER');
        }

        if (tableChangeEvent && tableChangeEvent.filters && tableChangeEvent.filters.length > 0) {
            this.allTaskFilters = tableChangeEvent.filters;
        }

        if (projectFilter){
            this.allTaskFilters = this.allTaskFilters.concat(projectFilter)
        }

        this.tableChangeStorageService.cachedTableChangeEvent = tableChangeEvent;
        this.lastTableChangeEvent = tableChangeEvent;
        // Api call
        this.factService.browseFacts(tableChangeEvent, projectFilter)
        .pipe(finalize((): any => this.loading = false))
        .subscribe((data: BrowseResponse<Fact>): void => {
            this.data = data;
        }, (): void => {
            this.notificationService.openErrorNotification('error.api');
        });
    }

    public factDetailRoles(): Role[] {
        if (this.allFacts) {
            return [
                Role.RoleReadAllFactItem,
                Role.RoleReadAllFactItemInAssignProject,
            ];
            // tslint:disable-next-line:unnecessary-else
        } else {
            return [
                Role.RoleReadFactItem,
                Role.RoleReadFactItemInAssignProject,
                Role.RoleUpdateFactItem,
                Role.RoleUpdateFactItemInAssignProject,
            ];
        }
    }

    /**
     * Export report from API based on selected filters
     */
    public export(): void {
        this.loading = true;
        let chosenService = this.factService.exportAllFacts(this.lastTableChangeEvent, this.allTaskFilters, this.projectEventService.instant.id)
        if (!this.allFacts){
            chosenService = this.factService.exportFacts(this.lastTableChangeEvent, this.allTaskFilters, this.projectEventService.instant.id)
        }
        chosenService.pipe(finalize((): any => this.loading = false))
        .subscribe((response: HttpResponse<any>): void => {
            const contentDisposition = response.headers.get('Content-Disposition');
            const exportName: string = GetFileNameFromContentDisposition(contentDisposition);
            new FileManager().saveFile(exportName, response.body, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        }, (): void => {
            this.notificationService.openErrorNotification('error.api');
        });
    }

     /**
     * Export EMPTY report (.xls) from API 
     */
     public createTemplate(): void {
        this.loading = true;
        this.factService.generateTemplate(this.projectEventService.instant.id)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((response: HttpResponse<any>): void => {
                const contentDisposition = response.headers.get('Content-Disposition');
                const exportName: string = GetFileNameFromContentDisposition(contentDisposition);
                new FileManager().saveFile(exportName, response.body, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

     /**
     * Import report from an .xls file
     */
     public import(): void {
        this.loading = true;
        const dialogRef = this.matDialog.open(OptionDialogComponent, {
            data: {
                title: this.importOptions.titleKey ? this.translateService.instant(this.importOptions.titleKey) : null,
                message: this.importOptions.messageKey ?  this.translateService.instant(this.importOptions.messageKey) : null,
                options: this.importOptions.options ? this.importOptions.options : null,
                rejectionButtonText: this.translateService.instant(this.importOptions.rejectionButtonKey),
                confirmationButtonText: this.translateService.instant(this.importOptions.confirmationButtonKey)
            },
            width: '350px'
        });

        dialogRef.afterClosed()
            .subscribe((result: any): void => {

                if (!result) {
                    return;
                }

                const flag : string = result ? result.value : ImportChoiceType.DEFAULT
                const formData = new FormData();
                formData.append('file', this.importedFile, this.importedFile.name);
                const data = {data : formData, flag: flag, projectId: this.projectEventService.instant.id}
                this.importedFile = null

                this.factService.importFacts(data)
                    .subscribe(
                        (res): void => {
                            if (res !== null){
                                console.log('res: ', res)
                                const reader = new FileReader();
                                reader.onload = (): void => {
                                BlobManager.downloadFromBlob(res, '', 'log-file.log');
                                };

                            }
                            this.setTableData(this.lastTableChangeEvent)
                            this.notificationService.openSuccessNotification('success.import');
                        }, (error): void => {
                            console.error(error)
                            this.notificationService.openErrorNotification('error.import');
                        }
                    );
            });

    }

    /**
     * Convert type to API object and update
     * @param $event
     */
    public convertAndUpdate($event: any): void {
        this.update($event.id, $event.year, $event.projectId);
    }

    private setTableConfiguration(): void {
        let config: TableConfiguration = {
            columns: [
                new TableColumn({
                    columnDef: 'categoryName',
                    labelKey: 'fact.category',
                    type: TableCellType.CONTENT,
                    filter: new TableColumnFilter({
                        type: TableFilterType.CATEGORY,
                    }),
                    sorting: true,
                    tableCellTemplate: this.categoryColumn,
                }),
                new TableColumn({
                    columnDef: 'subCategoryName',
                    labelKey: 'fact.subCategory',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'valueFirst',
                    label: this.checkValue(this.projectEventService.instant.firstVenue),
                    align: 'right',
                    type: TableCellType.CONTENT,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                    tableCellTemplate: this.firstValueColumn,
                }),
                new TableColumn({
                    columnDef: 'valueSecond',
                    label: this.checkValue(this.projectEventService.instant.secondVenue),
                    align: 'right',
                    type: TableCellType.CONTENT,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                    tableCellTemplate: this.secondValueColumn,
                }),
                new TableColumn({
                    columnDef: 'totalValue',
                    labelKey: 'fact.totalValue',
                    align: 'right',
                    type: TableCellType.CONTENT,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                    tableCellTemplate: this.totalValueColumn,
                }),
                new TableColumn({
                    columnDef: 'descriptionShort',
                    labelKey: 'fact.description',
                    columnRequestName: 'description',
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
            ],
            paging: true,
            trClasses: 'clickable'
        };

        config = this.tableChangeStorageService.updateTableConfiguration(config);

        // Update config for All Facts and Figures screen
        if (this.router.url.includes(ALL_FACTS)) {
            this.allFacts = true;
            config.columns.splice(0, 0,
                new TableColumn({
                    columnDef: 'year',
                    labelKey: 'fact.year',
                    align: 'right',
                    type: TableCellType.NUMBER_SIMPLE,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'projectTypeCode',
                    labelKey: 'fact.projectType',
                    columnRequestName: RequestNames.PROJECT_TYPE_CODE,
                    filter: new TableColumnFilter({
                        type: TableFilterType.CUSTOM,
                        valueType: 'STRING',
                        template: this.projectTypeFilter,
                    }),
                    sorting: true,
                }),
            );
            this.setLabel(config, 'valueFirst', 'fact.firstValue');
            this.setLabel(config, 'valueSecond', 'fact.secondValue');
        }

        config.stickyEnd = tableLastStickyColumn(config.columns.length);
        this.config = config;
    }

    private checkValue(value: any): any {
        return value ? value : '-';
    }

    /**
     * Set column label
     * @param columnName
     * @param replaceLabel
     */
    private setLabel(config: TableConfiguration, columnName: string, replaceLabel: string): void {
        const index = config.columns.findIndex((column: TableColumn): any => column.columnDef === columnName);
        config.columns[index].label = null;
        config.columns[index].labelKey = replaceLabel;
    }

    /**
     * Function if returned from create or detail screen
     */
    private isReturnFromDetail(): boolean {
        return this.routingStorageService.getPreviousUrl().includes('facts/edit')
            || this.routingStorageService.getPreviousUrl().includes('facts/create');
    }

    setImportOptions(){
        let choices = [ImportChoiceType.FILL_BLANK, ImportChoiceType.REWRITE_ALL]
        this.importOptions = {
            titleKey: "import.title",
            options: [
                {id:0 ,value: ImportChoiceType.FILL_BLANK, string: "fill blank", stringKey: "import.fillBlank", textKey: "import.fillBlankText"},
                {id:1 ,value: ImportChoiceType.REWRITE_ALL, string: "rewrite all", stringKey: "import.rewriteAll", textKey: "import.rewriteAllText"}
            ],
            confirmationButtonKey: "import.ok",
            rejectionButtonKey: "import.cancel",
            // chooseOptionApiCall: function (x,y,z) {this.factService.importFacts(x,y,z)}
            chooseOptionApiCall: null
        }
    }

    // public download(blob: Blob, type: string, name: string): void {
    //     BlobManager.downloadFromBlob(blob, this.projectAttachmentService.getContentTypeFromFileName(name), name);
    // }

    public onImportFile(event): void | undefined {
        const file = event.target.files[0];
        if (!file){
            return 
        }
        this.importedFile = file
        this.import()
    }
}