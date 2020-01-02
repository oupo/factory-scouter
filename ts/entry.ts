import {FACTORY_DATA} from './data';

export class Entry {
    id: number;
    item: number;
    pokemon: number;
    nature: number;
	constructor(id: number, item: number, pokemon: number, nature: number) {
		this.id = id;
		this.item = item;
		this.pokemon = pokemon;
		this.nature = nature;
	}
	collides_with(other: Entry) {
		return this.item == other.item || this.pokemon == other.pokemon;
	}
	collides_within(entries: Entry[]) {
		return entries.some(x => this.collides_with(x))
	}
}

export const ALL_ENTRIES = FACTORY_DATA.map((data, i) => {
    return new Entry(i, data[2], data[0], data[1]);
});