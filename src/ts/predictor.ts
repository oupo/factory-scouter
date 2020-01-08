import { NBATTLES, NPARTY } from './constant';
import { Entry } from './entry';
import { FactoryHelper, IRankObject } from './factory-helper';
import { PRNG } from './prng';
import { Util } from './util';
import { Judger } from './judger';
import { Togasat } from './togasat';
import { MyJudger } from './myjudger';

export class Predictor {
    private togasat: Togasat;
    private is_hgss: boolean;
    private is_open_level: boolean;
    private round: number;
    private num_bonus: number;
    constructor(togasat: Togasat, is_hgss: boolean, is_open_level: boolean, round: number, num_bonus: number) {
        this.togasat = togasat;
        this.is_hgss = is_hgss;
        this.is_open_level = is_open_level;
        this.round = round;
        this.num_bonus = num_bonus;
    }
    public static predict(togasat: Togasat, prng: PRNG, is_hgss: boolean, is_open_level: boolean, round: number, num_bonus: number) {
        return new Predictor(togasat, is_hgss, is_open_level, round, num_bonus).predict(prng);
    }

    public predict(prng: PRNG) {
        let [prngp, trainers] = FactoryHelper.rand_trainers(prng, this.round, this.is_hgss);
        let [prngpp, starters] = FactoryHelper.choose_starters(prngp, this.is_open_level, this.round, this.num_bonus);
        return this.predict0(prngpp, [], [], starters, trainers);
    }

    public predict0(prng: PRNG, enemies: Entry[][], skipped: Entry[][], starters: Entry[], trainers: number[]): IPredictResultNode[] {
        if (enemies.length === NBATTLES) {
            return [];
        }
        let unchoosable = enemies.length > 0 ? enemies[enemies.length - 1] : starters;
        let maybe_players = [...starters, ...Util.arrayFlatten(enemies.slice(0, -1))];
        let battle_index = enemies.length + 1;
        let rank = FactoryHelper.trainer_id_to_rank(this.is_open_level, this.is_hgss, trainers[battle_index - 1]);
        let results = OneEnemyPredictor.predict(prng, unchoosable, maybe_players, this.round, battle_index, rank);

        return Util.compact(results.map((result) => {
            let [prngp, chosen, skippedp] = result;
            let enemiesp = [...enemies, chosen];
            let skippedpp = [...skipped, skippedp];
            let res1 = MyJudger.judge(starters, enemiesp, skippedpp);
            let res2 = Judger.judge(this.togasat, starters, enemiesp, skippedpp);
            if (res1 != res2) {
                debugger;
            }
            if (res2) {
                let children = this.predict0(prngp, enemiesp, skippedpp, starters, trainers);
                return { prng: prngp, chosen: chosen, skipped: skippedp, starters: starters, predEnemies: enemies, children: children };
            } else {
                return { prng: prngp, chosen: chosen, skipped: skippedp, starters: starters, predEnemies: enemies, children: [] };
            }
        }));

    }
}

export interface IPredictResultNode {
    prng: PRNG;
    chosen: Entry[];
    skipped: Entry[];
    starters: Entry[];
    predEnemies: Entry[][];
    children: IPredictResultNode[];
}

export class OneEnemyPredictor {
    public static predict(prng: PRNG, unchoosable: Entry[], maybe_players: Entry[], round: number, battle_index: number, rank: IRankObject) {
        return new OneEnemyPredictor(unchoosable, maybe_players, round, battle_index, rank).predict(prng);
    }
    public unchoosable: Entry[];
    public maybe_players: Entry[];
    public round: number;
    public battle_index: number;
    public rank: IRankObject;
    constructor(unchoosable: Entry[], maybe_players: Entry[], round: number, battle_index: number, rank: IRankObject) {
        this.unchoosable = unchoosable;
        this.maybe_players = maybe_players;
        this.round = round;
        this.battle_index = battle_index;
        this.rank = rank;
    }

    public predict(prng: PRNG) {
        return this.predict0(prng, [], []);
    }

    public predict0(prng: PRNG, skipped: Entry[], chosen: Entry[]): Array<[PRNG, Entry[], Entry[]]> {
        if (chosen.length === NPARTY) {
            let prngp = FactoryHelper.after_consumption(prng, chosen, this.round, this.battle_index, this.rank);
            return [[prngp, chosen, skipped]];
        }
        let [prngp, x] = FactoryHelper.choose_entry(prng, this.rank);
        if (x.collides_within([...this.unchoosable, ...chosen]) || skipped.indexOf(x) >= 0) {
            return this.predict0(prngp, skipped, chosen);
        } else if (!x.collides_within(this.maybe_players) || this.fullSkipped(skipped)) {
            return this.predict0(prngp, skipped, [...chosen, x]);
        } else {
            let result1 = this.predict0(prngp, skipped, [...chosen, x]);
            let result2 = this.predict0(prngp, [...skipped, x], chosen);
            return [...result1, ...result2];
        }
    }

    // スキップ済みのエントリーの中に異なるポケモンが3匹、異なるアイテムが3個あればそれ以上新しいスキップエントリーは追加不能
    private fullSkipped(skipped: Entry[]) {
        let skippedPokes: number[] = [];
        let skippedItems: number[] = [];
        for (let e of skipped) {
            if (skippedPokes.indexOf(e.pokemon) === -1) skippedPokes.push(e.pokemon);
            if (skippedItems.indexOf(e.item) === -1) skippedItems.push(e.item);
        }
        return skippedPokes.length >= NPARTY && skippedItems.length >= NPARTY;
    }
}
