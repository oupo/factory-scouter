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
    public static arrayCount<T>(array: T[], predicate: (x: T) => boolean) {
        let num = 0;
        for (let x of array) {
            if (predicate(x)) num += 1;
        }
        return num;
    }
}
