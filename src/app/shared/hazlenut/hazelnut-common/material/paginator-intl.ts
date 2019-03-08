import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PaginatorIntl extends MatPaginatorIntl {
    public translate: TranslateService;
    public itemsPerPageLabel;
    public nextPageLabel;
    public previousPageLabel;
    public firstPageLabel;
    public lastPageLabel;
    public from;

    public getRangeLabel = (page, pageSize, length) => {
        if (length === 0 || pageSize === 0) {
            return `0 ${this.from} ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex === 0 ? 1 : startIndex} - ${endIndex} ${this.from} ${length}`;
    };

    public injectTranslateService(translate: TranslateService) {
        this.translate = translate;
        this.translate.onLangChange.subscribe(() => {
            this.translateLabels();
        });
        this.translateLabels();
    }

    public translateLabels() {
        this.itemsPerPageLabel = this.translate.instant('paginator.itemsPerPage');
        this.nextPageLabel = this.translate.instant('paginator.nextPage');
        this.previousPageLabel = this.translate.instant('paginator.previousPage');
        this.firstPageLabel = this.translate.instant('paginator.firstPage');
        this.lastPageLabel = this.translate.instant('paginator.lastPage');
        this.from = this.translate.instant('paginator.from');
    }

}
