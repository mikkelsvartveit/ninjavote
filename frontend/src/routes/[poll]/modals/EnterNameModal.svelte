<script lang="ts">
  import type { IVote, IOption } from "$lib/types/poll";
  import { poll } from "$lib/store/pollStore";
  import { session } from "$lib/store/sessionStore";
  import Modal from "$lib/components/Modal.svelte";

  let nickname = "";
  let nameAlreadyInUseError = false;
  let nameEmptyError = false;

  const createSession = () => {
    // Verify that the name is not empty
    if (nickname.trim() === "") {
      nameEmptyError = true;
      return;
    }

    const voterId = Math.random().toString(36).substring(2, 15);
    const voterSecret = Math.random().toString(36).substring(2, 15);

    // Check if someone with the same nickname has already voted in this poll
    if (
      $poll !== null &&
      $poll.options
        .reduce(
          (acc: IVote[], cur: IOption): IVote[] => [...acc, ...cur.votes],
          []
        )
        .some(
          (vote: IVote) =>
            vote.name.toLowerCase() === nickname.trim().toLowerCase() &&
            vote.voterId !== voterId
        )
    ) {
      nameAlreadyInUseError = true;
      return;
    }

    $session = { nickname: nickname.trim(), voterId, voterSecret };
    localStorage.setItem(String($poll?.id), JSON.stringify($session));
  };
</script>

<main>
  {#if $session === null}
    <Modal>
      <span slot="header">Enter name</span>
      <form on:submit|preventDefault={createSession}>
        <p>You need a nickname to vote in this poll.</p>
        <input
          type="text"
          class="text-field"
          bind:value={nickname}
          placeholder="Name"
        />

        {#if nameEmptyError}
          <p class="error">Please enter a name!</p>
        {/if}

        {#if nameAlreadyInUseError}
          <p class="error">
            This name is taken. You may already have voted in this poll in
            another browser. If not, choose another nickname.
          </p>
        {/if}

        <button class="button" style="float: right;"> Join </button>
      </form>
    </Modal>
  {/if}
</main>

<style lang="scss">
  p.error {
    color: #b51f1f;
  }
</style>
