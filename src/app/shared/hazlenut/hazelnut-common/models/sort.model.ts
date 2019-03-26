import { Direction, Precedence, Property } from './types.model';

export class Sort {
    public property: Property;
    public direction: Direction;
    public nullPrecedence: Precedence;

    // public constructor(property: Property = 'ID', direction: Direction = 'ASC', precedence: Precedence = 'NONE') {
    public constructor(property: Property = 'STATE', direction: Direction = 'ASC', precedence: Precedence = 'NONE') {
        this.property = property;
        this.direction = direction;
        this.nullPrecedence = precedence;
    }
}
