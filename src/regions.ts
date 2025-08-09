import * as noise from './noise.js';
import * as circles from './circles.js';

export function regions(
  x: number,
  y: number,
  data: {
    permutation: number[];
    threshhold: number;
    circles: { x: number; y: number; radius: number }[];
  }[]
): Record<string, boolean | undefined> {
  const result = {} as Record<string, boolean | undefined>;
  for (const [key, value] of Object.entries(data)) {
    let n = 0;
    n += noise.generateFractal(value.permutation, x, y);
    n += circles.getPixel({ x, y }, value.circles) / 64;
    result[key] = n >= value.threshhold;
  }

  return result;
}
