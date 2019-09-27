export class BlobManager {

    public static downloadFromBlob(blob: any, type: string, filename: string) {
        let link: HTMLAnchorElement;
        link = document.createElement('a');
        link.setAttribute('class', 'hide');
        link.setAttribute('href', '');
        document.body.appendChild(link);
        link.href = URL.createObjectURL(new Blob([blob], {type}));
        link.download = filename;
        link.click();
        document.body.removeChild(link);
    }

}
