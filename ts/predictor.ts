import {Entry} from './entry';
import {FactoryHelper} from './factory-helper';
import {NPARTY, NBATTLES} from './constant';
import { PRNG } from './prng';
import { Util } from './util';

export class Predictor {
	constructor() {
	}

	static predict(prng: PRNG) {
		return new Predictor().predict(prng);
	}

	predict(prng: PRNG) {
		let [prngp, starters] = FactoryHelper.choose_starters(prng);
		return this.predict0(prngp, [], [], starters);
	}

	predict0(prng: PRNG, enemies: Entry[][], skipped: Entry[][], starters: Entry[]): [PRNG, Entry[][], Entry[][], Entry[]][] {
		if (enemies.length == NBATTLES) {
			return [[prng, enemies, skipped, starters]];
		}
		let unchoosable = enemies[enemies.length - 1] || starters;
		let maybe_players = [...starters, ...Util.arrayFlatten(enemies.slice(0, -1))];
		let battle_index = enemies.length + 1;
		let results = OneEnemyPredictor.predict(prng, unchoosable, maybe_players, battle_index);
		return Util.arrayFlatten(results.map(result => {
            let [prngp, chosen, skippedp] = result;
			return this.predict0(prngp, [...enemies, chosen], [...skipped, skippedp], starters);
		}));
	}
}


export class OneEnemyPredictor {
    unchoosable: Entry[];
    maybe_players: Entry[];
    battle_index: number;
    constructor(unchoosable: Entry[], maybe_players: Entry[], battle_index: number) {
		this.unchoosable = unchoosable;
		this.maybe_players = maybe_players;
		this.battle_index = battle_index;
	}

	static predict(prng: PRNG, unchoosable: Entry[], maybe_players: Entry[], battle_index: number) {
		return new OneEnemyPredictor(unchoosable, maybe_players, battle_index).predict(prng);
	}

	predict(prng: PRNG) {
		return this.predict0(prng, [], [])
	}
	
	predict0(prng: PRNG, skipped: Entry[], chosen: Entry[]): [PRNG, Entry[], Entry[]][] {
		if (chosen.length == NPARTY) {
			let prngp = FactoryHelper.after_consumption(prng, chosen, this.battle_index);
			return [[prngp, chosen, skipped]];
		}
		let [prngp, x] = FactoryHelper.choose_entry(prng, this.battle_index);
		if (x.collides_within([...this.unchoosable, ...chosen, ...skipped])) {
			return this.predict0(prngp, skipped, chosen);
		} else if (!x.collides_within(this.maybe_players) || skipped.length == NPARTY) {
			return this.predict0(prngp, skipped, [...chosen, x]);
		} else {
			let result1 = this.predict0(prngp, skipped, [...chosen, x]);
			let result2 = this.predict0(prngp, [...skipped, x], chosen);
			return [...result1, ...result2];
		}
	}
}