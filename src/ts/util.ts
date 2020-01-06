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
}
