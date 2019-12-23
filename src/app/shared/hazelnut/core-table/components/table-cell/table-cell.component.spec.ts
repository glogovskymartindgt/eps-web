import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NOTIFICATION_WRAPPER_TOKEN } from '@hazelnut';
import { NoopNotificationService } from '@hazelnut/lib/small-components/notifications/testing/noop-notification.service';

import { SharedPipesModule } from '../../../hazelnut-common/pipes';
import { TestingModule } from '../../../testing.module';
import { CoreTableModule } from '../../core-table.module';
import { TableCellComponent } from './table-cell.component';

describe('TableCellComponent', () => {
    let component: TableCellComponent;
    let fixture: ComponentFixture<TableCellComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                   imports: [
                       CoreTableModule,
                       TestingModule,
                       SharedPipesModule,
                   ],
                   declarations: [],
                   providers: [
                       {
                           provide: NOTIFICATION_WRAPPER_TOKEN,
                           useClass: NoopNotificationService
                       },
                   ]
               })
               .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableCellComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });

    it('getNestedProperty method functioning', () => {
        component.row = {
            property1: {
                nestedProperty1: 13,
                nestedProperty2: 35
            },
            property2: 2
        };

        component.columnConfig.columnDef = 'property1';
        expect(component.cellValue)
            .toEqual({
                nestedProperty1: 13,
                nestedProperty2: 35
            });

        component.columnConfig.columnDef = 'property2';
        expect(component.cellValue)
            .toEqual(2);

        component.columnConfig.columnDef = 'property1.nestedProperty1';
        expect(component.cellValue)
            .toEqual(13);

        component.columnConfig.columnDef = 'property1.nestedProperty2';
        expect(component.cellValue)
            .toEqual(35);
    });
});
