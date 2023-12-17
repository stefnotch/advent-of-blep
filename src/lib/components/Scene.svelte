<script lang="ts" context="module">
  export interface LightSettings {
    position: [number, number, number];
    target: [number, number, number];
    intensity: number;
  }
</script>

<script lang="ts">
  import { T } from "@threlte/core";
  import {
    ContactShadows,
    Float,
    Grid,
    RoundedBoxGeometry,
    OrbitControls,
  } from "@threlte/extras";
  import { Pane, Slider } from "svelte-tweakpane-ui";
  import Chest from "./models/minecraft-xmas-chest.svelte";
  // One chest per day of advent

  //////// https://tympanus.net/Development/CubesAdventCalendar/index3.html

  interface Chest {
    position: [number, number, number];
    catPicture: number;
  }

  let chests: Chest[] = [];
  for (let i = 0; i < 25; i++) {
    // Wrap after 5 chests
    const x = (i % 5) - 2;
    const y = Math.floor(i / 5) - 2.5;
    chests.push({
      position: [x * 2, y * 2, 0],
      catPicture: 0,
    });
  }

  export let lightSettings: LightSettings;
</script>

<T.PerspectiveCamera makeDefault position={[0, 5, 20]} fov={30}>
  <OrbitControls enableZoom={true} enableDamping />
</T.PerspectiveCamera>

<!-- Maybe https://github.com/0beqz/realism-effects -->
<T.DirectionalLight
  intensity={lightSettings.intensity}
  position={lightSettings.position}
  castShadow
/>
<T.AmbientLight intensity={0.2} />

<Grid
  position.y={-0.001}
  cellColor="#ffffff"
  sectionColor="#ffffff"
  sectionThickness={0}
  fadeDistance={25}
  cellSize={2}
/>

{#each chests as chest}
  <Float floatIntensity={1} floatingRange={[0, 0.1]}>
    <!-- Hmm https://github.com/mrdoob/three.js/issues/21483 -->
    <Chest
      position={chest.position}
      rotation={[0, Math.PI, 0]}
      catPicture={chest.catPicture}
    ></Chest>
  </Float>
{/each}
