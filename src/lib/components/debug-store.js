import { writable } from "svelte/store";

export const globalSettings = writable({
  a: -1.8,
  b: 0.5,
  c: 0.1,
  d: -0.6,
});
