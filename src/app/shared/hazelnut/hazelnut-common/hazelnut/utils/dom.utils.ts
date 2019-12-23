export class DomUtils {
    public static getWidth(): number {
        // @ts-ignore
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }
}
