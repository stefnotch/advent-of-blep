<script lang="ts">
  import { T, forwardEventHandlers } from "@threlte/core";
  import FancyText from "./FancyText.svelte";
  import { Color, Group } from "three";
  import { createEventDispatcher } from "svelte";
  import { vec3_add, type Vec3 } from "$lib/vec3";
  export let text = "" as string;
  export let color = new Color("#ffffff");
  export let hoverColor = null as Color | null;
  export let position = [0, 0, 0] as [number, number, number];
  export let hoverDirection = 1 as 1 | -1;
  export let opacity = 1.0;
  export let scale = [1.0, 1.0, 1.0] as [number, number, number];
  const dispatch = createEventDispatcher();

  let hoverCounter = 0;
  let isHovered = false;
  $: {
    isHovered = hoverCounter > 0;
  }

  let hoverScale = [1.0, 1.0, 1.0];
  $: {
    hoverScale = isHovered ? [1.5, 1.0, 1.2] : [1.0, 1.0, 1.0];
  }

  let isPressed = false;

  let elementPosition: Vec3 = [0, 0, 0];
  $: {
    elementPosition = isPressed ? [0.0, 0.0, -0.1] : [0.0, 0.0, 0.0];
  }

  let materialColor = color;
  $: {
    materialColor = isHovered && !isPressed ? hoverColor ?? color : color;
  }

  function click() {
    dispatch("click");
  }

  let oldIsPressed = false;
  $: {
    if (oldIsPressed && !isPressed) {
      click();
    }
    oldIsPressed = isPressed;
  }

  globalThis.addEventListener("pointerup", () => {
    isPressed = false;
  });
</script>

<T.Group position={vec3_add(elementPosition, position)}>
  <FancyText
    {text}
    color={materialColor}
    on:pointerenter={() => (hoverCounter += 1)}
    on:pointerleave={() => (hoverCounter -= 1)}
    on:pointerdown={(e) => {
      isPressed = true;
    }}
    {opacity}
    {scale}
    {...$$restProps}
  ></FancyText>
  <FancyText
    {text}
    on:pointerenter={() => (hoverCounter += 1)}
    on:pointerleave={() => (hoverCounter -= 1)}
    on:pointerdown={() => {
      isPressed = true;
    }}
    color={materialColor}
    position={[0.05 * hoverDirection * scale[0], -0.01, -0.01]}
    {scale}
    opacity={isHovered ? opacity : 0.0}
    {...$$restProps}
  ></FancyText>
  <FancyText
    {text}
    on:pointerenter={() => (hoverCounter += 1)}
    on:pointerleave={() => (hoverCounter -= 1)}
    on:pointerdown={() => {
      isPressed = true;
    }}
    color={materialColor}
    position={[0.1 * hoverDirection * scale[0], -0.01, -0.01]}
    {scale}
    opacity={isHovered ? opacity : 0.0}
    {...$$restProps}
  ></FancyText>
</T.Group>
