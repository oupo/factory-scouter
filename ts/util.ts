export class Util {
    public static arrayFlatten<T>(ary: T[][]): T[] {
        const ret = [];
        for (const e of ary) {
            ret.push(...e);
        }
        return ret;
    }
}
