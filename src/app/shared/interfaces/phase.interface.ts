export interface Phase {
    id: number;
    phaseId: number;
    value: number;
    name: string;
    checkPointFrom: string;
    checkPointTo: string;
    description?: string;
    state: string;
}
