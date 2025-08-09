import { oneOf, Rand, splitmix32 } from './rand.js';
import whichBiome from './which-biome.js';

const biomes: Record<string, (_: Rand) => string> = import.meta.glob(
  './biomes/*.js',
  { eager: true }
);

export function showme(lat: number, long: number): string {
  const n = lat | (long * 0xffff);

  const rand = splitmix32(n);
  const skyColor = oneOf(rand, ['pink', 'blue', 'purple']);
  const skyThings = oneOf(rand, ['fish', 'birds', 'silence']);
  const mood = oneOf(rand, ['peaceful', 'tense', 'foreboding', 'nice']);
  const smell = oneOf(rand, ['cinammon', 'peppermint', 'burning flesh']);

  return `whereami? 
you find yourself in a strange land.
the ${skyColor} sky is full of ${skyThings}.
you feel ${mood}.

there's a faint smell of ${smell}

${describeBiome(lat, long, rand)}
`;
}

function describeBiome(lat: number, long: number, rand: Rand) {
  const biome = whichBiome(lat >> 8, long >> 8);

  switch (biome) {
    case 'cowboy':
      return biomes.cowboy(rand);
    case 'candy':
      return biomes.candy(rand);

    case 'blessed':
    case 'cursed':
    case 'spicy':
    case 'ancient':
    case 'gothic':
    case 'rainbow':
    case 'poisoned':
    case 'burning':
    case 'upside-down':
    case 'squishy':
    case 'thalassan':
      return '';
  }
}
