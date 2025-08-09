export interface Point {
  x: number;
  y: number;
}

interface Circle extends Point {
  radius: number;
}

function distance(a: Point, b: Point, s: number): number {
  const deltaX = Math.abs(b.x - a.x);
  const deltaY = Math.abs(b.y - a.y);
  const deltaXMod = Math.min(deltaX, s - deltaX);
  const deltaYMod = Math.min(deltaY, s - deltaY);
  return Math.sqrt(deltaXMod * deltaXMod + deltaYMod * deltaYMod);
}

export function getPixel(a: Point, circles: Circle[]) {
  let color = 0;
  for (const { x, y, radius } of circles) {
    const d = distance({ x, y }, a, 64);
    if (d <= radius) {
      color += radius - d;
    }
  }
  return color;
}
