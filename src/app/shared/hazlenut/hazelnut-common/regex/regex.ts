/*
 naming convention is to use <yourDefinition>Pattern
 */

export class Regex {
    // Format d.M.yyyy
    public static readonly dateDotPattern = '^(((0?[1-9])|([12][0-9])|([3][0-1]))\\.((0?[1-9])|(1[0-2]))\\.[0-9]{4})?$';

    public static readonly numberPattern = '^-?(0|[1-9]\\d*)?$';

    public static readonly numericCharactersPattern = '^-?(\\d*)?$';

    public static readonly icoPattern = '^([0-9]{8})$';

    public static readonly yearPattern = '^[1-9][0-9]*$';

    public static readonly numericPattern = '^[0-9]*$';

    public static readonly notOnlyWhiteCharactersPattern = '^[\\s \\S]*[\\S]+[\\s \\S]*$';

    public static readonly doublePattern = '^[0-9.]*$';

    public static readonly decimalPattern = '^[0-9\\s]*[.|,]?[0-9]{0,2}$';

    public static readonly telPattern = '^[0-9\\/*+().\\- ]*$';

    public static readonly figuresPattern = '^[0-9]{1,}$';

    public static readonly emailPattern = '^\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,}\\b$';

    public static readonly fileNameFromContentDispositionPattern = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

    /**
     *
     * (?!^)            # Assert we are not at start of line
     * (?=              # start of positive lookahead
     *      (?:\d{3})+  # assert there are 1 or more of 3 digit sets ahead
     *      (?:\.|$)    # followed by decimal point or end of string
     * )                # end of lookahead
     */
    public static readonly thousandSeparatorOccurenceWithMaxTwoDecimal = /(?!^)(?=(?:\d{3})+(?:\.|$))/gm;

    public static readonly youtubeLinkTextPattern = '^.*(http(?:s?):\\/\\/(?:www\\.)?youtu(?:be\\.com\\/watch\\?v=|\\.be\\/)([\\w\\-\\_]*)(&(amp;)?‌ [\\w\\?‌ =]*)?){1}.*$';
    public static readonly youtubeLinkPattern = '^http(?:s?):\\/\\/(?:www\\.)?youtu(?:be\\.com\\/watch\\?v=|\\.be\\/)([\\w\\-\\_]*)(&(amp;)?‌ [\\w\\?‌ =]*)?$';

}
