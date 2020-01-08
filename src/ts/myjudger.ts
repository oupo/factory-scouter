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
        console.log(res);
        return res;
    }

    judge() {
        let works = this.gen_works();
        let assigner = new Assigner();
        let updated = true;
        while (updated) {
            updated = false;
            for (let i = 0; i < works.length; ) {
                let ws = works[i].filter(w => assigner.assignable(w));
                if (ws.length !== works[i].length) updated = true;
                works[i] = ws;
                if (ws.length === 0) return false;
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
        console.log(works.length > 0 ? works.map(ws => "["+ws.map(w => w.toString()).join(", ")+"]").join("; ") : "(empty)");
        return undefined;
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
        //works.forEach(ws => console.log("["+ws.map(w => w.toString()).join(", ")+"]"));
		return works;
	}
}

class Assigner {
    assigned: Work[];
    constructor() {
        this.assigned = [];
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