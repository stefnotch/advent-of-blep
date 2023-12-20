<script lang="ts">
  import { T, extend, useTask } from "@threlte/core";
  import { ContactShadows, Float, OrbitControls } from "@threlte/extras";
  import Chest from "./minecraft-xmas-chest.svelte";
  import FancyText from "./FancyText.svelte";
  import FancyButton from "./FancyButton.svelte";
  import { interactivity } from "@threlte/extras";
  import { spring, tweened } from "svelte/motion";
  import { Color, DirectionalLight } from "three";
  import { getNextSeed, getPreviousSeed, getSeed } from "$lib/seed";
  import { sineIn, sineInOut } from "svelte/easing";
  import ShowModel, { ModelCount } from "./ShowModel.svelte";
  import { globalSettings } from "./debug-store";
  import seedrandom from "seedrandom";
  import { generateName, type SpecialNameEffect } from "$lib/name-generator";
  interactivity({
    filter: (hits, state) => {
      // Only return the first hit
      return hits.slice(0, 1);
    },
  });
  // One chest per day of advent

  let seed = getSeed();
  interface Chest {
    position: [number, number, number];
    catPicture: number;
    catName: [string, SpecialNameEffect];
  }

  let chests: Chest[] = generateChests(seed);
  $: {
    chests = generateChests(seed);
  }

  function generateChests(seed: number) {
    let chestRng = seedrandom(seed + "");

    let chests: Chest[] = [];
    for (let i = 0; i < 25; i++) {
      // Wrap after 5 chests
      const x = (i % 5) - 2;
      const y = -Math.floor(i / 5) + 1.5;
      chests.push({
        position: [x * 2, y * 2, 0],
        catPicture: Math.floor(chestRng() * ModelCount),
        catName: generateName(chestRng),
      });
    }
    return chests;
  }

  let lightSettings = {
    position: [24, 20.3, 14.1] as [number, number, number],
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

  function vec3Scale(
    a: [number, number, number],
    b: number
  ): [number, number, number] {
    return [a[0] * b, a[1] * b, a[2] * b];
  }

  let modelRotationY = 0;
  function rotateModel(delta: number) {
    modelRotationY += 1 * delta;
    if (modelRotationY > Math.PI * 2) {
      modelRotationY -= Math.PI * 2;
    }
  }
  useTask(rotateModel);

  let light = new DirectionalLight(0xffffff, 1);
  let lightZoom = 1;
  let lightWidth = 11 * lightZoom;
  let lightHeight = 15 * lightZoom;
  $: {
    light.position.set(...lightSettings.position);
    light.intensity = lightSettings.intensity;
  }
  light.castShadow = true;
  light.shadow.mapSize.width = 512;
  light.shadow.mapSize.height = 512;
  light.shadow.camera.near = 20;
  light.shadow.camera.far = 40;
  light.shadow.camera.left = -lightWidth / 2;
  light.shadow.camera.right = lightWidth / 2;
  light.shadow.camera.top = lightHeight / 2;
  light.shadow.camera.bottom = -lightHeight / 2;
  light.shadow.camera.zoom = lightZoom;
  light.shadow.radius = 1;
  light.shadow.autoUpdate = true;
  light.shadow.needsUpdate = true;
</script>

<T.PerspectiveCamera
  makeDefault
  position={[$cameraPositionX, $cameraPositionY, $cameraPositionZ]}
  fov={30}
>
  <OrbitControls
    enableZoom={true}
    enableDamping
    enableRotate={false}
    enablePan={false}
    target={[$cameraTargetX, $cameraTargetY, $cameraTargetZ]}
  />
</T.PerspectiveCamera>

<T is={light} />
<!-- Maybe https://github.com/0beqz/realism-effects -->
<!-- <T.DirectionalLight
  intensity={lightSettings.intensity}
  position={vec3Scale(lightSettings.position, 1)}
  castShadow
>
</T.DirectionalLight> -->

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
    <T.Group
      position={vec3Add(chest.position, [0, 0, isOpen ? 3 : 0])}
      rotation={[0, Math.PI, 0]}
      scale={isHovered && !isOpen ? 1.1 : 1}
    >
      <Chest
        catPicture={chest.catPicture}
        on:entertop={() => (hoveredChestTopIndex = index)}
        on:leavetop={() => (hoveredChestTopIndex = null)}
        on:enterbottom={() => (hoveredChestBottomIndex = index)}
        on:leavebottom={() => (hoveredChestBottomIndex = null)}
        on:click={(e) => {
          openChestIndex = index;
          openChestRotation = spring(0, { stiffness: 0.1, damping: 0.1 });
          $openChestRotation = Math.PI / 2 + 0.3;
        }}
        rotationx={isOpen ? $openChestRotation : 0}
      ></Chest>

      <ShowModel
        catPicture={chest.catPicture}
        position={[0, 1.5, isOpen ? 0 : 100000]}
        rotationY={modelRotationY}
        effect={chest.catName[1]}
      ></ShowModel>
    </T.Group>
    <FancyText
      text={index + 1 + "" + (isOpen ? ". " + chest.catName[0] : "")}
      position={vec3Add(chest.position, [isOpen ? 0 : -1, 1, isOpen ? 4 : 1])}
      rotation={[isOpen ? -0.6 : 0, 0, 0]}
      scale={isOpen ? 0.4 : 1.0}
      center={isOpen}
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
    opacity={$openOpacity * 0.7}
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
  color={openChestIndex === null ? new Color("#FFC000") : new Color("#634c02")}
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
  color={openChestIndex === null ? new Color("#FFC000") : new Color("#634c02")}
  hoverColor={new Color("#FAB0B0")}
  hoverDirection={1}
  scale={[2.0, 2.0, 2.0]}
  opacity={0.8}
></FancyButton>
