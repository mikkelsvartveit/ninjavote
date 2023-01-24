<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  const generateId = () => {
    // Generate alphanumeric id of length 8
    return Math.random().toString(36).substring(2, 10);
  };

  onMount(() => {
    // Redirect to a new poll
    goto(`/${generateId()}`, { replaceState: true });
  });
</script>
