import { Filter } from '../../hazelnut-common/models/filter.model';
import { Property } from '../../hazelnut-common/models/types.model';

export class TableRequestParameters {
    public pageSize: number;
    public pageIndex: number;
    public sortActive: Property;
    public sortDirection: string;
    public filter: Filter[];

    public constructor(paginator: { pageSize: number, pageIndex: number }, sort: { active: string, direction: string }) {
        this.pageSize = paginator ? paginator.pageSize : 10;
        this.pageIndex = paginator ? paginator.pageIndex : 0;
        this.sortActive = (sort ? sort.active : '') as Property;
        this.sortDirection = sort ? sort.direction : '';

        // handle sorting ListItem type fields
        if (this.sortActive) {
            this.sortActive = this.sortActive.replace('.value', 'Code') as Property;
        }
    }
}
