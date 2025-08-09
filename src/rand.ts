export type Rand = () => number;

export const splitmix32 = (s: number): Rand => {
  return () => {
    s = (s + 0x9e3779b9) | 0;
    let t = Math.imul(s ^ (s >>> 16), 0x21f0aaad);
    t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
    t = t ^ (t >>> 15);
    return (t >>> 0) / Math.pow(2, 32);
  };
};

export const oneOf = <T>(rand: Rand, arr: T[]) =>
  arr[(arr.length * rand()) >>> 0];
