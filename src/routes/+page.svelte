<script lang="ts">
  import App from "$lib/components/App.svelte";
  import { spring } from "svelte/motion";

  /*
  @function multiple-box-shadow ($n) 
  $value: '#{random(2000)}px #{random(2000)}px #FFF'
  @for $i from 2 through $n
    $value: '#{$value} , #{random(2000)}px #{random(2000)}px #FFF'

  @return unquote($value)

$shadows-small:  multiple-box-shadow(700)
$shadows-medium: multiple-box-shadow(200)
$shadows-big:    multiple-box-shadow(100) */

  const WindowWidth = 2000;
  const WindowHeight = 2000;

  function multipleBoxShadowCss(n: number) {
    const random = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    const range = (n: number) => Array.from(Array(n).keys());
    return range(n)
      .map(
        (i) =>
          `${random(-WindowWidth * 0.2, WindowWidth * 1.2)}px ${random(
            -WindowWidth * 0.2,
            WindowWidth * 1.2
          )}px #FFF`
      )
      .join(", ");
  }

  const shadowsSmall = multipleBoxShadowCss(700);
  const shadowsMedium = multipleBoxShadowCss(200);
  const shadowsBig = multipleBoxShadowCss(100);

  const mouseCoords = spring({ x: 0, y: 0 });
  const onMouseMove = (event: MouseEvent) => {
    $mouseCoords = { x: event.x, y: event.y };
  };

  $: vectorFromCenter = {
    x: $mouseCoords.x - WindowWidth / 2,
    y: $mouseCoords.y - WindowHeight / 2,
  };

  function toCssTransform({ x, y }: { x: number; y: number }) {
    return `translate(${x}px, ${y}px)`;
  }
  function scaleVector({ x, y }: { x: number; y: number }, scale: number) {
    return { x: x * scale, y: y * scale };
  }
  const starScale = 2;
</script>

<div class="main" on:mousemove={onMouseMove} role="application">
  <div
    class="bg-1"
    style:box-shadow={shadowsSmall}
    style:transform={toCssTransform(
      scaleVector(vectorFromCenter, 1 / (starScale * 2))
    )}
  ></div>
  <div
    class="bg-2"
    style:box-shadow={shadowsMedium}
    style:transform={toCssTransform(
      scaleVector(vectorFromCenter, 1 / (starScale * 4))
    )}
  ></div>
  <div
    class="bg-3"
    style:box-shadow={shadowsBig}
    style:transform={toCssTransform(
      scaleVector(vectorFromCenter, 1 / (starScale * 6))
    )}
  ></div>
  <div style:position={"absolute"}>
    <App />
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
  }

  div {
    width: 100vw;
    height: 100vh;
  }
  .main {
    background: rgb(26, 37, 63);
    background: linear-gradient(
      180deg,
      rgb(38, 56, 94) 0%,
      rgb(19, 19, 51) 100%
    );
  }
  .bg-1 {
    width: 1px;
    height: 1px;
    background: transparent;
    position: relative;
  }
  .bg-2 {
    width: 2px;
    height: 2px;
    background: transparent;
    position: relative;
  }
  .bg-3 {
    width: 3px;
    height: 3px;
    background: transparent;
    position: relative;
  }
</style>
