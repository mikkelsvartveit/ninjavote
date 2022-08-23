<script lang="ts">
  import { Dialog, Modal } from "attractions";
  import type { IOption } from "src/types/poll";
  import VoterIcon from "../icons/VoterIcon.svelte";

  export let option: IOption | null;
  export let onClose: () => void;
</script>

<main>
  {#if option !== null}
    <Modal open={option !== null} let:closeCallback>
      <Dialog title={`Voters for "${option.text}"`} closeCallback={onClose}>
        {#each option.votes as vote}
          <div class="vote">
            <VoterIcon name={vote.name} />
            <p>{vote.name}</p>
          </div>
        {/each}
      </Dialog>
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
