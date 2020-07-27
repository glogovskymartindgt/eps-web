import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    public constructor() {
    }

    public readFile(blob: Blob, func): any {
        const reader = new FileReader();
        reader.onload = (): void => {
            func(reader.result as string);
        };
        reader.readAsDataURL(blob);
    }

    public readFile$(file: File | Blob): Observable<string> {
        const result: Subject<string> = new Subject<string>();

        const reader = new FileReader();
        reader.onload = (): void => {
            result.next(reader.result as string);
            result.complete();
        };
        reader.onerror = (error: any): void => {
            result.error(error);
            result.complete();
        };
        reader.readAsDataURL(file);

        return result.asObservable();
    }
}
