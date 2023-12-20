interface SeedStorage {
  year: number;
}

// interfaces with localStorage
export function getSeed() {
  const seedStorage = getOrCreateSeedStorage();
  return seedStorage.year;
}

export function getNextSeed() {
  const seedStorage = getOrCreateSeedStorage();
  seedStorage.year = seedStorage.year + 1;
  localStorage.setItem("seedStorage", JSON.stringify(seedStorage));
  return getSeed();
}

export function getPreviousSeed() {
  const seedStorage = getOrCreateSeedStorage();
  seedStorage.year = seedStorage.year - 1;
  localStorage.setItem("seedStorage", JSON.stringify(seedStorage));
  return getSeed();
}

function getOrCreateSeedStorage() {
  const seedStorage = getSeedStorage();
  if (seedStorage) {
    return seedStorage;
  } else {
    const seedStorage: SeedStorage = {
      year: new Date().getFullYear(),
    };
    localStorage.setItem("seedStorage", JSON.stringify(seedStorage));
    return seedStorage;
  }
}

function getSeedStorage() {
  const seedStorage = localStorage.getItem("seedStorage");
  if (seedStorage) {
    try {
      const v = JSON.parse(seedStorage) as SeedStorage;
      if (
        v.year === undefined ||
        v.year === null ||
        isNaN(v.year) ||
        v.year !== Math.floor(v.year) ||
        v.year !== Math.ceil(v.year)
      ) {
        return null;
      } else {
        return v;
      }
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
}
