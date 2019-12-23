import { StringMap } from '..';

const temporaryErrors: StringMap = {
    'timeout': 'error.timeout',
    'no matching constant for [555]': 'error.unknownConstant555',
};

export class MiscUtils {
    public static getErrorMessage(error: string | { message?: string, error?: { message?: string } }): string {
        let textMessageKey = 'error.system_error';

        if (typeof error === 'string') {
            textMessageKey = error;
        } else if (error.error) {
            const errorJson = error.error;
            if (errorJson.message) {
                textMessageKey = errorJson.message;
            }
        } else if (error.message) {
            textMessageKey = error.message;
        }

        return temporaryErrors[textMessageKey.toLocaleLowerCase().trim()] || textMessageKey;
    }

    public static isFunction(arg: any): boolean {
        return typeof arg === 'function';
    }
}
