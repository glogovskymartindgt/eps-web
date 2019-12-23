export class TranslateUtils {
    public static getBrowserLanguage(): string | null {
        if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
            return null;
        }
        const navigator: any = window.navigator;

        let browserLang = navigator.languages ? navigator.languages[0] : null;
        browserLang = browserLang || navigator.language || navigator.browserLanguage || navigator.userLanguage;
        if (browserLang.indexOf('-') > 0) {
            browserLang = browserLang.split('-')[0];
        }
        if (browserLang.indexOf('_') > 0) {
            browserLang = browserLang.split('_')[0];
        }
        return browserLang;
    }
}
