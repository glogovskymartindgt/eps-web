import { TableChangeEvent } from '../table-change-event';

export interface ProjectTableInterface {
    /**
     * This method is called from CoreTable on each time when user sort, filter or paginate table
     *
     * @param event
     */
    onTableChange(event: TableChangeEvent): void;

    onSelectionChange(selectedRows: any[]): void;

    onRowClick(row: any): void;
}
