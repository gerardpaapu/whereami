import { regions } from './regions.js';
import { oneOf, splitmix32 } from './rand.js';

export function showme(lat: number, long: number): string {
  const n = lat | (long * 0xffff);

  const rand = splitmix32(n);
  const inRegions = regions((lat / 0xffff) * 64, (long / 0xfff) * 64);

  const skyColor = oneOf(rand, ['pink', 'blue', 'purple']);
  const skyThings = oneOf(rand, ['fish', 'birds', 'silence']);
  const mood = oneOf(rand, ['peaceful', 'tense', 'foreboding', 'nice']);
  const smell = oneOf(rand, ['cinammon', 'peppermint', 'burning flesh']);
  let regional = '';
  for (const [k, v] of Object.entries(inRegions)) {
    if (v) {
      regional += `This land is ${k}\n`;
    }
  }

  return `whereami? 
you find yourself in a strange land.
the ${skyColor} sky is full of ${skyThings}.
you feel ${mood}.

there's a faint smell of ${smell}
----
${regional}
`;
}
