<script lang="ts">
  import { Dialog, Modal } from "attractions";
  import type { IOption } from "src/types/poll";
  import VoterIcon from "../icons/VoterIcon.svelte";

  export let option: IOption;
  export let show: boolean;
  export let onClose: () => void;
</script>

<main>
  <Modal open={show} on:change={(event) => !event.detail.value && onClose()}>
    <Dialog title={`Voters for "${option.text}"`} closeCallback={onClose}>
      {#each option.votes as vote (vote.id)}
        <div class="vote">
          <VoterIcon name={vote.name} />
          <p>{vote.name}</p>
        </div>
      {/each}
    </Dialog>
  </Modal>
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
