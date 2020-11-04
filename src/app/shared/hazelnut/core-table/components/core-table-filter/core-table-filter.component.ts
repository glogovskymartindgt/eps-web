import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { ListItem } from '../..';
import { Category } from '../../../../interfaces/category.interface';
import { User } from '../../../../interfaces/user.interface';
import { BusinessAreaService } from '../../../../services/data/business-area.service';
import { UserDataService } from '../../../../services/data/user-data.service';
import { NotificationService } from '../../../../services/notification.service';
import { fadeEnterLeave } from '../../../hazelnut-common/animations';
import { StringUtils } from '../../../hazelnut-common/hazelnut';
import { Filter } from '../../../hazelnut-common/models';
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

    public get filterDelay(): number {
        return this.coreTableService && this.coreTableService.configuration ? this.coreTableService.configuration.filterDebounceTime : 0;
    }

    public get control(): AbstractControl {
        return this._filtersElement.controls[this.columnConfig.filterElement];
    }

    public get widthClass(): string {
        return this.columnConfig.filter.width ? `w-${this.columnConfig.filter.width}` : 'w-100';
    }

    public get filtersElement(): FormGroup {
        return this._filtersElement;
    }

    @Input() public columnConfig: TableColumn = new TableColumn({
        columnDef: '',
        label: ''
    });
    @Output() public resetFilters = new EventEmitter<boolean>();
    public showSearchIcon = true;
    public filterTypeEnum: typeof TableFilterType = TableFilterType;
    public userList$ = this.userDataService.getUsers();
    public categoryList$ = [];
    public formControl: FormControl;

    private _filtersElement: FormGroup = null;

    public constructor(
        private readonly coreTableService: CoreTableService,
        private readonly userDataService: UserDataService,
        private readonly notificationService: NotificationService,
        private readonly businessAreaService: BusinessAreaService,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {

    }

    public ngOnInit(): void {
        const elementName = this.columnConfig.filterElement;
        const formGroupOptions: {[id: string]: FormControl} = {};
        formGroupOptions[elementName] = new FormControl((this.columnConfig.filter && this.columnConfig.filter.predefinedValue) ?
                                                        this.columnConfig.filter.predefinedValue[0] :
                                                        null);
        this._filtersElement = new FormGroup(formGroupOptions);
        if (this.columnConfig.filter && this.columnConfig.filter.type === TableFilterType.CUSTOM) {
            this._filtersElement.addControl(this.columnConfig.filterElement, new FormControl());
            this.formControl = this._filtersElement.controls[this.columnConfig.filterElement] as FormControl;
        }
        this.processFormChanges();

        this.loadCategoryList();
        this.setPredefinedFilterValuesIntoTableFilters();
    }

    public clearFilters(): void {
        this.resetFilters.next(true);
        this.coreTableService.clearFilters();
    }

    public trackListItemByCode(index: number, item: ListItem): any {
        return item.code;
    }

    public trackCategoryById(index: number, item: Category): any {
        return item.id;
    }

    public trackUserById(index: number, item: User): any {
        return item.id;
    }

    private get filterProperty(): string {
        const filterDef: string = this.columnConfig.filter.property || this.columnConfig.columnRequestName;

        return StringUtils.convertCamelToSnakeUpper(filterDef);
    }

    private loadCategoryList(): void {
        this.businessAreaService.listCategories()
            .subscribe((data) => {
                this.categoryList$ = data.content;
            });
    }

    private processFormChanges(): void {
        const elementName = this.columnConfig.filterElement;
        this.filtersElement.valueChanges.pipe(debounceTime(this.filterDelay))
            .subscribe((values: any) => {
                if (this.filtersElement.status === 'VALID') {
                    const newValue = values[elementName];
                    this.coreTableService.addFilter(this.columnConfig, newValue);
                }
            });
    }

    private setPredefinedFilterValuesIntoTableFilters(): void {
        const configuration = this.coreTableService.configuration;
        const isFilterFromPredefinedFilters = configuration &&
            configuration.predefinedFilters &&
            configuration.predefinedFilters.find((filter: Filter) => filter.property === this.filterProperty);
        const isPredefinedNumberValue = this.columnConfig.filter.type === 'number';
        const isPredefinedDateValue = this.columnConfig.config && this.columnConfig.config.filter && this.columnConfig.config.filter.valueType === 'DATE_TIME';
        const isPredefinedTrafficLightValue = this.columnConfig.columnDef === 'trafficLight';
        if (isFilterFromPredefinedFilters) {
            if (isPredefinedNumberValue) {
                this.setFilterElementByPredefinedNumberValues();
            } else if (isPredefinedDateValue) {
                this.setFilterElementByPredefinedDateValues();
            } else if (isPredefinedTrafficLightValue) {
                this.setFilterElementByPredefinedTrafficLightValues();
            } else {
                this.filtersElement.controls[this.columnConfig.filterElement]
                    .patchValue(
                        configuration.predefinedFilters.find((filter: Filter) => filter.property === this.filterProperty).value
                    );
            }
        }
    }

    private setFilterElementByPredefinedDateValues(): void {
        const lowerFilter = this.getNumberFilterFromPredefinedFiltersByOperator('GOE');
        const higherFilter = this.getNumberFilterFromPredefinedFiltersByOperator('LOE');
        this.filtersElement.controls[this.columnConfig.filterElement].patchValue({
            dateFrom: lowerFilter ? moment(lowerFilter.value) : null,
            dateTo: higherFilter ? moment(higherFilter.value) : null,
        });

        this.changeDetectorRef.detectChanges();
    }

    private setFilterElementByPredefinedNumberValues(): void {
        const lowerFilter = this.getNumberFilterFromPredefinedFiltersByOperator('GOE');
        const higherFilter = this.getNumberFilterFromPredefinedFiltersByOperator('LOE');
        this.filtersElement.controls[this.columnConfig.filterElement].patchValue({
            from: lowerFilter ? lowerFilter.value : null,
            to: higherFilter ? higherFilter.value : null,
        });
    }

    private setFilterElementByPredefinedTrafficLightValues(): void {
        this.filtersElement.controls[this.columnConfig.filterElement].patchValue([
            'RED',
            'GREEN',
            'AMBER',
            'NONE'
        ]
            .map((color: string) => this.getTrafficLightFromPredefinedFiltersByColor(color))
            .filter((filter: Filter) => filter !== undefined)
            .map((filter: Filter) => filter.value.toString()
                                           .toLowerCase()));
    }

    private getNumberFilterFromPredefinedFiltersByOperator(operator: string): Filter {
        return this.coreTableService.configuration.predefinedFilters
                   .filter((filter: Filter) => filter.property === this.filterProperty)
                   .find((filter: Filter) => filter.operator === operator);
    }

    private getTrafficLightFromPredefinedFiltersByColor(colorValue: string): Filter {
        return this.coreTableService.configuration.predefinedFilters
                   .filter((filter: Filter) => filter.property === this.filterProperty)
                   .find((filter: Filter) => filter.value === colorValue);
    }

}
