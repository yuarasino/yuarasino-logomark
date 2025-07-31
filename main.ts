type Position = [number, number];
type Point = [number, number];

const SIN60 = Math.sin(Math.PI / 180 * 60);
const COS60 = Math.cos(Math.PI / 180 * 60);

const UNIT = 100;
const SIZE = UNIT * 7;
const X0 = 0; // SIZE / 2 - SIZE * COS60
const Y0 = SIZE / 2 - SIZE * SIN60 / 2;
const R = 1 / 8;
const D = 1 / 8;

const RED = "#fb2c36"; // fill-red-500
const BLUE = "#2b7fff"; // fill-blue-500
const YELLOW = "#efb100"; // fill-yellow-500
const WHITE = "#ffffff"; // fill-white

const polygon1: Position[] = [
  [0, 0],
  [2 - D, 0],
  [2 - D, 1],
  [1, 1],
];
const polygon2: Position[] = [
  [2, 0],
  [3, 0],
  [3, 3],
  [2, 2],
];
const polygon3: Position[] = [
  [3 + D, 0],
  [7, 0],
  [7, 1],
  [3 + D, 1],
];
const polygon4: Position[] = [
  [4, 1 + D],
  [5, 1 + D],
  [5, 2],
  [6 - D, 3 - D],
  [6 - D, 4 - D],
  [5, 3],
  [5, 5],
  [4, 4],
];
const polygon5: Position[] = [
  [5 + D, 4 + D],
  [6, 5],
  [6, 2],
  [7, 2],
  [7, 7],
  [5 + D, 5 + D],
];

const circle1: Position = [2.5, 0.5];
const circle2: Position = [4.5, 0.5];
const circle3: Position = [4.5, 4];
const circle4: Position = [6.5, 4];

function positionToPoint(position: Position): Point {
  const ux = position[0] + position[1];
  const uy = position[0] - position[1];
  const px = X0 + UNIT * COS60 * ux;
  const py = Y0 + UNIT * SIN60 * uy;
  return [px, py];
}

function pointToM(point: Point): string {
  const sx = point[0].toFixed(3);
  const sy = point[1].toFixed(3);
  return `M ${sx} ${sy}`;
}

function pointToL(point: Point): string {
  const sx = point[0].toFixed(3);
  const sy = point[1].toFixed(3);
  return `L ${sx} ${sy}`;
}

function pointToA(point: Point): string {
  const r = (UNIT * R).toFixed(3);
  const sx = point[0].toFixed(3);
  const sy = point[1].toFixed(3);
  return `A ${r} ${r} 0 0 0 ${sx} ${sy}`;
}

function polygonToDraw(polygon: Position[]): string {
  const mm = polygon[0];
  const ml = polygon.slice(1);
  const pm = positionToPoint(mm);
  const pl = ml.map(positionToPoint);
  const sm = pointToM(pm);
  const sl = pl.map(pointToL);
  return [sm, ...sl, "Z"].join("\n");
}

function circleToDraw(circle: Position): string {
  const mm: Position = [circle[0] - R, circle[1] - R];
  const ma: Position = [circle[0] + R, circle[1] + R];
  const pm = positionToPoint(mm);
  const pa = positionToPoint(ma);
  const sm = pointToM(pm);
  const sa = pointToA(pa);
  const sb = pointToA(pm);
  return [sm, sa, sb, "Z"].join("\n");
}

function drawToPath(draw: string, fill: string): string {
  return `
<path
  d="
${draw}
  "
  fill="${fill}"
  fill-rule="evenodd"
/>
  `.trim();
}

function createSvg(content: string): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">
${content}
</svg>
  `.trim();
}

const draw1 = [polygonToDraw(polygon1)].join("\n");
const draw2 = [polygonToDraw(polygon2), circleToDraw(circle1)].join("\n");
const draw3 = [polygonToDraw(polygon3), circleToDraw(circle2)].join("\n");
const draw4 = [polygonToDraw(polygon4), circleToDraw(circle3)].join("\n");
const draw5 = [polygonToDraw(polygon5), circleToDraw(circle4)].join("\n");

const path1 = drawToPath(draw1, RED);
const path2 = drawToPath(draw2, BLUE);
const path3 = drawToPath(draw3, RED);
const path4 = drawToPath(draw4, BLUE);
const path5 = drawToPath(draw5, YELLOW);

const content1 = [path1, path2, path3, path4, path5].join("\n");
const svg1 = createSvg(content1);

await Deno.writeTextFile("./logomarks/logomark.svg", svg1);

const path6 = drawToPath(draw1, WHITE);
const path7 = drawToPath(draw2, WHITE);
const path8 = drawToPath(draw3, WHITE);
const path9 = drawToPath(draw4, WHITE);
const path10 = drawToPath(draw5, WHITE);

const content2 = [path6, path7, path8, path9, path10].join("\n");
const svg2 = createSvg(content2);

await Deno.writeTextFile("./logomarks/logomark-mono.svg", svg2);
