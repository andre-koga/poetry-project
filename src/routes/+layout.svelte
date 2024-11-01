<script>
  import { goto, invalidate } from "$app/navigation";
  import { onMount } from "svelte";

  export let data;
  $: ({ session, supabase } = data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => data.subscription.unsubscribe();
  });

  $: logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during logout:", error);
    }
    goto("/");
  };
</script>

<header>
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

<slot />
