export function checkAndRemoveLastDotComma(value: string): string {
    let checked = value;
    if ((checked === null || checked === undefined)) {
        return null;
    }
    const lastCharacter = checked.toString()
                               .slice(-1);
    if (lastCharacter !== '' && (lastCharacter === '.' || lastCharacter === ',')) {
        checked = checked.toString()
                     .substring(0, checked.toString().length - 1);
    }
    checked = checked.replace(',', '.');
    checked = checked.split(' ')
                 .join('');

    return checked;
}
