<script lang="ts">
  import { Canvas, useThrelteUserContext } from "@threlte/core";
  import Scene from "./Scene.svelte";
  import { Pane, Slider } from "svelte-tweakpane-ui";
  import { globalSettings } from "./debug-store";

  let isDebug = import.meta.env.MODE === "development";
</script>

{#if isDebug}
  <Pane>
    <Slider bind:value={$globalSettings.a} min={-20} max={20} step={0.1} />
    <Slider bind:value={$globalSettings.b} min={-20} max={20} step={0.1} />
    <Slider bind:value={$globalSettings.c} min={-20} max={20} step={0.1} />
    <Slider bind:value={$globalSettings.d} min={-20} max={20} step={0.1} />
  </Pane>
{/if}
<Canvas>
  <Scene />
</Canvas>
