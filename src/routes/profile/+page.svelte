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
  let formattedNotes: HTMLElement[][];

  onMount(() => {
    currentSections = notes.map(() => 0);
    formattedNotes = notes.map((note) => Formatter(document, note.note));
  });

  $: if (notes && notes.length !== currentSections.length) {
    currentSections = notes.map((_, index) => currentSections[index] ?? 0);
  }

  const sectionCount = (index: number): number =>
    notes[index].note.split("---").length;

  // Function to go to the next section
  const nextSection = (index: number) => {
    currentSections[index] = (currentSections[index] + 1) % sectionCount(index);
  };

  // Function to go to the previous section
  const prevSection = (index: number) => {
    currentSections[index] =
      (currentSections[index] - 1 + sectionCount(index)) % sectionCount(index);
  };

  // Function to check if the previous button should be visible
  const prevSectionVisible = (index: number) =>
    currentSections[index] === 0 ? "hidden" : "";

  // Function to check if the next button should be visible
  const nextSectionVisible = (index: number) =>
    currentSections[index] === sectionCount(index) - 1 ? "hidden" : "";
</script>

<h1>Private page for user: {user?.email}</h1>
<h2>Your poems</h2>
<ul class="container mx-auto grid grid-cols-3 gap-3 overflow-hidden">
  {#each formattedNotes as note, noteIndex}
    <div
      class="prose prose-slate relative aspect-[3/5] overflow-hidden rounded-lg border border-black lg:prose-lg"
    >
      {#each note as section, sectionIndex}
        <section
          class={sectionIndex == currentSections[noteIndex]
            ? "block"
            : "hidden"}
        >
          {@html section.innerHTML}
        </section>
      {/each}
      <div class="absolute bottom-0 right-0">
        <button
          class={`${prevSectionVisible(noteIndex)}`}
          on:click={() => prevSection(noteIndex)}
        >
          Prev
        </button>
        <button
          class={`${nextSectionVisible(noteIndex)}`}
          on:click={() => nextSection(noteIndex)}
        >
          Next
        </button>
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
