/**
 * Object representing response from browse API
 */
export class BrowseResponse<T> {
    public content: T[];
    public totalElements: number;

    public constructor(array?: BrowseResponse<T> | T[], totalElements?: number) {
        if (!array) {
            this.content = [];
            totalElements = 0;
        } else if (Array.isArray(array)) {
            this.content = array;
            this.totalElements = array.length;
        } else {
            this.content = array.content;
            this.totalElements = array.totalElements;
        }

        if (!isNaN(totalElements)) {
            this.totalElements = totalElements;
        }
    }
}
