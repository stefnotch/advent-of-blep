<script lang="ts">
  import { Canvas, useThrelteUserContext } from "@threlte/core";
  import Scene, { type LightSettings } from "./Scene.svelte";
  import { Pane, Slider } from "svelte-tweakpane-ui";
  import { globalSettings } from "./debug-store";
</script>

<Pane>
  <Slider bind:value={$globalSettings.a} min={-20} max={20} step={0.1} />
  <Slider bind:value={$globalSettings.b} min={-20} max={20} step={0.1} />
  <Slider bind:value={$globalSettings.c} min={-20} max={20} step={0.1} />
</Pane>
<Canvas>
  <Scene />
</Canvas>
