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
    | 'ICO'
    | 'HEALTHCARE_PERIOD_CODE'
    | 'HEALTHCARE_TYPE'
    | 'ID'
    | 'SPECIALIZATION'
    | 'HEALTCARE_TYPE'
    | 'PRESCRIPTION_DATE'
    | 'PRESCRIPTION'
    |
    'DOCTOR_CODE'
    | 'DOCTOR_NAME'
    | 'PRODUCT_CODE'
    | 'PRODUCT_NAME'
    | 'INSURED_SURNAME_AND_NAME'
    | 'INSURED_BIRTHNUMBER'
    |
    'HEALTHCARE_DATE'
    | 'PRODUCT_QUANTITY_FILTER'
    | 'PRODUCT_PRICE_APPROVED'
    | 'INSURED_AGE'
    | 'CREATED'
    | 'DOCUMENT_TYPE'
    | 'SPECIALIZATION_CODE'
    | 'ENTITY_CODE' | 'READ' | 'VALIDITY_START'
    |
    'PLACE_ID';
