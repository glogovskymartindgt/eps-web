export class TableResponse<T> {
    public content: T[];
    public totalElements: number;

    public constructor(array?: T[]) {
        if (array) {
            this.content = array;
            this.totalElements = array.length;
        }
    }
}
