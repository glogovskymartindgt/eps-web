export type LogicalOperator = 'AND' | 'OR';
export type Operator = 'EQ' | 'GT' | 'GOE' | 'NE' | 'LT' | 'LOE' | 'BETWEEN_DATE_TIME' | 'LIKE_IGNORE_CASE' | 'IS_NULL';
export type ValueType = 'STRING' | 'NUMBER' | 'DATE' | 'DATE_TIME' | 'ENUM' | 'TYPE';
export type Value = string | number;
export type Direction = 'ASC' | 'DESC';
export type Precedence = 'NONE' | 'FIRST' | 'LAST';
export type State = 'ACTIVE' | 'INACTIVE';
export type Color = 'BLACK';
export type Property =
    'TYPE'
    | 'ID'
    | 'CREATED'
    | 'ENTITY_CODE'
    | 'READ'
    | 'VALIDITY_START'
    | 'NAME'
    | 'STATE'
    | 'RESPONSIBLE_USER'
    | 'CATEGORY_NAME'
    | 'CODE'
    ;
