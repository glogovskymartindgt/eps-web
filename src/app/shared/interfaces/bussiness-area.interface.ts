import { ListItemSync } from 'hazelnut';

export class BusinessArea {
    public id: number;
    public codeItem: string;
    public name: string;
    public state?: string;
    public shortName?: string;

    public static convertToListItems(list: BusinessArea[]): ListItemSync[] {
        return list.map((item: BusinessArea): ListItemSync => {
            const names: string[] = [];
            if (!!item.shortName) {
                names.push(item.shortName);
            }
            names.push(item.name);

            return {code: item.id, value: names.join(' - ')};
        });
    }
}
