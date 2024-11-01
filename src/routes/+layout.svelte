<script lang="ts">
  import "../app.css";
  import "$layout/Header.svelte";
  import "@fontsource/lora";
  import Header from "$layout/Header.svelte";
</script>

<div class="font-lora">
  <Header />
  <main>
    <slot />
  </main>
</div>
