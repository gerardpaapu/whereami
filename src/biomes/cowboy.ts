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
<p>Yeehaw, we're out on the open range.</p>
<p>You see some ${trackAge} tracks that look like ${tracks}&hellip;</p>
`;
}
