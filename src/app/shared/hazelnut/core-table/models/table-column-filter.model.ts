import { TemplateRef } from '@angular/core';
import { ValueType } from '../../hazelnut-common/models';
import { TableColumnFilterInterface } from '../interfaces/table-column-filter.interface';
import { ListItem } from './list-item.model';
import { TableFilterType } from './table-filter-type.enum';

export class TableColumnFilter implements TableColumnFilterInterface {
    public enabled = true;
    public type?: TableFilterType = TableFilterType.STRING;
    public property?: string;
    public width?: number;
    public valueType?: ValueType = 'STRING';
    public select?: ListItem[] = [];
    public predefinedValue?: string[];
    public template?: TemplateRef<any>;

    public constructor(public config: TableColumnFilterInterface) {
        this.template = config.template;
        this.predefinedValue = config.predefinedValue;
        this.select = config.select || this.select;
        this.valueType = config.valueType || this.valueType;
        this.type = config.type || this.type;
        this.width = config.width;
        this.property = config.property;
        this.enabled = typeof config.enabled === 'boolean' ? config.enabled : this.enabled;
    }
}
