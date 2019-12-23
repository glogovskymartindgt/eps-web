export class ObjectUtils {
    public static getNestedProperty(object: any, propertyPath: string, separator = '.'): any {
        const propertyList = propertyPath.split(separator);

        return propertyList.reduce((currentNestedPropertyValue, propertyName) => {
            return currentNestedPropertyValue ? currentNestedPropertyValue[propertyName] : undefined;
        }, object);
    }

    // TODO add has childProperty method here

}
