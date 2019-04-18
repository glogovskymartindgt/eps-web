/*
naming convention is to use <yourDefinition>Pattern
 */

export class Regex {
    // format d.M.yyyy
    public static readonly dateDotPattern = '^(((0?[1-9])|([12][0-9])|([3][0-1]))\\.((0?[1-9])|(1[0-2]))\\.[0-9]{4})?$';

    public static readonly numberPattern = '^-?(0|[1-9]\\d*)?$';

    public static readonly numericCharactersPattern = '^-?(\\d*)?$';

    public static readonly icoPattern = '^([0-9]{8})$';

    public static readonly numericPattern = '^[0-9]*$';

    public static readonly notOnlyWhiteCharactersPattern = '^[\\s \\S]*[\\S]+[\\s \\S]*$';

    public static readonly doublePattern = '^[0-9.]*$';

    public static readonly telPattern = '^[0-9\\/*+().\\- ]*$';

    public static readonly figuresPattern = '^[0-9]{1,}$';

    public static readonly emailPattern = '^\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,}\\b$';

    public static readonly fileNameFromContentDispositionPattern = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
}
