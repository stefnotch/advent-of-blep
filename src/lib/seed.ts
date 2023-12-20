const generateSeed = () => {
  return crypto.randomUUID();
};

interface Seed {
  seed: string;
}

interface SeedStorage {
  seedIndex: number;
  seeds: Seed[];
}

// interfaces with localStorage
export function getSeed() {
  const seedStorage = getOrCreateSeedStorage();
  return seedStorage.seeds[seedStorage.seedIndex].seed;
}

export function getNextSeed() {
  const seedStorage = getOrCreateSeedStorage();
  const nextIndex = seedStorage.seedIndex + 1;
  if (nextIndex < seedStorage.seeds.length) {
    seedStorage.seedIndex = nextIndex;
    localStorage.setItem("seedStorage", JSON.stringify(seedStorage));
    return seedStorage.seeds[seedStorage.seedIndex].seed;
  } else {
    const seed = generateSeed();
    seedStorage.seedIndex = nextIndex;
    seedStorage.seeds.push({ seed });
    localStorage.setItem("seedStorage", JSON.stringify(seedStorage));
    return seed;
  }
}

export function getPreviousSeed() {
  const seedStorage = getOrCreateSeedStorage();
  const previousIndex = seedStorage.seedIndex - 1;
  if (previousIndex >= 0) {
    seedStorage.seedIndex = previousIndex;
    localStorage.setItem("seedStorage", JSON.stringify(seedStorage));
    return seedStorage.seeds[seedStorage.seedIndex].seed;
  } else {
    return null;
  }
}

function getOrCreateSeedStorage() {
  const seedStorage = getSeedStorage();
  if (seedStorage) {
    return seedStorage;
  } else {
    const seed = generateSeed();
    const seedStorage: SeedStorage = {
      seedIndex: 0,
      seeds: [{ seed }],
    };
    localStorage.setItem("seedStorage", JSON.stringify(seedStorage));
    return seedStorage;
  }
}

function getSeedStorage() {
  const seedStorage = localStorage.getItem("seedStorage");
  if (seedStorage) {
    try {
      return JSON.parse(seedStorage) as SeedStorage;
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
}
