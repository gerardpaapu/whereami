// --- Perlin Noise Generator Logic ---

// Permutation table. A pre-shuffled array of 0-255 used to determine gradient vectors.
// It's a key part of the algorithm to ensure reproducible, non-repeating noise.
/*
const p = new Array(512);
const permutation = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
  36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234,
  75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237,
  149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48,
  27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105,
  92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73,
  209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
  164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38,
  147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
  28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
  155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
  178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
  191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
  181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
  138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,
  61, 156, 180,
];

*/

export function extendTable(permutation: number[]): number[] {
  const p = new Array(512); // TODO: make this a typed array
  // Extend the permutation table to avoid bounds checking.
  // It's duplicated to easily wrap around with `& 255`.
  for (let i = 0; i < 256; i++) {
    p[i] = p[i + 256] = permutation[i];
  }

  return p;
}

// Standard linear interpolation function
function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

// A smoothstep function to ease the interpolation.
// It's a cubic curve that starts and ends flat. This is the key
// to making the noise look "natural" and not blocky.
function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// The gradient function. It returns the dot product of a random
// gradient vector and the distance vector.
// The random gradient is determined by the permutation table.
function grad(hash: number, x: number, y: number): number {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

/**
 * The main Perlin noise function.
 * Generates a single noise value for a given (x, y) coordinate.
 */
function perlin(p: number[], x: number, y: number): number {
  // Find the unit square that contains the point.
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;

  // Find the relative x, y coordinates of the point within the square.
  x -= Math.floor(x);
  y -= Math.floor(y);

  // Compute the "eased" curve for interpolation.
  const u = fade(x);
  const v = fade(y);

  // Hash coordinates of the 4 corners of the unit square.
  const A = p[X] + Y;
  const B = p[X + 1] + Y;
  const AA = p[A] + 0;
  const AB = p[A + 1] + 0;
  const BA = p[B] + 0;
  const BB = p[B + 1] + 0;

  // Interpolate between the four corners' gradients.
  // First, interpolate the top two corners (AA and BA).
  const topLerp = lerp(grad(p[AA], x, y), grad(p[BA], x - 1, y), u);
  // Then, interpolate the bottom two corners (AB and BB).
  const bottomLerp = lerp(grad(p[AB], x, y - 1), grad(p[BB], x - 1, y - 1), u);
  // Finally, interpolate between the top and bottom results.
  return lerp(topLerp, bottomLerp, v);
}

/**
 * Generates a fractal noise grid by combining multiple octaves of Perlin noise.
 * @returns {number[][]} A 2D array of noise values between 0 and 1.
 */
export function generateFractal(
  permutation: number[],
  x: number,
  y: number
): number {
  // --- Fractal Noise Parameters ---
  const OCTAVES = 4; // Number of noise layers to combine.
  const LACUNARITY = 2.0; // The frequency multiplier for each octave.
  const PERSISTENCE = 0.5; // The amplitude multiplier for each octave.

  let noise = 0;
  let amplitude = 1.0;
  let frequency = 1.0 / 8; // Initial frequency (lower is more "zoomed in").
  const p = extendTable(permutation);

  // x, y should be in 0-64
  // Loop through each octave, generating and adding noise.
  for (let i = 0; i < OCTAVES; i++) {
    // Calculate the noise value for this octave.
    noise += perlin(p, x * frequency, y * frequency) * amplitude;
    frequency *= LACUNARITY;
    amplitude *= PERSISTENCE;
  }

  return noise;
}
