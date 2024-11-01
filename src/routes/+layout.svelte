<script>
  import { goto, invalidate } from "$app/navigation";
  import { onMount } from "svelte";

  export let data;
  $: ({ session, supabase } = data);

  onMount(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_, newSession) => {
        if (newSession?.expires_at !== session?.expires_at) {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();
          if (error) {
            console.error("Error validating user:", error);
            return;
          }
          if (user) {
            invalidate("supabase:auth");
          } else {
            // Redirect to home
            goto("/");
          }
        }
      },
    );
    return () => subscription.subscription.unsubscribe();
  });
</script>

<slot />
