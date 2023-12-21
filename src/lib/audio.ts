// Use Vite to reference all audio files in the src/lib/audio folder
// and export them as an object with the file name as the key.

// Get all audio files in the src/lib/audio folder
const audioImports = import.meta.glob("./audio/*.wav", { eager: true });
const audioFiles = Object.entries(audioImports).map(
  ([name, pathObj]: [string, any]) => {
    const audio = new Audio(pathObj.default);
    audio.volume = 0.2;
    return [name, audio] as const;
  }
);
export function playRandomAudio() {
  // Play a random audio file from the audioFiles array
  const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
  console.log(randomAudio[0]);
  randomAudio[1].play();
}
