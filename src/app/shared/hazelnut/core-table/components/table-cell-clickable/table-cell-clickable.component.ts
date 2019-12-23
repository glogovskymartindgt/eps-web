import { Component, Input, OnInit } from '@angular/core';
import { TableCellCustomized } from '../../interfaces/table-cell-customized';

@Component({
    selector: 'haz-table-cell-clickable',
    templateUrl: './table-cell-clickable.component.html',
    styleUrls: ['./table-cell-clickable.component.scss'],
})
export class TableCellClickableComponent implements TableCellCustomized, OnInit {
    @Input() public row: any;
    @Input() public params: {
        contentPath: string[]; content: string; link?: string; linkParts?: string[]; callback?(row: any): void;
    };

    public title: string;
    public component: any;

    public ngOnInit(): void {
        // Empty
    }

    public onClick(): void {
        this.params.callback(this.row);
    }

}
