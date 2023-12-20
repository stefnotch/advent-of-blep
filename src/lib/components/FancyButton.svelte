<script lang="ts">
  import { T, forwardEventHandlers } from "@threlte/core";
  import FancyText from "./FancyText.svelte";
  import { Color, Group } from "three";
  export let text = "" as string;
  export let color = new Color("#ffffff");
  export let hoverColor = null as Color | null;
  export let position = [0, 0, 0] as [number, number, number];
  export let hoverDirection = 1 as 1 | -1;
  let hoverCounter = 0;
  let isHovered = false;
  $: {
    isHovered = hoverCounter > 0;
  }

  let hoverScale = [1.0, 1.0, 1.0];
  $: {
    hoverScale = isHovered ? [1.5, 1.0, 1.2] : [1.0, 1.0, 1.0];
  }

  let pressCounter = 0;
  let isPressed = false;
  $: {
    isPressed = pressCounter > 0;
  }
  let elementPosition: [number, number, number] = [0, 0, 0];
  $: {
    elementPosition = isPressed ? [0.0, 0.0, -0.1] : [0.0, 0.0, 0.0];
  }

  let materialColor = color;
  $: {
    materialColor = isHovered && !isPressed ? hoverColor ?? color : color;
  }

  function vec3Add(a: [number, number, number], b: [number, number, number]) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }
  const component = forwardEventHandlers();
</script>

<T.Group position={vec3Add(elementPosition, position)}>
  <FancyText
    {text}
    color={materialColor}
    on:pointerenter={() => (hoverCounter += 1)}
    on:pointerleave={() => (hoverCounter -= 1)}
    on:pointerdown={() => (pressCounter += 1)}
    on:pointerup={() => (pressCounter -= 1)}
    opacity={0.8}
    {...$$restProps}
    bind:this={$component}
  ></FancyText>
  {#if isHovered}
    <FancyText
      {text}
      on:pointerenter={() => (hoverCounter += 1)}
      on:pointerleave={() => (hoverCounter -= 1)}
      on:pointerdown={() => (pressCounter += 1)}
      on:pointerup={() => (pressCounter -= 1)}
      color={materialColor}
      position={[0.1 * hoverDirection, 0.0, 0]}
      opacity={0.8}
      {...$$restProps}
      bind:this={$component}
    ></FancyText>
  {/if}
</T.Group>
