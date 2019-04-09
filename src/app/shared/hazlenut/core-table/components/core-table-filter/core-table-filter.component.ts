import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { UserDataService } from '../../../../services/data/user-data.service';
import { NotificationService } from '../../../../services/notification.service';
import { fadeEnterLeave } from '../../../hazelnut-common/animations';
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

    public constructor(private readonly coreTableService: CoreTableService,
                       private readonly userDataService: UserDataService,
                       private readonly notificationService: NotificationService,
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
            this.columnConfig.filter && this.columnConfig.filter.predefinedValue ? this.columnConfig.filter.predefinedValue[0] : null,
        );
        this._filtersElement = new FormGroup(formGroupOptions);
        this.processFormChanges();

        if (this.columnConfig.filter && this.columnConfig.filter.type === TableFilterType.CUSTOM) {
            this._filtersElement.addControl(this.columnConfig.filterElement, new FormControl());
        }
    }

    public clearFilters() {
        this.resetFilters.next(true);
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

}
