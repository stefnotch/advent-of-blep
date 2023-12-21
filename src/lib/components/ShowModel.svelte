<script lang="ts" context="module">
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
  import TubbsCopyrightInFridge from "./models/tubbs-copyright-in-fridge.svelte";

  interface CatModel {
    component: any;
    position: [number, number, number];
    scale: number;
  }
  function createCatModel(
    component: any,
    position: [number, number, number],
    scale: number
  ): CatModel {
    return { component, position, scale };
  }

  const models = [
    createCatModel(BanaCat, [0, 0, 0], 0.05),
    createCatModel(BigCat, [0, 0, 0], 0.05),
    createCatModel(BlackAndWhitePusheen, [0, 0, 0], 0.1),
    createCatModel(BongoCat, [0, 0, 0], 0.05),
    createCatModel(CalicoCat, [0, 0, 0], 0.05),
    createCatModel(CuteCat, [0, 0, 0], 0.05),
    createCatModel(LightOrangePusheen, [0, 0, 0], 0.1),
    createCatModel(OrangeCat, [0, 0, 0], 0.1),
    createCatModel(OrangePusheen, [0, 0, 0], 0.12),
    createCatModel(PusheenSittingSquished, [0, 0, 0], 0.07),
    createCatModel(PusheenSitting, [0, 0, 0], 0.07),
    createCatModel(PusheenSleeping, [0, 0, 0], 0.07),
    createCatModel(Pusheen, [0, 0, 0], 0.1),
    createCatModel(SmolCatBlack, [0, 0, 0], 0.08),
    createCatModel(SmolCatEvil, [0, 0, 0], 0.08),
    createCatModel(SmolCatOrange, [0, 0, 0], 0.08),
    createCatModel(SmolCatPinkBad, [0, 0, 0], 0.08),
    createCatModel(SmolCatPinkEyes, [0, 0, 0], 0.08),
    createCatModel(SmolCatTwoColor, [0, 0, 0], 0.08),
    createCatModel(SmolCatWhite, [0, 0, 0], 0.08),
    createCatModel(TubbsCopyrightInFridge, [0, 1, 0], 0.08),
  ];

  export const ModelCount = models.length;
</script>

<script lang="ts">
  import { T } from "@threlte/core";
  import { Float } from "@threlte/extras";
  import type { SpecialNameEffect } from "$lib/name-generator";
  import { Box3, Vector3 } from "three";
  import { spring } from "svelte/motion";
  import { vec3_add } from "$lib/vec3";
  import { playRandomAudio } from "$lib/audio";
  export let catPicture: number = 0;
  export let position = [0, 0, 0] as [number, number, number];
  export let scale = 1.0;
  export let rotationY = 0;
  export let effect: SpecialNameEffect = null;

  export const MAX_CAT_PICTURE = models.length - 1;

  let model = models[catPicture];
  $: {
    model = models[catPicture];
  }
  let boundingBox = new Box3();
  let childComponent: any;
  $: {
    if (childComponent) {
      childComponent.gltf.subscribe((result: any) => {
        if (!result) return;
        if (!childComponent) return;
        boundingBox = recenterBoundingBox(
          boundingBox.setFromObject(childComponent.ref)
        );
        Object.keys(result.nodes).forEach((key) => {
          const node = result.nodes[key];
          if (node.geometry && !node.geometry.attributes.normal) {
            node.geometry.computeVertexNormals();
          }
        });
      });
    }
  }

  function recenterBoundingBox(bb: Box3): Box3 {
    const center = bb.getCenter(new Vector3());
    bb.translate(center.negate());
    return bb;
  }

  let petYPosition = spring(0, { stiffness: 0.1, damping: 0.1 });

  function onPet() {
    playRandomAudio();
    $petYPosition = -0.14;
    setTimeout(() => {
      $petYPosition = 0;
    }, 200);
  }
</script>

<T.Group position={vec3_add(position, [0, $petYPosition, 0])}>
  <Float speed={2.5}>
    <T.Group scale={effect === "small" ? 0.25 : 0.5}>
      <T.Group position={model.position} rotation={[0.3, rotationY, 0]}>
        <!-- Align can miss the whole "model loaded" stuff, so we gotta force it to recompute -->
        <svelte:component
          this={model.component}
          scale={scale * model.scale}
          bind:this={childComponent}
        />
        <T.Mesh interactive on:click={onPet}>
          <T.Box3Helper
            args={[boundingBox, 0x00ff00]}
            scale={scale * model.scale}
          >
            <!-- Invisible material -->
            <T.MeshBasicMaterial
              color={"#00FF00"}
              transparent={true}
              opacity={0.0}
              depthWrite={false}
            />
          </T.Box3Helper>
        </T.Mesh>
      </T.Group>
    </T.Group>
  </Float>
</T.Group>
