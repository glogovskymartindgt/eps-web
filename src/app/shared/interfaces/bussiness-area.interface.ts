import { ListItemSync } from 'hazelnut';

export class BusinessArea {
    public id: number;
    public codeItem: string;
    public name: string;
    public state?: string;
    public shortName?: string;

    public static convertToListItems(list: BusinessArea[]): ListItemSync[] {
        return list.map((item: BusinessArea): ListItemSync => (
            {code: item.id, value: BusinessArea.getLongName(item)}
        ));
    }

    public static convertToListItemsByCode(list: BusinessArea[]): ListItemSync[] {
        return list.map((item: BusinessArea): ListItemSync => (
            {code: item.shortName, value: BusinessArea.getLongName(item)}
        ));
    }

    private static getLongName(item: BusinessArea): string {
        const names: string[] = [];
        if (!!item.shortName) {
            names.push(item.shortName);
        }
        names.push(item.name);

        return names.join(' - ');
    }
}
