import { TemplateRef } from '@angular/core';
import { TableCellType } from '../models/table-cell-type.enum';
import { TableColumnFilter } from '../models/table-column-filter.model';

export interface TableColumnInterface {
    /**
     * Name of attribute whose value is displayed
     */
    columnDef: string;

    /**
     * Column title printed into th element
     */
    label?: string;

    /**
     * Column title key printed into th element from XX.json
     */
    labelKey?: string;

    /**
     *  Type of column used for render predefined types
     *
     *  @example
     *  Date | Percentage | Text
     */
    type?: TableCellType;

    /**
     * Enable / Disable sorting
     *
     */
    sorting?: boolean;

    /**
     * Defines classes for td elements
     * @deprecated
     */
    tdClasses?: string;

    /**
     * Enable / Disable filtering
     *
     */
    filter?: TableColumnFilter;

    /**
     * TODO:
     */
    tableCellTemplate?: TemplateRef<any>;

    /**
     * Parameters for customized-cell unique for each cell
     */
    componentParams?: any;

    /**
     * Function for cell styling and mapping
     */
    customValue?: (row: any) => string;

    /**
     * Align property for alignment usage
     */
    align?: string;
}
