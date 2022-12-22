<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";
  import type { IOption } from "$lib/types/poll";
  import VoterIcon from "../icons/VoterIcon.svelte";

  export let option: IOption;
  export let show: boolean;
  export let onClose: () => void;
</script>

<main>
  {#if show}
    <Modal on:close={onClose} allowClose>
      <span slot="header">Voters for "{option.text}"</span>
      {#each option.votes as vote (vote.id)}
        <div class="vote">
          <VoterIcon name={vote.name} />
          <p>{vote.name}</p>
        </div>
      {/each}
    </Modal>
  {/if}
</main>

<style lang="scss">
  .vote {
    display: flex;
    align-items: center;

    p {
      margin: 10px 7px;
    }
  }
</style>
