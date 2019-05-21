import { Direction, Precedence, Property } from './types.model';

/**
 * Sort object used in browse API criteria
 */
export class Sort {
    public property: Property;
    public direction: Direction;
    public nullPrecedence: Precedence;

    public constructor(property: Property = 'ID', direction: Direction = 'ASC', precedence: Precedence = 'NONE') {
        this.property = property;
        this.direction = direction;
        this.nullPrecedence = precedence;
    }
}
