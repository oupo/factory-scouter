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

    public solve(cnf: number[]) {
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
