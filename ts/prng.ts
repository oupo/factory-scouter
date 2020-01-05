const A = 0x41c64e6d;
const B = 0x6073;

export class PRNG {
    public seed: number;
    constructor(seed: number) {
        this.seed = seed;
    }
    public rand(n: number) {
        const prngp = this.dup();
        return [prngp, prngp.randQ(n)];
    }
    public randQ(n: number) {
        this.succ();
        return (this.seed >>> 16) % n;
    }
    public succ() {
        this.seed = u32(mul(this.seed, A) + B);
    }
    public stepQ(n: number) {
        const [a, b] = make_const(n);
        this.seed = u32(mul(this.seed, a) + b);
    }
    public dup() {
        return new PRNG(this.seed);
    }
}

function make_const(n: number) {
    let a = A;
    let b = B;
    let c = 1;
    let d = 0;
    while (n) {
        if (n & 1) {
            d = u32(mul(d, a) + b);
            c = mul(c, a);
        }
        b = u32(mul(b, a) + b);
        a = mul(a, a);
        n >>>= 1;
    }
    return [c, d];
}

function mul(a: number, b: number) {
    const a1 = a >>> 16;
    const a2 = a & 0xffff;
    const b1 = b >>> 16;
    const b2 = b & 0xffff;
    return u32(((a1 * b2 + a2 * b1) << 16) + a2 * b2);
}

function u32(x: number) { return x >>> 0; }
