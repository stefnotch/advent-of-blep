import { writable } from "svelte/store";

export const globalSettings = writable({
  a: 0,
  b: 9.5,
  c: 6.5,
});
