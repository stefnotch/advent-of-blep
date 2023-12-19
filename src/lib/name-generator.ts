import { type PRNG } from "seedrandom";

type SpecialNameEffect = "shiny" | "small" | null;
let name_start: [string, SpecialNameEffect][] = [
  ["Meepy", null],
  ["Cute", null],
  ["Cuddly", null],
  ["Round", null],
  ["Orange", null],
  ["One-braincelled", null],
  ["Great", null],
  ["Shiny", "shiny"],
  ["Tiny", "small"],
  ["Smol", "small"],
  ["", null],
  ["Sir", null],
  ["Madam", null],
];
let name_end = [
  "Copyright Infringer",
  "Floofball",
  "Meow",
  "Muzi",
  "Gadse",
  "Kitteh",
  "Neko",
  "Neko~",
  "Doombringer",
  "Burglar",
  "Cookie Hunter",
  "Cake Hunter",
  "Cat",
  "Cattus the Third",
  "Salad",
  "Croissant",
];

function randomElement<T>(arr: T[], rng: PRNG): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function generateName(rng: PRNG): [string, SpecialNameEffect] {
  let [start, effect] = randomElement(name_start, rng);
  let end = randomElement(name_end, rng);
  return [start + " " + end, effect];
}
