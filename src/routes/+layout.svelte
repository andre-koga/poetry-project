<script>
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import "../style.css";
  import Header from "$layout/Header.svelte";
  import Footer from "$layout/Footer.svelte";

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
</script>

<Header {session} {supabase} />
<slot />
<Footer />
