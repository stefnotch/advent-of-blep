<script lang="ts">
  import { T, forwardEventHandlers } from "@threlte/core";
  import { FontLoader, type Font } from "three/addons/loaders/FontLoader.js";
  import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
  import { Float } from "@threlte/extras";
  import { Color } from "three";

  const loader = new FontLoader();

  export let text = "" as string;
  export let opacity = 1.0;

  const font = new Promise<Font>((resolve, reject) => {
    loader.load(
      import.meta.env.BASE_URL + "font/Pixel Operator_Regular.json",
      (loadedFont: Font) => {
        resolve(loadedFont);
      },
      () => {},
      (error) => {
        console.error(error);
        reject(error);
      }
    );
  });

  async function createTextGeometry(text: string, fontPromise: Promise<Font>) {
    const font = await fontPromise;
    return new TextGeometry(text, {
      font: font,
      size: 0.8,
      height: 0.1,
      curveSegments: 12,
    });
  }

  let textGeometry = createTextGeometry(text, font);

  $: {
    textGeometry = createTextGeometry(text, font);
  }

  export let color = new Color("#ffffff");

  const component = forwardEventHandlers();
</script>

{#await textGeometry}
  <slot name="fallback" />
{:then textGeometry}
  <T.Mesh geometry={textGeometry} {...$$restProps} bind:this={$component}>
    <T.MeshBasicMaterial
      {color}
      transparent={opacity < 1.0 ? true : false}
      {opacity}
      depthWrite={opacity < 1.0 ? false : true}
    />
  </T.Mesh>
{:catch error}
  <slot name="error" {error} />
{/await}
