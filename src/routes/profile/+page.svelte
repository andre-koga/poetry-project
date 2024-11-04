<script lang="ts">
  import { invalidate } from "$app/navigation";
  import type { EventHandler } from "svelte/elements";

  import type { PageData } from "./$types";
  import { Formatter } from "$lib";
  import { onMount } from "svelte";

  export let data: PageData;
  $: ({ notes, supabase, user } = data);

  let handleSubmit: EventHandler<SubmitEvent, HTMLFormElement>;

  $: handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!evt.target) return;

    const form = evt.target as HTMLFormElement;

    const note = (new FormData(form).get("note") ?? "") as string;
    if (!note) return;

    const { error } = await supabase.from("notes").insert({ note });
    if (error) console.error(error);

    invalidate("supabase:db:notes");
    form.reset();
  };

  let currentSections: number[] = [];

  onMount(() => {
    currentSections = notes.map(() => 0);
  });

  $: if (notes && notes.length !== currentSections.length) {
    currentSections = notes.map((_, index) => currentSections[index] ?? 0);
  }

  // Function to go to the next section
  const nextSection = (index: number) => {
    currentSections[index] =
      (currentSections[index] + 1) % Formatter(notes[index].note).length;
  };

  // Function to go to the previous section
  const prevSection = (index: number) => {
    currentSections[index] =
      (currentSections[index] - 1 + Formatter(notes[index].note).length) %
      Formatter(notes[index].note).length;
  };

  // Function to check if the previous button should be visible
  const prevSectionVisible = (index: number) =>
    currentSections[index] === 0 ? "hidden" : "";

  // Function to check if the next button should be visible
  const nextSectionVisible = (index: number) =>
    currentSections[index] === Formatter(notes[index].note).length - 1
      ? "hidden"
      : "";
</script>

<h1>Private page for user: {user?.email}</h1>
<h2>Your poems</h2>
<ul class="container mx-auto grid grid-cols-3 gap-3 overflow-hidden">
  {#each notes as note, index}
    <div
      class="prose prose-slate lg:prose-lg relative aspect-[3/5] overflow-hidden rounded-lg border border-black"
    >
      {#each Formatter(note.note) as section, sectionIndex}
        {#if sectionIndex === currentSections[index]}
          <section
            class="absolute left-0 top-0 h-full w-full border border-red-500 px-4"
          >
            {@html section}
          </section>
        {/if}
      {/each}
      <div class="absolute bottom-0 left-0 right-0 flex justify-between p-4">
        <button
          class={prevSectionVisible(index)}
          on:click={() => prevSection(index)}>Previous</button
        >
        <button
          class={nextSectionVisible(index)}
          on:click={() => nextSection(index)}>Next</button
        >
      </div>
    </div>
  {/each}
</ul>
<form on:submit={handleSubmit}>
  <label>
    New Poem
    <textarea name="note" required></textarea>
  </label>
  <button type="submit">Save</button>
</form>
