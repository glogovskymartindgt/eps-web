export interface EventDataInterface {
    id: number;
    year: number;
    projectName: string;
    firstVenue: string;
    secondVenue: string;
    thirdVenue?: string;
    isEvent: boolean;
    active: boolean;
    imagePath: string;
}
