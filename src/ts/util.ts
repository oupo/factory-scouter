export class Util {
    public static arrayFlatten<T>(ary: T[][]): T[] {
        const ret = [];
        for (const e of ary) {
            ret.push(...e);
        }
        return ret;
    }

    public static compact<T>(ary: T[]) {
        const ret = [];
        for (const e of ary) {
            if (e !== null) {
                ret.push(e);
            }
        }
        return ret;
    }

    public static split(str: string, sep: string) {
        let ary: string[] = str.split(sep);
        if (ary[ary.length - 1] === "") ary.pop();
        return ary;
    }
    public static range(start: number, end: number) {
        let array: number[] = [];
        for (let i = start; i <= end; i++) {
            array.push(i);
        }
        return array;
    }
    public static iota(n: number) {
        return Util.range(0, n - 1);
    }
    public static arrayCount<T>(array: T[], predicate: (x: T) => boolean) {
        let num = 0;
        for (let x of array) {
            if (predicate(x)) num += 1;
        }
        return num;
    }
    public static minBy<T>(ary: T[], keyOf: (val: T) => number) {
        let min = null;
        for (let x of ary) {
            if (min == null || keyOf(x) < keyOf(min)) min = x;
        }
        return min;
    }
    public static maxBy<T>(ary: T[], keyOf: (val: T) => number) {
        return Util.minBy(ary, x => -keyOf(x));
    }
    public static sortBy<T>(ary: T[], func: (val: T) => number) {
        let keys = ary.map(func);
        return Util.iota(ary.length).sort((a, b) => keys[a] - keys[b]).map(i => ary[i]);
    }
    public static arrayDiff<T>(ary: T[], ary2: T[]) {
        return ary.filter(x => ary2.indexOf(x) === -1);
    }
    public static arrayIntersection<T>(ary: T[], ary2: T[]) {
        return ary.filter(x => ary2.indexOf(x) !== -1);
    }
}
