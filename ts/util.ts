export class Util {
    static arrayFlatten<T>(ary: T[][]): T[] {
		var ret = [];
		for (var i = 0; i < ary.length; i ++) {
			ret.push(...ary[i]);
		}
		return ret;
	}
}