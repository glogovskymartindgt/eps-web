import { CodeListPhaseInterface } from './code-list-phase.interface';

export interface Phase {
    id: number;
    phaseId: number;
    value: number;
    clPhase: CodeListPhaseInterface;
    checkPointFrom: string;
    checkPointTo: string;
    description?: string;
    state: string;
}
