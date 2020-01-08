
import { Togasat } from './togasat';
import { NSTARTERS, NBATTLES, NPARTY } from './constant';
import { Entry } from './entry';

type Variable = number;

export class Judger {
    private togasat: Togasat;
    private starters: Entry[];
    private enemies: Entry[][];
    private skipped: Entry[][];
    private nbattles: number;
    private variableCount: number;
    private variableNames: string[];
    static CHOOSE = [[0, 1, 2], [0, 1, 3], [0, 1, 4], [0, 1, 5], [0, 2, 3], [0, 2, 4], [0, 2, 5], [0, 3, 4], [0, 3, 5], [0, 4, 5], [1, 2, 3], [1, 2, 4], [1, 2, 5], [1, 3, 4], [1, 3, 5], [1, 4, 5], [2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5]];

    constructor(togasat: Togasat, starters: Entry[], enemies: Entry[][], skipped: Entry[][]) {
        this.togasat = togasat;
        this.starters = starters;
        this.enemies = enemies;
        this.skipped = skipped;
        this.nbattles = this.enemies.length;
        this.variableNames = [];
        this.variableCount = 0;
    }

    static judge(togasat: Togasat, starters: Entry[], enemies: Entry[][], skipped: Entry[][]) {
        //let startTime = Date.now();
        let res = new Judger(togasat, starters, enemies, skipped).judge();
        //console.log("judge (" + enemies.length + "): " + res+" "+(Date.now() - startTime)+" msec");
        return res;
    }

    judge() {
        if (this.nbattles == 1) return true;
        let starter: Variable[] = [];
        for (let x of Judger.CHOOSE) {
            starter.push(this.var("starter_" + x.join("")));
        }
        // starter_choose[x]: スターターのx匹目を選出
        let starter_choose: Variable[] = [];
        for (let x = 0; x < NSTARTERS; x++) {
            starter_choose.push(this.var("starter_choose_" + String(x)));
        }
        // throws[x][y]: 第x戦と第x+1戦の間の交換でスターターyを捨てる
        // throws[x][NSTARTERS + NPARTY * y + z]: 第x戦と第x+1戦の間の交換でy戦目のz番目のポケモンを捨てる 
        let throws: Variable[][] = [];
        for (let x = 0; x < this.nbattles - 2; x++) {
            throws.push([]);
            for (let y = 0; y < NSTARTERS; y++) {
                throws[x].push(this.var("throw_" + String(x) + "_starter" + String(y)));
            }
            for (let y = 0; y < x; y++) {
                for (let z = 0; z < NPARTY; z++) {
                    throws[x].push(this.var("throw_" + String(x) + "_" + String(y) + "_" + String(z)));
                }
            }
        }
        // pickup[x][y]: 第x戦と第x+1戦の間の交換でx戦目のy番目のポケモンを拾う
        let pickup: Variable[][] = [];
        for (let x = 0; x < this.nbattles - 2; x++) {
            pickup.push([]);
            for (let y = 0; y < NPARTY; y++) {
                pickup[x].push(this.var("pickup_" + String(x) + "_" + String(y)))
            }
        }
        let player_has_starter: Variable[][] = [null];
        // 第x戦目の敵決定手前でスターターyをプレイヤーが持っているか
        for (let x = 1; x < this.nbattles; x++) {
            player_has_starter.push([]);
            for (let y = 0; y < NSTARTERS; y++) {
                player_has_starter[x].push(this.var("player_has_starter_" + String(x) + "_" + String(y)));
            }
        }
        let player_has: Variable[][][] = [null];
        // 第x戦目の敵決定手前でy戦目のz匹目をプレイヤーが持っているか
        for (let x = 1; x < this.nbattles; x++) {
            player_has.push([]);
            for (let y = 0; y < x - 1; y++) {
                player_has[x].push([]);
                for (let z = 0; z < NPARTY; z++) {
                    player_has[x][y].push(this.var("player_has_" + String(x) + "_" + String(y) + "_" + String(z)));
                }
            }
        }

        let clauses: Variable[][] = [];


        // player_has_starterの定義式
        // player_has_starter[x][y] := 第x戦目の敵決定手前でスターターyをプレイヤーが持っているか

        for (let x = 0; x < NSTARTERS; x++) {
            clauses.push([this.not(player_has_starter[1][x]), starter_choose[x]]);
            clauses.push([this.not(starter_choose[x]), player_has_starter[1][x]]);
        }

        for (let x = 2; x < this.nbattles; x++) {
            for (let y = 0; y < NSTARTERS; y++) {
                clauses.push([this.not(player_has_starter[x][y]), player_has_starter[x - 1][y]]);
                clauses.push([this.not(player_has_starter[x][y]), this.not(throws[x - 2][y])]);
                clauses.push([this.not(player_has_starter[x - 1][y]), throws[x - 2][y], player_has_starter[x][y]]);
            }
        }

        // player_hasの定義式
        // player_has[x][y][z] := 第x戦目の敵決定手前でy戦目のz匹目をプレイヤーが持っているか
        for (let x = 0; x < this.nbattles; x++) {
            for (let y = 0; y < x - 1; y++) {
                for (let z = 0; z < NPARTY; z++) {
                    if (y == x - 2) {
                        clauses.push([this.not(player_has[x][y][z]), pickup[y][z]]);
                        clauses.push([this.not(pickup[y][z]), player_has[x][y][z]]);
                    } else {
                        clauses.push([this.not(player_has[x][y][z]), player_has[x - 1][y][z]]);
                        clauses.push([this.not(player_has[x][y][z]), this.not(throws[x - 2][NSTARTERS + NPARTY * y + z])]);
                        clauses.push([this.not(player_has[x - 1][y][z]), throws[x - 2][NSTARTERS + NPARTY * y + z], player_has[x][y][z]]);
                    }
                }
            }
        }

        // 6匹の中からちょうど3匹選ぶ
        let clause: Variable[] = [];
        clauses.push(clause);
        for (let x of starter) {
            clause.push(x);
        }

        for (let i = 0; i < Judger.CHOOSE.length; i++) {
            for (let y = 0; y < NSTARTERS; y++) {
                let clause: Variable[] = [];
                clauses.push(clause);
                clause.push(this.not(starter[i]));
                if (Judger.CHOOSE[i].indexOf(y) >= 0) {
                    clause.push(starter_choose[y]);
                } else {
                    clause.push(this.not(starter_choose[y]));
                }
            }
        }

        for (let x = 0; x < this.nbattles - 2; x++) {
            // 第x戦 (x=0, 1, …, 4)と第x+1戦の間の交換
            // 拾うポケモンは1匹以下
            for (let y = 0; y < NPARTY; y++) {
                for (let z = y + 1; z < NPARTY; z++) {
                    let clause: Variable[] = [];
                    clauses.push(clause)
                    clause.push(this.not(pickup[x][y]));
                    clause.push(this.not(pickup[x][z]));
                }
            }
        }

        // 拾う場合、捨てるポケモンは少なくとも1匹
        for (let x = 0; x < this.nbattles - 2; x++) {
            for (let y = 0; y < NPARTY; y++) {
                let clause: Variable[] = [];
                clauses.push(clause);
                clause.push(this.not(pickup[x][y]));
                for (let z = 0; z < throws[x].length; z++) {
                    clause.push(throws[x][z]);
                }
            }
        }

        // 拾う場合、捨てるポケモンはたかだか1匹
        for (let x = 0; x < this.nbattles - 2; x++) {
            for (let y = 0; y < NPARTY; y++) {
                for (let z1 = 0; z1 < throws[x].length; z1++) {
                    for (let z2 = z1 + 1; z2 < throws[x].length; z2++) {
                        let clause: Variable[] = [];
                        clauses.push(clause);
                        clause.push(this.not(pickup[x][y]));
                        clause.push(this.not(throws[x][z1]));
                        clause.push(this.not(throws[x][z2]));
                    }
                }
            }
        }

        // 捨てる場合、それをその時点で持っていなければならない
        for (let x = 0; x < this.nbattles - 2; x++) {
            for (let y = 0; y < NSTARTERS; y++) {
                clauses.push([this.not(throws[x][y]), player_has_starter[x + 1][y]]);
            }
            for (let y = 0; y < x; y++) {
                for (let z = 0; z < NPARTY; z++) {
                    clauses.push([this.not(throws[x][NSTARTERS + NPARTY * y + z]), player_has[x + 1][y][z]]);
                }
            }
        }

        // 捨てる場合、拾うポケモンが1匹以上
        for (let x = 0; x < this.nbattles - 2; x++) {
            for (let y = 0; y < NSTARTERS; y++) {
                clauses.push([this.not(throws[x][y]), ...pickup[x]]);
            }
            for (let y = 0; y < x; y++) {
                for (let z = 0; z < NPARTY; z++) {
                    clauses.push([this.not(throws[x][NSTARTERS + NPARTY * y + z]), ...pickup[x]]);
                }
            }
        }

        // enemiesと被るものはプレイヤーは持っていない
        for (let x = 1; x < this.nbattles; x++) {
            for (let entry of this.enemies[x]) {
                for (let y = 0; y < NSTARTERS; y++) {
                    let entry2 = this.starters[y];
                    if (entry.collides_with(entry2)) {
                        clauses.push([this.not(player_has_starter[x][y])]);
                    }
                }
                for (let y = 0; y < x - 1; y++) {
                    for (let z = 0; z < NPARTY; z++) {
                        let entry2 = this.enemies[y][z];
                        if (entry.collides_with(entry2)) {
                            clauses.push([this.not(player_has[x][y][z])]);
                        }
                    }
                }
            }
        }

        // skippedと被るものはプレイヤーは持っている
        for (let x = 1; x < this.nbattles; x++) {
            for (let entry of this.skipped[x]) {
                let clause: Variable[] = [];
                clauses.push(clause);
                for (let y = 0; y < NSTARTERS; y++) {
                    let entry2 = this.starters[y];
                    if (entry.collides_with(entry2)) {
                        clause.push(player_has_starter[x][y]);
                    }
                }
                for (let y = 0; y < x - 1; y++) {
                    for (let z = 0; z < NPARTY; z++) {
                        let entry2 = this.enemies[y][z];
                        if (entry.collides_with(entry2)) {
                            clause.push(player_has[x][y][z]);
                        }
                    }
                }
            }
        }

/*        let str = "p cnf "+this.variableCount+" "+clauses.length+"\n";
        for (let clause of clauses) {
            str += [...clause.map((x) => this.varToString(x)), 0].join(" ") + "\n";
        }
        console.log(str);
        let res = [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, 19, -20, -21, -22, 23, -24, 25, 26, -27, -28, 29, -30, 31, 32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47, -48, -49, 50, -51, 52, 53, -54, -55, -56, -57, -58, -59, -60, -61, -62, -63, -64, -65, -66, -67, -68, -69, -70, -71, -72, -73, -74];
        str = "";
        for (let r of res) {
            str += this.varToString(r) + "\n";
        }
        console.log(str); */
        return this.togasat.solve(clauses) == 0;
    }

    var(name: string): Variable {
        this.variableNames[++this.variableCount] = name;
        return this.variableCount;
    }

    varToString(variable: Variable) {
        return variable > 0 ? this.variableNames[variable] : "-" + this.variableNames[-variable];
    }

    not(variable: Variable) {
        return -variable;
    }
}