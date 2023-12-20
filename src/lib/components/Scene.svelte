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
  import Chest from "./minecraft-xmas-chest.svelte";
  import BanaCat from "./models/bana-cat.svelte";
  import BigCat from "./models/big-cat.svelte";
  import BlackAndWhitePusheen from "./models/black-and-white-pusheen.svelte";
  import BongoCat from "./models/bongo-cat.svelte";
  import CalicoCat from "./models/calico-cat.svelte";
  import CuteCat from "./models/cute-cat.svelte";
  import LightOrangePusheen from "./models/light-orange-pusheen.svelte";
  import OrangeCat from "./models/orange-cat.svelte";
  import OrangePusheen from "./models/orange-pusheen.svelte";
  import PusheenSittingSquished from "./models/pusheen-sitting-squished.svelte";
  import PusheenSitting from "./models/pusheen-sitting.svelte";
  import PusheenSleeping from "./models/pusheen-sleeping.svelte";
  import Pusheen from "./models/pusheen.svelte";
  import SmolCatBlack from "./models/smol-cat-black.svelte";
  import SmolCatEvil from "./models/smol-cat-evil.svelte";
  import SmolCatOrange from "./models/smol-cat-orange.svelte";
  import SmolCatPinkBad from "./models/smol-cat-pink-bad.svelte";
  import SmolCatPinkEyes from "./models/smol-cat-pink-eyes.svelte";
  import SmolCatTwoColor from "./models/smol-cat-two-color.svelte";
  import SmolCatWhite from "./models/smol-cat-white.svelte";
  import FancyText from "./FancyText.svelte";
  import FancyButton from "./FancyButton.svelte";
  import { interactivity } from "@threlte/extras";
  import { spring, tweened } from "svelte/motion";
  import { Color } from "three";
  import { getNextSeed, getPreviousSeed, getSeed } from "$lib/seed";
  import { sineIn, sineInOut } from "svelte/easing";
  import { globalSettings } from "./debug-store";
  interactivity({
    filter: (hits, state) => {
      // Only return the first hit
      return hits.slice(0, 1);
    },
  });
  // One chest per day of advent

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

  function vec3Add(
    a: [number, number, number],
    b: [number, number, number]
  ): [number, number, number] {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

  let openChestRotation = spring(0, { stiffness: 0.1, damping: 0.1 });
  let openChestIndex: number | null = null;

  let seed = getSeed();

  const cameraTweenSettings = {
    delay: 0,
    duration: 1000,
    easing: sineInOut,
  };
  const cameraStartPosition: [number, number, number] = [0, 6, 23];
  let cameraPositionX = tweened(cameraStartPosition[0], cameraTweenSettings);
  let cameraPositionY = tweened(cameraStartPosition[1], cameraTweenSettings);
  let cameraPositionZ = tweened(cameraStartPosition[2], cameraTweenSettings);
  $: {
    if (openChestIndex !== null) {
      const openChestPosition = chests[openChestIndex].position;
      const newCameraPosition = [
        openChestPosition[0],
        openChestPosition[1] + 6,
        openChestPosition[2] + 7,
      ];
      cameraPositionX.set(newCameraPosition[0]);
      cameraPositionY.set(newCameraPosition[1]);
      cameraPositionZ.set(newCameraPosition[2]);
    } else {
      cameraPositionX.set(cameraStartPosition[0]);
      cameraPositionY.set(cameraStartPosition[1]);
      cameraPositionZ.set(cameraStartPosition[2]);
    }
  }

  const cameraStartTarget: [number, number, number] = [0, 0.5, 0];
  let cameraNewTarget: [number, number, number] = [0, 0, 0];
  let cameraTargetX = tweened(cameraStartTarget[0], cameraTweenSettings);
  let cameraTargetY = tweened(cameraStartTarget[1], cameraTweenSettings);
  let cameraTargetZ = tweened(cameraStartTarget[2], cameraTweenSettings);
  $: {
    if (openChestIndex !== null) {
      const openChestPosition = chests[openChestIndex].position;
      cameraNewTarget = [
        openChestPosition[0],
        openChestPosition[1] + 1.5,
        openChestPosition[2] + 3,
      ];
      cameraTargetX.set(cameraNewTarget[0]);
      cameraTargetY.set(cameraNewTarget[1]);
      cameraTargetZ.set(cameraNewTarget[2]);
    } else {
      cameraTargetX.set(cameraStartTarget[0]);
      cameraTargetY.set(cameraStartTarget[1]);
      cameraTargetZ.set(cameraStartTarget[2]);
    }
  }

  let openOpacity = tweened(0, {
    delay: 0,
    duration: 400,
    easing: sineIn,
  });
  $: {
    if (openChestIndex !== null) {
      openOpacity.set(1);
    } else {
      openOpacity.set(0);
    }
  }
</script>

<T.PerspectiveCamera
  makeDefault
  position={[$cameraPositionX, $cameraPositionY, $cameraPositionZ]}
  fov={30}
>
  <OrbitControls
    enableZoom={true}
    enableDamping
    enablePan={false}
    target={[$cameraTargetX, $cameraTargetY, $cameraTargetZ]}
  />
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
    floatIntensity={isOpen ? 0.0 : isHovered ? 1.5 : 1}
    speed={isOpen ? 0.0 : isHovered ? 2.0 : 1}
    rotationIntensity={isOpen ? 0.0 : isHovered ? 0.5 : 0.0}
    rotationRange={[0, isOpen ? 0.0 : isHovered ? 0.05 : 0.0]}
    rotationSpeed={isOpen ? 0.0 : isHovered ? 3 : 0.0}
  >
    <!-- Hmm https://github.com/mrdoob/three.js/issues/21483 -->
    <Chest
      position={vec3Add(chest.position, [0, 0, isOpen ? 3 : 0])}
      rotation={[0, Math.PI, 0]}
      scale={isHovered && !isOpen ? 1.1 : 1}
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
      position={vec3Add(chest.position, [-1, 1, isOpen ? 4 : 1])}
      scale={isOpen ? 0.8 : 1.0}
    ></FancyText>
  </Float>
{/each}

<T.Mesh
  scale={[50, 50, 50]}
  position={[0, 0, 1.4 + 50 / 2]}
  frustumCulled={false}
>
  <T.BoxGeometry frustumCulled={false} />
  <T.MeshBasicMaterial
    color={"#000000"}
    transparent={true}
    opacity={$openOpacity * 0.6}
    depthWrite={false}
    side={2}
  />
</T.Mesh>

{#if openChestIndex !== null}
  <T.Mesh
    scale={[50, 50, 0.1]}
    position={[0, 0, 1.4]}
    interactive
    on:pointerup={() => {
      openChestIndex = null;
    }}
  >
    <T.BoxGeometry />
    <T.MeshBasicMaterial
      color={"#000000"}
      transparent={true}
      opacity={0.0}
      depthWrite={false}
    />
  </T.Mesh>
{/if}

<!-- Display a "back" button, position is relative to the camera target -->
<FancyButton
  text="Back"
  position={vec3Add(
    cameraNewTarget,
    openChestIndex !== null ? [-1.8, 0.5, 0.1] : [0, 0, 10000]
  )}
  rotation={[-0.6, 0, 0]}
  on:click={() => {
    console.log("back");
    openChestIndex = null;
  }}
  color={new Color("#FFC000")}
  hoverColor={new Color("#FAB0B0")}
  hoverDirection={1}
  scale={[0.5, 0.5, 0.5]}
></FancyButton>

<FancyText
  text={"Year " + seed}
  color={new Color("#13ca4a")}
  position={[-4, 5, -3]}
  scale={2.0}
></FancyText>

<!-- Previous and next buttons -->
<FancyButton
  text="<"
  position={[-6.3, -4, 0]}
  on:click={() => {
    let nextSeed = getPreviousSeed();
    if (nextSeed !== null) {
      seed = nextSeed;
    }
  }}
  color={new Color("#FFC000")}
  hoverColor={new Color("#AFB0B0")}
  hoverDirection={-1}
  scale={[2.0, 2.0, 2.0]}
  opacity={0.8}
></FancyButton>
<FancyButton
  text=">"
  position={[5.6, -4, 0]}
  on:click={() => {
    let nextSeed = getNextSeed();
    if (nextSeed !== null) {
      seed = nextSeed;
    }
  }}
  color={new Color("#FFC000")}
  hoverColor={new Color("#FAB0B0")}
  hoverDirection={1}
  scale={[2.0, 2.0, 2.0]}
  opacity={0.8}
></FancyButton>
