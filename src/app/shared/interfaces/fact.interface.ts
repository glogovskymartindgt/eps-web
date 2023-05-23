export interface Fact {
    id: number;
    category: string;
    subCategory: string;
    measureUnit: string;
    venue1: string;
    venueValue1: number;
    venue2: string;
    venueValue2: number;
    venue3: string;
    venueValue3: number;
    factItemState: string;
    description?: string;
}
