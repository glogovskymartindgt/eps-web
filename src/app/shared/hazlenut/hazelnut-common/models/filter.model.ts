import { LogicalOperator, Operator, Property, Value, ValueType } from './types.model';

export class Filter {
    public logicalOperator: LogicalOperator;
    public valueType: ValueType;
    public property: string;
    public operator: Operator;
    public value: Value;

    public constructor(property: string,
                       value: Value,
                       type: ValueType = 'STRING',
                       operator: Operator = 'EQ',
                       logicalOperator: LogicalOperator = 'AND') {

        this.logicalOperator = logicalOperator;
        this.property = property;
        this.value = value;
        this.valueType = type;
        this.operator = operator;
    }
}
