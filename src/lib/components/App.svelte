<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene, { type LightSettings } from "./Scene.svelte";
  import { Pane, Slider } from "svelte-tweakpane-ui";

  let lightSettings: LightSettings = {
    position: [20, 16.3, 10.1],
    target: [0, 0, 0],
    intensity: 5,
  };
</script>

<Pane>
  <Slider bind:value={lightSettings.intensity} min={0} max={5} step={0.1} />
  <Slider
    bind:value={lightSettings.position[0]}
    min={-20}
    max={20}
    step={0.1}
  />
  <Slider
    bind:value={lightSettings.position[1]}
    min={-20}
    max={20}
    step={0.1}
  />
  <Slider
    bind:value={lightSettings.position[2]}
    min={-20}
    max={20}
    step={0.1}
  />

  <Slider bind:value={lightSettings.target[0]} min={-20} max={20} step={0.1} />
  <Slider bind:value={lightSettings.target[1]} min={-20} max={20} step={0.1} />
  <Slider bind:value={lightSettings.target[2]} min={-20} max={20} step={0.1} />
</Pane>
<Canvas>
  <Scene {lightSettings} />
</Canvas>
