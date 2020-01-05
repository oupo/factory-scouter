import {FACTORY_DATA} from './data';

export class Entry {
    id: number;
    item: number;
    pokemon: number;
	nature: number;
	moves: number[];
	effort: string;
	constructor(id: number, item: number, pokemon: number, nature: number, moves: number[], effort: string) {
		this.id = id;
		this.item = item;
		this.pokemon = pokemon;
		this.nature = nature;
		this.moves = moves;
		this.effort = effort;
	}
	collides_with(other: Entry) {
		return this.item == other.item || this.pokemon == other.pokemon;
	}
	collides_within(entries: Entry[]) {
		return entries.some(x => this.collides_with(x))
	}
}

export const ALL_ENTRIES = FACTORY_DATA.map((data, i) => {
    return new Entry(i, data[2], data[0], data[1], <number[]>data.slice(3, 7), data[7]);
});