import * as fs from 'node:fs/promises';

const NUMBER_OF_SITES = 13;
const names = [
  'blessed',
  'cursed',
  'spicy',
  'cowboy',
  'ancient',
  'gothic',
  'rainbow',
  'poisoned',
  'burning',
  'upside-down',
  'candy',
  'squishy',
  'thalassan',
];

function fisherYatesShuffle<T>(array: T[]): void {
  let currentIndex = array.length;
  let randomIndex: number;
  let temporaryValue: T;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
}
const sites = [];
while (sites.length < NUMBER_OF_SITES) {
  sites.push({
    x: Math.random() * 256,
    y: Math.random() * 256,
    strength: Math.random(),
    name: names[sites.length],
  });
}

const permutation = [];
while (permutation.length < 256) {
  permutation[permutation.length] = permutation.length;
}

fisherYatesShuffle(permutation);

await fs.writeFile(
  `./src/data.json`,
  JSON.stringify({ permutation, sites }, null, 2),
  'utf8'
);
