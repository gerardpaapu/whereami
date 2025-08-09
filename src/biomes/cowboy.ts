import { oneOf, Rand } from '../rand.js';

export default function showBiome(random: Rand) {
  const trackAge = oneOf(random, ['fading', 'fresh', 'confusing']);

  const tracks = oneOf(random, [
    'varmints',
    'cowpokes',
    'russlers',
    'banditos',
    'native warriors',
  ]);

  return `
Yeehaw, we're out on the open range.

You see some ${trackAge} tracks that look like ${tracks}...
`;
}
