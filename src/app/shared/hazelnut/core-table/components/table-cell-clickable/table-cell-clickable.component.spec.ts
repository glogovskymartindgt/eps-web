import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellClickableComponent } from './table-cell-clickable.component';

describe('TableCellClickableComponent', () => {
    let component: TableCellClickableComponent;
    let fixture: ComponentFixture<TableCellClickableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                   declarations: [TableCellClickableComponent],
               })
               .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableCellClickableComponent);
        component = fixture.componentInstance;
        component.params = {
            content: 'Some Content',
            contentPath: [],
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
