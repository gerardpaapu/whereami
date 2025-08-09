import data from './data.json' with { type: 'json' };

export type BiomeName =
  | 'blessed'
  | 'cursed'
  | 'spicy'
  | 'cowboy'
  | 'ancient'
  | 'gothic'
  | 'rainbow'
  | 'poisoned'
  | 'burning'
  | 'upside-down'
  | 'candy'
  | 'squishy'
  | 'thalassan';

const { permutation, sites } = data;

const p = new Array(512);
for (let i = 0; i < 256; i++) {
  p[i] = p[i + 256] = permutation[i];
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}
function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function grad(hash: number, x: number, y: number): number {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function perlin(x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  const u = fade(x);
  const v = fade(y);
  const A = p[X] + Y;
  const B = p[X + 1] + Y;
  const AA = p[A] + 0;
  const AB = p[A + 1] + 0;
  const BA = p[B] + 0;
  const BB = p[B + 1] + 0;
  const topLerp = lerp(grad(p[AA], x, y), grad(p[BA], x - 1, y), u);
  const bottomLerp = lerp(grad(p[AB], x, y - 1), grad(p[BB], x - 1, y - 1), u);
  return lerp(topLerp, bottomLerp, v);
}

function fractalPerlin(
  x: number,
  y: number,
  octaves: number,
  lacunarity: number,
  persistence: number
) {
  let total = 0;
  let amplitude = 1.0;
  let frequency = 1.0;
  let maxAmplitude = 0; // Used for normalization

  for (let i = 0; i < octaves; i++) {
    total += perlin(x * frequency, y * frequency) * amplitude;
    maxAmplitude += amplitude;
    frequency *= lacunarity;
    amplitude *= persistence;
  }

  // Normalize to 0-1 range
  return (total / maxAmplitude + 1) / 2; // Perlin returns -1 to 1, so adjust to 0-1
}

// Fractal Perlin Noise Parameters for Jaggedness
const BASE_NOISE_SCALE = 20; // Controls the "zoom" of the base noise layer
const OCTAVES = 5; // Number of layers for fractal noise
const LACUNARITY = 2.0; // How much the frequency increases per octave
const PERSISTENCE = 0.5; // How much the amplitude decreases per octav
const MAGNITUDE = 46;

function getWeightedModularDistanceSquared(
  site: { x: number; y: number; strength: number },
  point: { x: number; y: number },
  size: number
) {
  let dx = Math.abs(site.x - point.x);
  let dy = Math.abs(site.y - point.y);

  // Apply modular distance for X
  dx = Math.min(dx, size - dx);
  // Apply modular distance for Y
  dy = Math.min(dy, size - dy);

  // Calculate Euclidean distance squared
  const euclideanDistSq = dx * dx + dy * dy;

  return euclideanDistSq - site.strength * site.strength;
}

export default function whichBiome(px: number, py: number): BiomeName {
  // Perturb the current pixel's coordinates using fractal Perlin noise
  const noiseX =
    (fractalPerlin(
      px / BASE_NOISE_SCALE,
      py / BASE_NOISE_SCALE,
      OCTAVES,
      LACUNARITY,
      PERSISTENCE
    ) *
      2 -
      1) *
    MAGNITUDE;
  const noiseY =
    (fractalPerlin(
      px / BASE_NOISE_SCALE + 100,
      py / BASE_NOISE_SCALE + 100,
      OCTAVES,
      LACUNARITY,
      PERSISTENCE
    ) *
      2 -
      1) *
    MAGNITUDE;

  const perturbedPx = px + noiseX;
  const perturbedPy = py + noiseY;
  let minWeightedDistSq = +Infinity;
  let result = 'cowboy' as BiomeName;

  // Find the closest site to the perturbed pixel coordinate using weighted modular distance
  for (const site of sites) {
    const weightedDistSq = getWeightedModularDistanceSquared(
      site,
      { x: perturbedPx, y: perturbedPy },
      256
    );

    if (weightedDistSq < minWeightedDistSq) {
      minWeightedDistSq = weightedDistSq;
      result = site.name as BiomeName;
    }
  }

  return result;
}
