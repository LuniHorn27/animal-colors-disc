// 首頁夜徑的小動物：用既有 PNG，沿路分散出現並做輕微待機動作。
import { groundY } from './world.js';

const SPECIES = [
  { name: 'rabbit', file: 'rabbit.png', height: 58, hop: true },
  { name: 'owl', file: 'owl.png', height: 62 },
  { name: 'hedgehog', file: 'hedgehog.png', height: 54 },
  { name: 'squirrel', file: 'squirrel.png', height: 60 },
  { name: 'capybara', file: 'capybara-orange-approved.png', height: 68 },
  { name: 'red-panda', file: 'red-panda.png', height: 68 },
];
const PLACEMENTS = [0.04, 0.18, 0.34, 0.5, 0.67, 0.85];

export function createAnimals(worldLength) {
  return SPECIES.map((species, i) => {
    const image = new Image();
    image.src = new URL('../animals/' + species.file, import.meta.url).href;
    return { ...species, image, x: worldLength * PLACEMENTS[i], phase: i * 1.71 };
  });
}

export function drawAnimals(ctx, view, animals, scale, playerX) {
  const { w, h, camX, camY, t, reduced } = view;
  animals.forEach((animal) => {
    const { image } = animal;
    if (!image.complete || !image.naturalWidth) return;
    const x = animal.x - camX;
    if (x < -100 || x > w + 100) return;

    const ground = h * 0.7 + groundY(animal.x) - camY + 8;
    const rhythm = reduced ? 0 : Math.sin(t * (animal.hop ? 0.0032 : 0.0018) + animal.phase);
    const hop = animal.hop ? Math.max(0, rhythm) * 4 * scale : 0;
    const bob = animal.hop ? 0 : rhythm * 1.5 * scale;
    const height = animal.height * scale;
    const width = height * image.naturalWidth / image.naturalHeight;
    const facing = playerX < animal.x ? 1 : -1;

    ctx.save();
    ctx.translate(x, ground - hop - bob);
    ctx.rotate(rhythm * 0.012);
    ctx.scale(facing, 1 + rhythm * 0.008);
    ctx.drawImage(image, -width / 2, -height, width, height);
    ctx.restore();
  });
}

export function animalLightHoles(animals, playerX, camX, viewW, viewH, camY) {
  return animals.filter((animal) => Math.abs(playerX - animal.x) < 340
    && animal.x - camX > -100 && animal.x - camX < viewW + 100)
    .map((animal) => ({
      x: animal.x - camX,
      y: viewH * 0.7 + groundY(animal.x) - camY - animal.height * 0.45,
      r: animal.height * 1.3,
      a: 0.58,
    }));
}
