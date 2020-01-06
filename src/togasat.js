class Togasat {
    constructor(module) {
        this.module = module;
    }

    static load() {
        return TogasatModule().then((module) => {
            return new Togasat(module);
        });
    }

    solve(cnf) {
        let array = new Int32Array(cnf);
        let ptr = this.arrayToPtr(cnf);
        let result = this.module._solve(ptr, cnf.length);
        this.module._free(ptr);
        return result;
    }

    arrayToPtr(array) {
        var ptr = this.module._malloc(array.length * 4);
        this.module.HEAP32.set(array, ptr / 4);
        return ptr;
    }
}

exports["Togasat"] = Togasat;