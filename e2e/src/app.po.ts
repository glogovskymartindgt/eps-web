import { browser, by, element } from 'protractor';

export class AppPage {
    public navigateTo(): any {
        return browser.get(browser.baseUrl) as Promise<any>;
    }

    public getTitleText(): any {
        return element(by.css('iihf-root h1'))
            .getText() as Promise<string>;
    }
}
