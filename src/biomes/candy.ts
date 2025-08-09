import { oneOf, Rand } from '../rand.js';

export default function showBiome(r: Rand) {
  const smell = oneOf(r, ['candy floss', 'peppermint', 'cinnamon']);
  return `Everything is sticky and shiny, the air smells like ${smell}.`;
}
