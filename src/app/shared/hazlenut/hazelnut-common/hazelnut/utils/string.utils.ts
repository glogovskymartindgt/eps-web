import { Regexp } from '../others/regexp';

const accentedLowerCharacters = 'ąàáäâãåæăćčĉďęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž';
const normalLowerCharacters = 'aaaaaaaaacccdeeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz';
const accentedCharacters = accentedLowerCharacters + accentedLowerCharacters.toUpperCase();
const normalCharacters = normalLowerCharacters + normalLowerCharacters.toUpperCase();

function addLeadingZero(text: string): string {
    return '0' + text;
}

export class StringUtils {

    public static removeAccentedCharacters(word: string): string {
        if (!word || !word.replace) {
            return word;
        }

        return word.replace(/./g, (e: string) => {
            const index = accentedCharacters.indexOf(e);

            return index >= 0 ? normalCharacters[index] : e;
        });
    }

    public static join(data: string[], delimiter = ' ', prefix = '', postfix = ''): string {
        if (!Array.isArray(data)) {
            return prefix + data + postfix;
        }

        return `${prefix}${data.join(delimiter)}${postfix}`;
    }

    public static isValidEmail(email: string): boolean {
        if (!email) {
            return false;
        }

        return Regexp.validEmailRegex.test(email.trim());
    }

    public static isValidPhoneNumber(phoneNumber: string): boolean {
        if (!phoneNumber) {
            return false;
        }

        return Regexp.validPhoneNumberRegex.test(phoneNumber.trim());
    }

    public static getLastPart(text: string, divider = ' '): string {
        if (!text) {
            return text;
        }
        const splitText = text.split(divider);
        if (splitText.length === 0) {
            return text;
        }

        return splitText[splitText.length - 1];
    }

    public static toBasicForm(text: string): string {
        return StringUtils.removeAccentedCharacters(text.toLowerCase());
    }

    public static contains(text: string, substring: string): boolean {
        return !!text && StringUtils.removeAccentedCharacters(text.toLowerCase()).indexOf(substring) >= 0;
    }

    public static getFormattedNumber(phoneNumber: string, prefix = '+421'): string {
        phoneNumber = phoneNumber.replace(/[( )/-]/g, '');
        if (phoneNumber.startsWith('+')) {
            return phoneNumber;
        }
        if (phoneNumber.startsWith('00')) {
            return phoneNumber.substring(2);
        }
        if (phoneNumber.startsWith('09') || phoneNumber.startsWith('02')) {
            return prefix + phoneNumber.substring(1);
        }

        return phoneNumber;
    }

    public static format(text: string, args: any): string {
        for (const property in args) {
            if (args.hasOwnProperty(property)) {
                text = text.replace(`\${${property}}`, args[property]);
            }
        }

        return text;
    }

    public static convertDateStringToDotString(date: string): string {
        const d = new Date(date);
        const day = d.getDate() + '';
        const month = (d.getMonth() + 1) + '';
        const year = d.getFullYear();

        return `${day}.${month}.${year}`;
    }

    public static convertCamelToSnakeUpper(camelCaseString: string): string {
        return StringUtils.convertCamelToSnake(camelCaseString).toUpperCase();
    }

    public static convertCamelToSnake(camelCaseString: string): string {
        return camelCaseString.replace(/([a-z])([A-Z])/g, '$1_$2');
    }

    public static convertSnakeToCamel(snakeCaseString: string): string {
        if (!snakeCaseString) {
            return snakeCaseString;
        }
        return snakeCaseString.toLowerCase().replace(/(_[a-z])+/g, (e) => e.toUpperCase()).replace('_', '');
    }

    public static convertDateStringToIsoString(date: string): string {
        const d = new Date(date);
        let day = d.getDate() + '';
        let month = (d.getMonth() + 1) + '';
        const year = d.getFullYear();

        if (month.length < 2) {
            month = addLeadingZero(month);
        }

        if (day.length < 2) {
            day = addLeadingZero(day);
        }

        return `${year}-${month}-${day}`;
    }

}

export function contains(text: string, substring: string): boolean {
    return text.indexOf(substring) >= 0;
}

function fuzzy_match_simple(pattern: string, str: string): boolean {
    let patternIdx = 0;
    let strIdx = 0;
    const patternLength = pattern.length;
    const strLength = str.length;

    while (patternIdx !== patternLength && strIdx !== strLength) {
        const patternChar = pattern.charAt(patternIdx).toLowerCase();
        const strChar = str.charAt(strIdx).toLowerCase();
        if (patternChar === strChar) {
            ++patternIdx;
        }
        ++strIdx;
    }

    return patternLength !== 0 && strLength !== 0 && patternIdx === patternLength;
}
