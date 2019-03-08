import { TemplateRef } from '@angular/core';
import { ListItem, TableFilterType } from '..';
import { ValueType } from '../../hazelnut-common/models';

export interface TableColumnFilterInterface {
    /**
     * Enable / Disable filtering
     *
     * @default false
     */
    enabled?: boolean;

    /**
     * Type of filtering
     *
     * @example
     * Select | Date | DateRange
     * @default {@link TableFilterType.STRING}
     */
    type?: TableFilterType;

    /**
     * custom filter property
     *
     */
    property?: string;
    /**
     * Width of filter input
     *
     * @default 0
     */
    width?: number;

    /**
     * Type of filter value used in backend
     *
     * @default "STRING"
     */
    valueType?: ValueType;

    /**
     * Values used in select input
     * @default []
     */
    select?: ListItem[];

    /**
     * Default filter value. Parameter is array for future usage of multiple select box
     *
     */
    predefinedValue?: string[];

    /**
     * A template for a custom filter element
     */
    template?: TemplateRef<any>;

}
