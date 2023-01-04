<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";

  export let show: boolean;

  const confirmReload = () => {
    localStorage.clear();
    window.location.reload();
  };
</script>

<main>
  {#if show}
    <Modal>
      <span slot="header">An error occured</span>

      <p>Sorry about that. Can we reload the page?</p>

      <button class="button" on:click={confirmReload} style="float: right;">
        Reload
      </button>
    </Modal>
  {/if}
</main>
