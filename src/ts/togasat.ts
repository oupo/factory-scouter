import TogasatModule = require("../../togasat-module");

export class Togasat {
    module: any;
    constructor(module: any) {
        this.module = module;
    }

    static load() : Promise<Togasat> {
        return new Promise(function(resolve, reject) {
            TogasatModule().then((module: any) => {
                resolve(new Togasat(module));
            });
        });
    }

    public solve(clauses: number[][]) {
        let cnf: number[] = [];
        let fixed: boolean[] = [];
        // varと-varが両方節としてあったらそこでunsatを返す
        // varが二回以上節として登場したら一回だけにする
        for (let clause of clauses) {
            if (clause.length == 1) {
                let variable = clause[0];
                if (variable > 0) {
                    if (fixed[variable] === false) {
                        return 1;
                    } else if (fixed[variable] === true) {
                        continue;
                    } else {
                        fixed[variable] = true;
                    }
                } else {
                    variable = -variable;
                    if (fixed[variable] === true) {
                        return 1;
                    } else if (fixed[variable] === false) {
                        continue;
                    } else {
                        fixed[variable] = false;
                    }
                }
            }
            cnf.push(...clause);
            cnf.push(0);
        }
        let array = new Int32Array(cnf);
        let ptr = this.arrayToPtr(array);
        let result = this.module._solve(ptr, cnf.length);
        this.module._free(ptr);
        return result;
    }

    private arrayToPtr(array: Int32Array) {
        var ptr = this.module._malloc(array.length * 4);
        this.module.HEAP32.set(array, ptr / 4);
        return ptr;
    }
}
