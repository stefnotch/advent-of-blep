import { generateName, type SpecialNameEffect } from "$lib/name-generator";
import seedrandom from "seedrandom";

export interface Chest {
  position: [number, number, number];
  catPicture: number;
  catName: [string, SpecialNameEffect];
}

export function generateChests(seed: number, modelCount: number): Chest[] {
  let chestRng = seedrandom(seed + "");

  let chests: Chest[] = [];
  for (let i = 0; i < 25; i++) {
    // Wrap after 5 chests
    const x = (i % 5) - 2;
    const y = -Math.floor(i / 5) + 1.5;
    chests.push({
      position: [x * 2, y * 2, 0],
      catPicture: Math.floor(chestRng() * modelCount),
      catName: generateName(chestRng),
    });
  }
  return chests;
}
