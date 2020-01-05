import { FACTORY_DATA } from './data';

export class Entry {
    public id: number;
    public item: number;
    public pokemon: number;
    public nature: number;
    public moves: number[];
    public effort: string;
    constructor(id: number, item: number, pokemon: number, nature: number, moves: number[], effort: string) {
        this.id = id;
        this.item = item;
        this.pokemon = pokemon;
        this.nature = nature;
        this.moves = moves;
        this.effort = effort;
    }
    public collides_with(other: Entry) {
        return this.item === other.item || this.pokemon === other.pokemon;
    }
    public collides_within(entries: Entry[]) {
        return entries.some((x) => this.collides_with(x));
    }
}

export const ALL_ENTRIES = FACTORY_DATA.map((data, i) => {
    return new Entry(i, data[2], data[0], data[1], data.slice(3, 7) as number[], data[7]);
});
