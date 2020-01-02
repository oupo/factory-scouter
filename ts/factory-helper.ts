import {Entry, ALL_ENTRIES} from './entry';
import {PRNG} from './prng';
import {NSTARTERS} from './constant';

export class FactoryHelper {
	static choose_entry(prng: PRNG, battle_index: number): [PRNG, Entry] {
		let prngp = prng.dup();
		let x = FactoryHelper.choose_entryQ(prngp, battle_index);
		return [prngp, x];
	}

	static choose_entryQ(prng: PRNG, battle_index: number) {
		let [start, end] = FactoryHelper._choice_range(battle_index);
		let i = end - 1 - prng.randQ(end - start);
		return ALL_ENTRIES[i];
	}

	static _choice_range(battle_index: number) {
		if (battle_index != 7) {
			return [0, 150];
		} else {
			return [150, 250];
		}
	}
	
	static choose_entries(prng: PRNG, n: number, battle_index: number, unchoosable: Entry[]=[]) {
		let prngp = prng.dup();
		let x = FactoryHelper.choose_entriesQ(prngp, n, battle_index, unchoosable);
		return [prngp, x];
	}
	
	static choose_entriesQ(prng: PRNG, n: number, battle_index: number, unchoosable: Entry[]=[]) {
		let entries: Entry[] = [];
		while (entries.length < n) {
			let entry = FactoryHelper.choose_entryQ(prng, battle_index);
			if (!entry.collides_within([...entries, ...unchoosable])) {
				entries.push(entry);
			}
		}
		return entries;
	}

	static choose_starters(prng: PRNG): [PRNG, Entry[]] {
		let prngp = prng.dup();
		let starters = FactoryHelper.choose_startersQ(prngp);
		return [prngp, starters];
	}

	static choose_startersQ(prng: PRNG) {
		let starters = FactoryHelper.choose_entriesQ(prng, NSTARTERS, 0);
		FactoryHelper._pid_loopQ(prng, starters);
		prng.stepQ(2);
		return starters;
	}

	static after_consumption(prng: PRNG, entries: Entry[], battle_index: number) {
		let prngp = prng.dup();
		FactoryHelper.after_consumptionQ(prngp, entries, battle_index);
		return prngp;
	}

	static after_consumptionQ(prng: PRNG, entries: Entry[], battle_index: number) {
		this._pid_loopQ(prng, entries);
		prng.stepQ(battle_index == 1 ? 24 : 6);
	}

	static _pid_loopQ(prng: PRNG, entries: Entry[]) {
		for (let entry of entries) {
			let trainer_id = FactoryHelper._rand32Q(prng);
			while (true) {
				let pid = FactoryHelper._rand32Q(prng);
				if (pid % 25 == entry.nature) break;
			}
		}
	}

	static _rand32Q(prng: PRNG) {
		let low = prng.randQ(0x10000);
		let high = prng.randQ(0x10000);
		return (high << 16 | low) >>> 0;
	}
}
