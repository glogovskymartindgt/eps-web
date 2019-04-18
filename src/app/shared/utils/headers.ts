import { Regex } from '../hazlenut/hazelnut-common/regex/regex';

export function GetFileNameFromContentDisposition(disposition: string): string {
    let exportName: string = "EXPORT";

    if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = Regex.fileNameFromContentDispositionPattern;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) { 
            exportName = matches[1].replace(/['"]/g, '');
        }
    }

    return exportName;
}
