// @dynamic
export class Regexp {
    public static readonly validPhoneNumberRegex = /^([+]|00)?[(]?[0-9]{3,4}[)]?[-\s.]?[0-9]{2,3}[-\s.]?[0-9]{2,6}([-\s.]?[0-9]{3})?$/im;

    // Format d.M.yyyy
    public static readonly dateSimpleDotPattern = /^(((0?[1-9])|([12][0-9])|([3][0-1]))\.((0?[1-9])|(1[0-2]))\.[0-9]{4})?$/;

    public static readonly numericCharactersPattern = '^-?(\\d*)?$';
}
