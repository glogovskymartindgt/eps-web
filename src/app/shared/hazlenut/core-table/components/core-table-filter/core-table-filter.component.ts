import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BusinessAreaService } from '../../../../services/data/business-area.service';
import { UserDataService } from '../../../../services/data/user-data.service';
import { NotificationService } from '../../../../services/notification.service';
import { fadeEnterLeave } from '../../../hazelnut-common/animations';
import { StringUtils } from '../../../hazelnut-common/hazelnut';
import { CoreTableService } from '../../core-table.service';
import { TableColumn } from '../../models/table-column.model';
import { TableFilterType } from '../../models/table-filter-type.enum';

@Component({
    selector: 'haz-core-table-filter',
    templateUrl: './core-table-filter.component.html',
    styleUrls: ['./core-table-filter.component.scss'],
    animations: [fadeEnterLeave]
})
export class CoreTableFilterComponent implements OnInit {
    @Input() public columnConfig: TableColumn = new TableColumn({columnDef: '', label: ''});
    @Output() public resetFilters = new EventEmitter<boolean>();
    private _filtersElement: FormGroup = null;
    public showSearchIcon = true;
    public filterTypeEnum: typeof TableFilterType = TableFilterType;
    public userList$ = this.userDataService.getUsers();
    public categoryList$ = [];

    public constructor(private readonly coreTableService: CoreTableService,
                       private readonly userDataService: UserDataService,
                       private readonly notificationService: NotificationService,
                       private readonly businessAreaService: BusinessAreaService,
    ) {

    }

    public get filterDelay(): number {
        return this.coreTableService && this.coreTableService.configuration ? this.coreTableService.configuration.filterDebounceTime : 0;
    }

    public get filtersElement(): FormGroup {
        return this._filtersElement;
    }

    public get control(): AbstractControl {
        return this._filtersElement.controls[this.columnConfig.filterElement];
    }

    public get widthClass(): string {
        return this.columnConfig.filter.width ? `w-${this.columnConfig.filter.width}` : 'w-100';
    }

    public ngOnInit(): void {
        const elementName = this.columnConfig.filterElement;
        const formGroupOptions: { [id: string]: FormControl } = {};
        formGroupOptions[elementName] = new FormControl(
            this.columnConfig.filter && this.columnConfig.filter.predefinedValue ?
                this.columnConfig.filter.predefinedValue[0] :
                null,
        );
        this._filtersElement = new FormGroup(formGroupOptions);
        this.processFormChanges();

        if (this.columnConfig.filter && this.columnConfig.filter.type === TableFilterType.CUSTOM) {
            this._filtersElement.addControl(this.columnConfig.filterElement, new FormControl());
        }
        this.loadCategoryList();
        this.setPredefinedFilterValuesIntoTableFilters();
    }

    private loadCategoryList() {
        this.businessAreaService.listCategories()
            .subscribe((data) => {
                this.categoryList$ = data.content;
            });
    }

    public clearFilters() {
        this.resetFilters.next(true);
        this.coreTableService.clearFilters();
    }

    private processFormChanges(): void {
        const elementName = this.columnConfig.filterElement;
        this.filtersElement.valueChanges.pipe(debounceTime(this.filterDelay)).subscribe((values: any) => {
            if (this.filtersElement.status === 'VALID') {
                const newValue = values[elementName];
                this.coreTableService.addFilter(this.columnConfig, newValue);
            }
        });
    }

    private setPredefinedFilterValuesIntoTableFilters() {
        const configuration = this.coreTableService.configuration;
        const isFilterFromPredefinedFilters = configuration && configuration.predefinedFilters
            && configuration.predefinedFilters.find((filter) =>
                filter.property === StringUtils.convertCamelToSnakeUpper(this.columnConfig.columnDef)
            );
        const isPredefinedNumberValue = this.columnConfig.filter.type === 'number';
        const isPredefinedDateValue = this.columnConfig.config
            && this.columnConfig.config.filter
            && this.columnConfig.config.filter.valueType === 'DATE_TIME';
        const isPredefinedTrafficLightValue = this.columnConfig.columnDef === 'trafficLight';
        if (isFilterFromPredefinedFilters) {
            if (isPredefinedNumberValue) {
                this.setFilterElementByPredefinedNumberValues();
            } else if (isPredefinedDateValue) {
                this.setFilterElementByPredefinedDateValues();
            } else if (isPredefinedTrafficLightValue) {
                this.setFilterElementByPredefinedTrafficLightValues();
            } else {
                this.filtersElement.controls[this.columnConfig.filterElement].patchValue(configuration.predefinedFilters
                    .find((filter) =>
                        filter.property === StringUtils.convertCamelToSnakeUpper(this.columnConfig.columnDef))
                    .value
                );
            }
        }
    }

    private setFilterElementByPredefinedDateValues() {
        // ExpressionChangedAfterItHasBeenCheckedError even with {emitEvent: false, onlySelf: true}
        const lowerFilter = this.getNumberFilterFromPredefinedFiltersByOperator('GOE');
        const higherFilter = this.getNumberFilterFromPredefinedFiltersByOperator('LOE');
        this.filtersElement.controls[this.columnConfig.filterElement].patchValue({
            dateFrom: lowerFilter ? lowerFilter.value : null,
            dateTo: higherFilter ? higherFilter.value : null,
        });
    }

    private setFilterElementByPredefinedNumberValues() {
        const lowerFilter = this.getNumberFilterFromPredefinedFiltersByOperator('GOE');
        const higherFilter = this.getNumberFilterFromPredefinedFiltersByOperator('LOE');
        this.filtersElement.controls[this.columnConfig.filterElement].patchValue({
            from: lowerFilter ? lowerFilter.value : null,
            to: higherFilter ? higherFilter.value : null,
        });
    }

    private setFilterElementByPredefinedTrafficLightValues() {
        this.filtersElement.controls[this.columnConfig.filterElement].patchValue(
            ['RED', 'GREEN', 'AMBER', 'NONE']
                .map((color) => this.getTrafficLightFromPredefinedFiltersByColor(color))
                .filter((filter) => filter !== undefined)
                .map((filter) => filter.value.toString().toLowerCase())
        );
    }

    private getNumberFilterFromPredefinedFiltersByOperator(operator: string) {
        return this.coreTableService.configuration.predefinedFilters
            .filter((filter) =>
                filter.property === StringUtils.convertCamelToSnakeUpper(this.columnConfig.columnDef))
            .find((filter) => filter.operator === operator);
    }

    private getTrafficLightFromPredefinedFiltersByColor(colorValue: string) {
        return this.coreTableService.configuration.predefinedFilters
            .filter((filter) =>
                filter.property === StringUtils.convertCamelToSnakeUpper(this.columnConfig.columnDef))
            .find((filter) => filter.value === colorValue);
    }

}
