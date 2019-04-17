export function GetFileNameFromContentDisposition(disposition: string): string {

    let exportName: string = "EXPORT";

    if (disposition && disposition.indexOf('attachment') !== -1) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) { 
            exportName = matches[1].replace(/['"]/g, '');
        }
    }

    return exportName;

}
