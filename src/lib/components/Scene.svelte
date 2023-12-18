<script lang="ts" context="module">
  export interface LightSettings {
    position: [number, number, number];
    target: [number, number, number];
    intensity: number;
  }
</script>

<script lang="ts">
  import { T, extend } from "@threlte/core";
  import { Float, OrbitControls } from "@threlte/extras";
  import { Pane, Slider } from "svelte-tweakpane-ui";
  import Chest from "./minecraft-xmas-chest.svelte";
  import FancyText from "./FancyText.svelte";
  import { interactivity } from "@threlte/extras";
  import { spring } from "svelte/motion";
  interactivity({
    filter: (hits, state) => {
      // Only return the first hit
      return hits.slice(0, 1);
    },
  });
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
    const y = -Math.floor(i / 5) + 1.5;
    chests.push({
      position: [x * 2, y * 2, 0],
      catPicture: 0,
    });
  }

  let lightSettings: LightSettings = {
    position: [20, 16.3, 10.1],
    target: [0, 0, 0],
    intensity: 5,
  };

  let hoveredChestTopIndex: number | null = null;
  let hoveredChestBottomIndex: number | null = null;

  function vec3Add(a: [number, number, number], b: [number, number, number]) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

  let openChestRotation = spring(0, { stiffness: 0.1, damping: 0.1 });
  let openChestIndex: number | null = null;
</script>

<T.PerspectiveCamera makeDefault position={[0, 5, 20]} fov={30}>
  <OrbitControls enableZoom={true} enableDamping enablePan={false} />
</T.PerspectiveCamera>

<!-- Maybe https://github.com/0beqz/realism-effects -->
<T.DirectionalLight
  intensity={lightSettings.intensity}
  position={lightSettings.position}
  castShadow
/>
<T.AmbientLight intensity={0.2} />

{#each chests as chest, index}
  {@const isHovered =
    hoveredChestTopIndex === index || hoveredChestBottomIndex === index}
  {@const isOpen = openChestIndex === index}
  <Float
    floatIntensity={isHovered ? 1.5 : 1}
    speed={isHovered ? 2.0 : 1}
    rotationIntensity={isHovered ? 0.5 : 0.0}
    rotationRange={[0, isHovered ? 0.05 : 0.0]}
    rotationSpeed={isHovered ? 3 : 0.0}
  >
    <!-- Hmm https://github.com/mrdoob/three.js/issues/21483 -->
    <Chest
      position={chest.position}
      rotation={[0, Math.PI, 0]}
      scale={isHovered ? 1.1 : 1}
      catPicture={chest.catPicture}
      on:entertop={() => (hoveredChestTopIndex = index)}
      on:leavetop={() => (hoveredChestTopIndex = null)}
      on:enterbottom={() => (hoveredChestBottomIndex = index)}
      on:leavebottom={() => (hoveredChestBottomIndex = null)}
      on:click={(e) => {
        openChestIndex = index;
        openChestRotation = spring(0, { stiffness: 0.1, damping: 0.1 });
        $openChestRotation = Math.PI / 2;
      }}
      rotationx={isOpen ? $openChestRotation : 0}
    ></Chest>

    <FancyText
      text={index + 1 + ""}
      position={vec3Add(chest.position, [-1, 1, 1])}
    ></FancyText>
  </Float>
{/each}
