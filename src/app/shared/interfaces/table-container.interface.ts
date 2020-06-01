import { TableChangeEvent, TableConfiguration, TableResponse } from '../hazelnut/core-table';

export interface TableContainer<T> {
    tableConfiguration: TableConfiguration;
    tableData: TableResponse<T>;
    getData?(tableRequest: TableChangeEvent): void;
}
