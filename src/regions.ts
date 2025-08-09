import * as noise from './noise.js';
import * as circles from './circles.js';

import ancient from './data/ancient.json' with { type: 'json' };
import blessed from './data/blessed.json' with { type: 'json' };
import burning from './data/burning.json' with { type: 'json' };
import cowboy from './data/cowboy.json' with { type: 'json' };
import cursed from './data/cursed.json' with { type: 'json' };
import gothic from './data/gothic.json' with { type: 'json' };
import poisoned from './data/poisoned.json' with { type: 'json' };
import rainbow from './data/rainbow.json' with { type: 'json' };
import spicy from './data/spicy.json' with { type: 'json' };

const data = {
  ancient,
  blessed,
  burning,
  cowboy,
  cursed,
  gothic,
  poisoned,
  rainbow,
  spicy,
};

export function regions(
  x: number,
  y: number
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
