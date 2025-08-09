import * as fs from 'node:fs/promises';

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

for (const name of names) {
  const permutation = [];
  const circles = [];
  const threshhold = Math.random();
  while (permutation.length < 256) {
    permutation[permutation.length] = permutation.length;
  }

  fisherYatesShuffle(permutation);
  while (Math.random() < 0.7) {
    circles.push({
      x: Math.random() * 64,
      y: Math.random() * 64,
      radius: Math.random() * 64,
    });
  }
  await fs.writeFile(
    `./src/data/${name}.json`,
    JSON.stringify({ permutation, threshhold, circles }, null, 2),
    'utf8'
  );
}
