import { Observable, of } from 'rxjs';

export class ListItem {
    public static readonly Unselected = new ListItem('unselected', '');

    public readonly value: Observable<string>;
    public readonly code: Observable<string>;

    public constructor(code: string, value: string | Observable<string>) {
        if (typeof value === 'string') {
            this.value = of(value);
        } else {
            this.value = value;
        }

        if (typeof code === 'string') {
            this.code = of(code);
        } else {
            this.code = code;
        }
    }
}
