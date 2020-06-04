/*
 naming convention is to use <yourDefinition>Pattern
 */

export class Regex {
    // Format d.M.yyyy
    public static readonly dateDotPattern = '^(((0?[1-9])|([12][0-9])|([3][0-1]))\\.((0?[1-9])|(1[0-2]))\\.[0-9]{4})?$';

    public static readonly yearPattern = '^[1-9][0-9]*$';

    public static readonly numericPattern = '^[0-9]*$';

    public static readonly notOnlyWhiteCharactersPattern = '^[\\s \\S]*[\\S]+[\\s \\S]*$';

    public static readonly decimalPattern = '^[0-9\\s]*[.|,]?[0-9]{0,2}$';

    public static readonly emailPattern = '^\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,}\\b$';

    public static readonly internationalPhonePattern = '^\\+(?:[0-9] ?){9,12}[0-9]$';

    public static readonly fileNameFromContentDispositionPattern = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

    public static readonly userPassword = '^(?=.*[A-Z])(?=.*[\\d !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~])[A-Za-z\\d !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~]{8,}$';

    public static readonly loginStringPattern = '^([a-zA-Z0-9.-_]*)$';

    /**
     *
     * (?!^)            # Assert we are not at start of line
     * (?=              # start of positive lookahead
     *      (?:\d{3})+  # assert there are 1 or more of 3 digit sets ahead
     *      (?:\.|$)    # followed by decimal point or end of string
     * )                # end of lookahead
     */
    public static readonly thousandSeparatorOccurrenceWithMaxTwoDecimal = /(?!^)(?=(?:\d{3})+(?:\.|$))/gm;

    public static readonly youtubeLinkPattern = '^((?:http(?:s?):)?\\/\\/)?((?:www|m)\\.)?((?:youtube\\.com|youtu.be))(\\/(?:[\\w\\-]+\\?v=|embed\\/|v\\/)?)([\\w\\-]+)(\\S+)?$';

    public static readonly httpsStringPattern = '^(https|HTTPS)[^\\s]+$';
}
