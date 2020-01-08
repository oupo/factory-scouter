import { NSTARTERS, NBATTLES, NPARTY } from './constant';
import { Entry } from './entry';
import { Util } from './util';

export class MyJudger {
    private starters: Entry[];
    private enemies: Entry[][];
    private skipped: Entry[][];
    private nbattles: number;

    constructor(starters: Entry[], enemies: Entry[][], skipped: Entry[][]) {
        this.starters = starters;
        this.enemies = enemies;
        this.skipped = skipped;
        this.nbattles = this.enemies.length;
    }

    static judge(starters: Entry[], enemies: Entry[][], skipped: Entry[][]) {
        console.log(enemies.length+" "+enemies[enemies.length - 1].map(x => x.id).join(","));
        let res = new MyJudger(starters, enemies, skipped).judge();
        console.log("MyJudge result: "+res);
        return res;
    }

    judge() {
        let works = this.gen_works();
        let antiworks = this.gen_antiworks();
        console.log("antiworks: "+antiworks.map(x => x.toString()).join(", "));
        let assigner = new Assigner();
        works = this.assign_loop(works, assigner);
        if (works === null) return false;
        console.log(works.length > 0 ? works.map(ws => "["+ws.map(w => w.toString()).join(", ")+"]").join("; ") : "(empty)");
        let res = this.assume(works, assigner, antiworks);
        return res;
    }

    assume(works: Work[][], assigner: Assigner, antiworks: Work[]) {
        if (works.length === 0) {
            return this.ok(assigner.assigned, antiworks);
        }
        let ws = works[0];
        for (let w of ws) {
            let assignerp = assigner.clone();
            assignerp.assign(w);
            let worksp = this.assign_loop(works.slice(1), assignerp);
            if (worksp === null) continue;
            if (this.assume(worksp, assignerp, antiworks)) return true;
        }
        return false;
    }

    // 持っているantiworkはなるべく少なく、持つとしてもtailが大きい方をとるように貪欲
    ok(works: Work[], antiworks: Work[]) {
        let entries = works.filter(w => w.head == 0).map(w => w.entry);
        let entries2 = Util.arrayDiff(this.starters, entries);
        let holding_antiworks: Work[] = entries2.map(e => this.antiworks_tail(antiworks, e, 0));
        entries2 = Util.iota(entries2.length).sort((i, j) => this.tail_or_inf(holding_antiworks[j]) - this.tail_or_inf(holding_antiworks[i])).map(i => entries2[i]).slice(0, NPARTY - entries.length);
        holding_antiworks = Util.compact(holding_antiworks);

        let player = [...entries, ...entries2];
        for (let i = 1; i < this.nbattles; i ++) {
            if (holding_antiworks.some(w => w.tail === i)) return false;
            let [throws, pickup] = this.greedy_exchange(i, player, works, antiworks, holding_antiworks);
            let idx = holding_antiworks.findIndex(w => w.entry === throws);
            if (idx >= 0) holding_antiworks = holding_antiworks.splice(idx, 1);
            let antiwork = antiworks.find(w => w.entry === pickup && w.head === i);
            if (antiwork !== undefined) {
                holding_antiworks.push(antiwork);
            }
            if (throws !== null) {
                player = [...Util.arrayDiff(player, [throws]), pickup];
            }
        }
        return true;
    }

    greedy_exchange(i: number, player: Entry[], works: Work[], antiworks: Work[], holding_antiworks: Work[]): [Entry, Entry] {
        let current_works = works.filter(w => w.range.indexOf(i) >= 0 && w.head != i);
        let throwable = Util.arrayDiff(player, current_works.map(w => w.entry));
        let throws = Util.minBy(throwable, e => this.antiwork_tail(holding_antiworks, e));
        let pickups = works.filter(w => w.head == i).map(w => w.entry);
        if (pickups.length > 0) {
            let pickup = pickups[0];
            return [throws, pickup];
        } else {
            let enemy = this.enemies[i - 1];
            if (!enemy) debugger;
            let pickup = Util.maxBy(enemy, e => this.tail_or_inf(this.antiworks_tail(antiworks, e, i)));
            let throwsTail = this.tail_or_inf(holding_antiworks.find(w => w.entry === throws));
            let pickupTail = this.tail_or_inf(this.antiworks_tail(antiworks, pickup, i));
            if (throwsTail < pickupTail) {
                return [throws, pickup];
            } else {
                return [null, null];
            }
        }
    }

    tail_or_inf(work: Work) {
        if (work) {
            return work.tail;
        } else {
            return Infinity;
        }
    }

    antiworks_tail(antiworks: Work[], entry: Entry, head: number) {
        return Util.minBy(antiworks.filter(w => w.entry === entry && w.head === head), w => w.tail);
    }

    antiwork_tail(holding_antiworks: Work[], entry: Entry) {
        let works = holding_antiworks.filter(w => w.entry === entry);
        if (works.length > 0) {
            return works[0].tail;
        } else {
            return Infinity;
        }
    }

    assign_loop(works: Work[][], assigner: Assigner) {
        let updated = true;
        works = works.slice();
        while (updated) {
            updated = false;
            for (let i = 0; i < works.length;) {
                let ws = works[i].filter(w => assigner.assignable(w));
                if (ws.length !== works[i].length) updated = true;
                works[i] = ws;
                if (ws.length === 0) return null;
                if (ws.length === 1) {
                    let work = ws[0];
                    assigner.assign(work);
                    works = works.filter((w, j) => i !== j);
                    updated = true;
                } else {
                    i++;
                }
            }
        }
        return works;
    }

	gen_works() {
        let works: Work[][] = [];
        for (let x = 1; x < this.nbattles; x++) {
            for (let entry of this.skipped[x]) {
                let w: Work[] = [];
                for (let y = 0; y < NSTARTERS; y++) {
                    let entry2 = this.starters[y];
                    if (entry.collides_with(entry2)) {
                        w.push(new Work(entry2, 0, x));
                    }
                }
                for (let y = 0; y < x - 1; y++) {
                    for (let z = 0; z < NPARTY; z++) {
                        let entry2 = this.enemies[y][z];
                        if (entry.collides_with(entry2)) {
                            w.push(new Work(entry2, y + 1, x));
                        }
                    }
                }
                works.push(w);
            }
        }
		return works;
	}

	gen_antiworks() {
        let antiworks: Work[] = [];
        for (let x = 1; x < this.nbattles; x++) {
            for (let entry of this.enemies[x]) {
                for (let y = 0; y < NSTARTERS; y++) {
                    let entry2 = this.starters[y];
                    if (entry.collides_with(entry2)) {
                        antiworks.push(new Work(entry2, 0, x));
                    }
                }
                for (let y = 0; y < x - 1; y++) {
                    for (let z = 0; z < NPARTY; z++) {
                        let entry2 = this.enemies[y][z];
                        if (entry.collides_with(entry2)) {
                            antiworks.push(new Work(entry2, y + 1, x));
                        }
                    }
                };
            }
        }
		return antiworks;
	}
}

class Assigner {
    assigned: Work[];
    constructor(assigned: Work[] = []) {
        this.assigned = [];
    }

    clone() {
        return new Assigner(this.assigned);
    }

	assign(work: Work) {
		if (this.exist_similar_longer_work(work)) return;
		let assigned = this.pick_similar_work(work);
		if (this.assignable0(assigned, work)) {
			this.assigned = [...assigned, work];
		} else {
			throw "impossible";
		}
	}
	
	assignable(work: Work) {
		if (this.exist_similar_longer_work(work)) {
			return true;
		}
		let assigned = this.pick_similar_work(work);
		return this.assignable0(assigned, work)
	}

	assignable0(assigned: Work[], work: Work) {
		return work.range.every(i => this.covered_num(assigned, i) < NPARTY) &&
			this.startable_num(assigned, work.head) >= 1;
	}

	exist_similar_longer_work(work: Work) {
		let i = this.find_similar_work(work);
		return i != -1 && work.tail <= this.assigned[i].tail;
	}

	find_similar_work(work: Work) {
		return this.assigned.findIndex(w => w.entry == work.entry && w.head == work.head);
	}

	pick_similar_work(work: Work) {
		let i = this.find_similar_work(work);
		if (i !== -1) {
			let assigned = this.assigned.slice();
			assigned.splice(i, 1);
			return assigned;
		} else {
			return this.assigned;
		}
	}

	startable_num(assigned: Work[], pos: number) {
		let max = pos == 0 ? NPARTY : 1;
		return max - Util.arrayCount(assigned, work => work.head === pos);
	}

	covered_num(assigned: Work[], pos: number) {
		return Util.arrayCount(assigned, work => work.range.indexOf(pos) >= 0);
	}
}

class Work {
    public entry: Entry;
    public head: number;
    public tail: number;
    public range: number[];

    constructor(entry: Entry, head: number, tail: number) {
        this.entry = entry;
        this.head = head;
        this.tail = tail;
        this.range = Util.range(head, tail);
    }

    toString() {
        return "<Work "+this.entry.id+","+this.head+","+this.tail+">";
    }
}