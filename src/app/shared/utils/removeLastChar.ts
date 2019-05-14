export function checkAndRemoveLastDotComma(value: string): string {
    const lastCharacter = value.toString().slice(-1);
    if (lastCharacter !== '' && (lastCharacter === "." || lastCharacter === ",")) {
        value = value.toString().substring(0, value.toString().length-1);
    };
    return value;
}
