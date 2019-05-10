import { TemplateRef } from '@angular/core';
import { Params } from '@angular/router';
import { TableColumn } from './table-column.model';

/**
 * @module TableConfiguration
 */
export class TableConfiguration {
    /**
     * Array of data contains configuration for every column
     *
     * @default []
     */
    public columns: TableColumn[] = [];

    /**
     * Enable / Disable paginator
     *
     * @default false
     */
    public paging ? = true;

    /**
     * Number of rows per page
     *
     */
    public pageSize?: number;

    /**
     * Debounce time delay for filters
     *
     */
    public filterDebounceTime?: number;

    /**
     * This value is used in select box for choose items per page
     *
     */
    public pageSizeOptions?: number[];

    /**
     * Template used for rendering expanded rows
     *
     */
    public expandedRowTemplate?: TemplateRef<any>;

    /**
     * Option for lowercase header to save width
     *
     */
    public uppercaseHeader ? = true;

    /**
     * TODO:
     *
     */
    public queryParams?: Params;

    /**
     * TODO:
     *
     */
    public noDataText?: string;

    /**
     * TODO:
     * @default true
     */

    public selectable ? = true;

    /**
     * TODO:
     * @default "none"
     */
    public selection?: 'none' | 'single' | 'multi' = 'none';

    /**
     * Color of chceckbox when selection is single or multi
     * @default "primary"
     */
    public selectionColor?: 'primary' | 'accent' | 'warn' = 'primary';

    /**
     * Add border between columns
     */
    public columnBorders?: boolean;

    /**
     * Make column from this position sticky on end
     */
    public stickyEnd?: number;

    /**
     * Defines classes for tr elements
     *
     * @default ""
     */
    public trClasses ? = '';

    /**
     * Defines function for conditional row classes
     *
     */
    public trClassesCond?: (row: any, rows?: number) => string;

    /**
     * Value for predefined page index
     *
     */
    public predefinedPageIndex?: number;

    /**
     * Value for predefined page size
     *
     */
    public predefinedPageSize?: number;

    /**
     * String for predefined sort direction
     * 'asc' | 'desc'
     *
     */
    public predefinedSortDirection?: string;

    /**
     * String for predefined sort active
     * column name in camel case
     *
     */
    public predefinedSortActive?: string;

    /*
    public check: () => void  = () => {
        if (Array.isArray(this.columns)) {
            this.columns.forEach((column) => column.check());
        } else {
            console.warn("Attribute columns must be array!!");
        }
    }
    */
}
