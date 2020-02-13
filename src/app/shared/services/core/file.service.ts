import { Injectable } from '@angular/core';

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
}
