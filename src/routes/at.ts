import express from 'express';
import { regions } from '../regions.js';
import { oneOf, splitmix32 } from '../rand.js';
const router = express.Router();
router.get(`/:lat/:long`, async (req, res) => {
  const { params } = req;
  const lat = parseInt(params.lat.replace(/^x/, ''), 16) & 0xffff;
  const long = parseInt(params.long.replace(/^x/, ''), 16) & 0xffff;
  const _lat = `x${lat.toString(16)}`;
  const _lng = `x${long.toString(16)}`;

  if (params.lat !== _lat || params.long !== _lng) {
    res.redirect(`/at/${_lat}/${_lng}`);
    return;
  }

  const north = `/at/x${wrap(lat + 1).toString(16)}/x${long.toString(16)}`;
  const east = `/at/x${lat.toString(16)}/x${wrap(long + 1).toString(16)}`;
  const south = `/at/x${wrap(lat - 1).toString(16)}/x${long.toString(16)}`;
  const west = `/at/x${lat.toString(16)}/x${wrap(long - 1).toString(16)}`;

  res.status(200).send(`
    <pre>${showme(lat, long)}</pre>
    <ul>
      <li><a href="${north}">north</a></li>
      <li><a href="${east}">east</a></li>
      <li><a href="${south}">south</a></li>
      <li><a href="${west}">west</a></li>
    </ul>  
  `);
});

function wrap(n: number): number {
  n = Math.abs(n);
  return Math.min(n, 0xffff - n);
}

router.get('/', (req, res) => {
  const _lat = `x${Math.floor(Math.random() * 0xffff).toString(16)}`;
  const _lng = `x${Math.floor(Math.random() * 0xffff).toString(16)}`;
  res.redirect(`/at/${_lat}/${_lng}`);
});

function showme(lat: number, long: number): string {
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

export default router;
