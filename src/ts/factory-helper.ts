import { NSTARTERS } from './constant';
import { ALL_ENTRIES, Entry } from './entry';
import { PRNG } from './prng';

export interface IRankObject {
    is_open_level: boolean;
    rank: number;
    range_min: number;
    range_max: number;
    iv: number;
}

const ENTRY_RANGES: number[][] = [
    [0, 0],
    [1, 150],
    [151, 250],
    [251, 350],
    [351, 486],
    [487, 622],
    [623, 758],
    [759, 894],
    [351, 950],
];

const RANKS_LV50: IRankObject[] = [
    null,
    { is_open_level: false, rank: 1, range_min: ENTRY_RANGES[1][0], range_max: ENTRY_RANGES[1][1], iv: 0 },
    { is_open_level: false, rank: 2, range_min: ENTRY_RANGES[2][0], range_max: ENTRY_RANGES[2][1], iv: 4 },
    { is_open_level: false, rank: 3, range_min: ENTRY_RANGES[3][0], range_max: ENTRY_RANGES[3][1], iv: 8 },
    { is_open_level: false, rank: 4, range_min: ENTRY_RANGES[4][0], range_max: ENTRY_RANGES[4][1], iv: 12 },
    { is_open_level: false, rank: 5, range_min: ENTRY_RANGES[5][0], range_max: ENTRY_RANGES[5][1], iv: 16 },
    { is_open_level: false, rank: 6, range_min: ENTRY_RANGES[6][0], range_max: ENTRY_RANGES[6][1], iv: 20 },
    { is_open_level: false, rank: 7, range_min: ENTRY_RANGES[7][0], range_max: ENTRY_RANGES[7][1], iv: 24 },
    { is_open_level: false, rank: 8, range_min: 351, range_max: 950, iv: 31 },
];

const RANKS_OPEN: IRankObject[] = [
    null,
    { is_open_level: true, rank: 1, range_min: ENTRY_RANGES[4][0], range_max: ENTRY_RANGES[4][1], iv: 0 },
    { is_open_level: true, rank: 2, range_min: ENTRY_RANGES[5][0], range_max: ENTRY_RANGES[5][1], iv: 4 },
    { is_open_level: true, rank: 3, range_min: ENTRY_RANGES[6][0], range_max: ENTRY_RANGES[6][1], iv: 8 },
    { is_open_level: true, rank: 4, range_min: ENTRY_RANGES[7][0], range_max: ENTRY_RANGES[7][1], iv: 12 },
    { is_open_level: true, rank: 5, range_min: 623, range_max: 950, iv: 16 },
    { is_open_level: true, rank: 6, range_min: 623, range_max: 950, iv: 20 },
    { is_open_level: true, rank: 7, range_min: 623, range_max: 950, iv: 24 },
    { is_open_level: true, rank: 8, range_min: 351, range_max: 950, iv: 31 },
];

const RANKS_OPEN_TRAINER: IRankObject[] = [
    null,
    { is_open_level: true, rank: 1, range_min: ENTRY_RANGES[4][0], range_max: ENTRY_RANGES[4][1], iv: 0 },
    { is_open_level: true, rank: 2, range_min: ENTRY_RANGES[5][0], range_max: ENTRY_RANGES[5][1], iv: 4 },
    { is_open_level: true, rank: 3, range_min: ENTRY_RANGES[6][0], range_max: ENTRY_RANGES[6][1], iv: 8 },
    { is_open_level: true, rank: 4, range_min: ENTRY_RANGES[7][0], range_max: ENTRY_RANGES[7][1], iv: 12 },
    { is_open_level: true, rank: 5, range_min: 351, range_max: 950, iv: 16 },
    { is_open_level: true, rank: 6, range_min: 351, range_max: 950, iv: 20 },
    { is_open_level: true, rank: 7, range_min: 351, range_max: 950, iv: 24 },
    { is_open_level: true, rank: 8, range_min: 351, range_max: 950, iv: 31 },
];

const RANK_MIDBOSS_LV50_PT: IRankObject = {is_open_level: false, rank: 4, range_min: ENTRY_RANGES[7][0], range_max: ENTRY_RANGES[7][1], iv: 12};
const RANK_MIDBOSS_LV50_HGSS: IRankObject = {is_open_level: false, rank: 4, range_min: ENTRY_RANGES[7][0], range_max: ENTRY_RANGES[7][1], iv: 12};
const RANK_MIDBOSS_OPEN_PT: IRankObject = {is_open_level: true, rank: 4, range_min: 759, range_max: 950, iv: 12};
const RANK_MIDBOSS_OPEN_HGSS: IRankObject = {is_open_level: true, rank: 4, range_min: 351, range_max: 486, iv: 12};

const RANK_FNLBOSS_LV50_PT: IRankObject = {is_open_level: false, rank: 8, range_min: 351, range_max: 486, iv: 31};
const RANK_FNLBOSS_LV50_HGSS: IRankObject = {is_open_level: false, rank: 8, range_min: 759, range_max: 950, iv: 31};
const RANK_FNLBOSS_OPEN_PT: IRankObject = {is_open_level: true, rank: 8, range_min: 759, range_max: 950, iv: 31};
const RANK_FNLBOSS_OPEN_HGSS: IRankObject = {is_open_level: true, rank: 8, range_min: 759, range_max: 950, iv: 31};

const MIDBOSS_ID = 300;
const FNLBOSS_ID = 301;

export class FactoryHelper {
    public static starter_rank(is_open_level: boolean, rank: number): IRankObject {
        return (is_open_level ? RANKS_OPEN : RANKS_LV50)[Math.min(rank, 8)];
    }

    public static trainer_rank(is_open_level: boolean, rank: number) {
        let r = Math.min(rank, 8);
        if (is_open_level) {
            return RANKS_OPEN_TRAINER[r];
        } else {
            return RANKS_LV50[r];
        }
    }

    public static trainer_id_to_rank_basis(id: number) {
        if (id <= 99) return 1;
        if (id <= 119) return 2;
        if (id <= 139) return 3;
        if (id <= 159) return 4;
        if (id <= 179) return 5;
        if (id <= 199) return 6;
        if (id <= 219) return 7;
        if (id <= 299) return 8;
        return 0;
    }

    public static trainer_id_to_rank(is_open_level: boolean, is_hgss: boolean, id: number) {
        switch (id) {
        case MIDBOSS_ID:
            if (is_open_level) {
                if (is_hgss) return RANK_MIDBOSS_OPEN_HGSS;
                else return RANK_MIDBOSS_OPEN_PT;
            } else {
                if (is_hgss) return RANK_MIDBOSS_LV50_HGSS;
                else return RANK_MIDBOSS_LV50_PT;
            }
        case FNLBOSS_ID:
            if (is_open_level) {
                if (is_hgss) return RANK_FNLBOSS_OPEN_HGSS;
                else return RANK_FNLBOSS_OPEN_PT;
            }
            else {
                if (is_hgss) return RANK_FNLBOSS_LV50_HGSS;
                else return RANK_FNLBOSS_LV50_PT;
            }
        }
        let r = FactoryHelper.trainer_id_to_rank_basis(id);
        return FactoryHelper.trainer_rank(is_open_level, r);
    }

    public static choose_entry(prng: PRNG, rank: IRankObject): [PRNG, Entry] {
        let prngp = prng.dup();
        let x = FactoryHelper.choose_entryQ(prngp, rank);
        return [prngp, x];
    }

    public static choose_entryQ(prng: PRNG, rank: IRankObject) {
        let start = rank.range_min, end = rank.range_max;
        let count = end - start + 1;
        let i = end - 1 - prng.randQ(count);
        return ALL_ENTRIES[i];
    }

    public static choose_entries(prng: PRNG, n: number, rank: IRankObject, unchoosable: Entry[] = []) {
        let prngp = prng.dup();
        let x = FactoryHelper.choose_entriesQ(prngp, n, rank, unchoosable);
        return [prngp, x];
    }

    public static choose_entriesQ(prng: PRNG, n: number, rank: IRankObject, unchoosable: Entry[] = []) {
        let entries: Entry[] = [];
        while (entries.length < n) {
            let entry = FactoryHelper.choose_entryQ(prng, rank);
            if (!entry.collides_within([...entries, ...unchoosable])) {
                entries.push(entry);
            }
        }
        return entries;
    }

    public static choose_starters(prng: PRNG, is_open_level: boolean, round: number, num_bonus: number): [PRNG, Entry[]] {
        let prngp = prng.dup();
        let starters = FactoryHelper.choose_startersQ(prngp, is_open_level, round, num_bonus);
        return [prngp, starters];
    }

    public static choose_startersQ(prng: PRNG, is_open_level: boolean, round: number, num_bonus: number) {
        let starters = FactoryHelper.choose_entriesQ(prng, NSTARTERS - num_bonus, FactoryHelper.starter_rank(is_open_level, round), []);
        let bonusEntries = FactoryHelper.choose_entriesQ(prng, num_bonus, FactoryHelper.starter_rank(is_open_level, round + 1), starters);
        starters.push(...bonusEntries);
        FactoryHelper._pid_loopQ(prng, starters);
        prng.stepQ(2);
        return starters;
    }

    public static after_consumption(prng: PRNG, entries: Entry[], round: number, nth: number, enemy_rank: IRankObject) {
        let prngp = prng.dup();
        FactoryHelper.after_consumptionQ(prngp, entries, round, nth, enemy_rank);
        return prngp;
    }

    public static after_consumptionQ(prng: PRNG, entries: Entry[], round: number, nth: number, enemy_rank: IRankObject) {
        this._pid_loopQ(prng, entries);
        FactoryHelper.rand_gap(prng, round, nth, enemy_rank);
    }
    
    public static rand_gap(prng: PRNG, round: number, nth: number, enemy_rank: IRankObject) {
        let c = 0;
        if (round >= 5) {
            c = 24;
        }
        else if (enemy_rank.rank == 1) {
            c = 6;
        }
        else {
            c = 12;
        }
        if (nth == 1) {
            c += round == 1 ? 18 : 36;
        }
        prng.stepQ(c);
    }

    public static _pid_loopQ(prng: PRNG, entries: Entry[]) {
        for (let entry of entries) {
            let trainer_id = FactoryHelper._rand32Q(prng);
            while (true) {
                let pid = FactoryHelper._rand32Q(prng);
                if (pid % 25 === entry.nature) { break; }
            }
        }
    }
    
    public static rand_trainer_id(prng: PRNG, round: number, is_last: boolean) {
        let r = prng.randQ(65536);
        if (round >= 8) {
            return r % 99 + 200;
        }
        else if (is_last) {
            return r % 19 + 100 + (round - 1) * 20;
        }
        else if (round == 1) {
            return r % 99;
        }
        else {
            return r % 39 + 80 + (round - 2) * 20;
        }
    }

    public static rand_trainers0(prng: PRNG, round: number, num: number, seen: number[], is_last_trainer_next_rank: boolean) {
        let trainers: number[] = [];
        let i = 1;
        while (i <= num) {
            if ((round == 3 || round == 7) && i == 7 && seen.length == 0) {
                trainers.push(round == 3 ? MIDBOSS_ID : FNLBOSS_ID);
                break;
            }
            let e = FactoryHelper.rand_trainer_id(prng, round, is_last_trainer_next_rank && i == 7);
            if (trainers.indexOf(e) >= 0 || seen.indexOf(e) >= 0) continue;
            trainers.push(e);
            i++;
        }
        return trainers;
    }
    
    public static rand_trainers(prng: PRNG, round: number, is_hgss: boolean): [PRNG, number[]] {
        let prngp = prng.dup();
        let trainers = FactoryHelper.rand_trainersQ(prngp, round, is_hgss);
        return [prngp, trainers];
    }
    
    public static rand_trainersQ(prng: PRNG, round: number, is_hgss: boolean) {
        // トレーナーA
        let trainers = FactoryHelper.rand_trainers0(prng, round, 7, [], true);
        // トレーナーB
        //   2周目と6周目は6人分しか決定しない
        //   プラチナでは7人目も6人目までと同じ決定方法
        let trainers2 = FactoryHelper.rand_trainers0(prng, round,
            (round == 2 || round == 6) ? 6 : 7, trainers,
            is_hgss);
        return trainers;
    }

    public static _rand32Q(prng: PRNG) {
        let low = prng.randQ(0x10000);
        let high = prng.randQ(0x10000);
        return (high << 16 | low) >>> 0;
    }
}
