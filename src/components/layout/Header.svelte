<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Session, SupabaseClient } from "@supabase/supabase-js";

  export let session: Session | null;
  export let supabase: SupabaseClient<any, "public", any>;

  $: logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during logout:", error);
    }
    goto("/");
  };
</script>

<header class="flex items-center justify-between border-b px-4 py-2">
  <a href="/"><h1 class="pb-1 text-2xl">caesura</h1></a>
  <profile-pill class="aspect-square w-8 rounded-full border pt-1">
  </profile-pill>
  {#if session}
    <nav>
      <a href="/profile">Profile</a>
      <button on:click={logout}>Logout</button>
    </nav>
  {:else}
    <nav>
      <form method="POST" action="/auth?/github">
        <button>GitHub</button>
      </form>
    </nav>
  {/if}
</header>
