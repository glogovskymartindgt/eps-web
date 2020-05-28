import { TemplateRef } from '@angular/core';
import { StringUtils } from "../../hazelnut-common/hazelnut";
import { TableColumnInterface } from '../interfaces/table-column.interface';
import { TableCellType } from './table-cell-type.enum';
import { TableColumnFilter } from './table-column-filter.model';

/**
 * Abstract table column configuration
 * @module TableColumn
 */
export class TableColumn implements TableColumnInterface {
    public columnDef: string;
    public label: string;
    public type?: TableCellType;
    public sorting = false;
    public filter?: TableColumnFilter;
    public tableCellTemplate?: TemplateRef<any>;
    public componentParams?: object;
    public labelKey?: string;
    public customValue?: (row: any) => string;
    public align?: string;

    private readonly _columnRequestName: string;

    public constructor(public readonly config: TableColumnInterface) {
        this.columnDef = config.columnDef;
        this.label = config.label;
        this.type = config.type;
        this._columnRequestName = config.columnRequestName;
        this.sorting = config.sorting || this.sorting;
        this.filter = config.filter || this.filter;
        this.tableCellTemplate = config.tableCellTemplate;
        this.componentParams = config.componentParams;
        this.customValue = config.customValue;
        this.align = config.align;
        this.labelKey = config.labelKey;
    }

    /**
     * Get filterElement
     *
     * @returns The filter name
     * @get
     */
    public get filterElement(): string {
        return this.columnDef + 'Filter';
    }

    /**
     * Get a column name for table requests (sorting, filtering
     *
     * @returns columnRequestName
     * @get
     */
    public get columnRequestName(): string {
        if (this._columnRequestName) {
            return this._columnRequestName;
        }

        return StringUtils.convertCamelToSnakeUpper(this.columnDef);
    }

    /*
    public check(): void {
        if (typeof this.customValue === "function" && this.sorting) {
            console.warn("Sorting won't work if cell is using customValue");
        }
        if (this.tableCellTemplate && this.sorting) {
            // empty
        }
    }
    */
}
