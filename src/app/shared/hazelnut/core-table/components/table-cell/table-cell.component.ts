import { Component, Input, OnInit } from '@angular/core';
import { MiscUtils, ObjectUtils } from '../../../hazelnut-common/hazelnut';
import { TableCellType } from '../../models/table-cell-type.enum';
import { TableColumn } from '../../models/table-column.model';

@Component({
    selector: 'haz-table-cell',
    templateUrl: './table-cell.component.html',
    styleUrls: ['./table-cell.component.scss']
})
export class TableCellComponent implements OnInit {
    @Input() public columnConfig: TableColumn = new TableColumn({columnDef: '', label: ''});
    @Input() public row: any;

    public tableCellType: typeof TableCellType = TableCellType;

    public constructor() {
    }

    public get cellValue(): any {
        return ObjectUtils.getNestedProperty(this.row, this.columnConfig.columnDef);
    }

    public get customValue(): any {
        if (!MiscUtils.isFunction(this.columnConfig.customValue)) {
            throw new Error('customValue method should be specified for the CUSTOM_VALUE table cell type');
        }

        return this.columnConfig.customValue(this.row);
    }

    public ngOnInit(): void {
    }
}
