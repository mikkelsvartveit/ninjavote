<script lang="ts">
  import { Dialog, Modal, TextField, Button } from "attractions";
  import type { IVote, IOption } from "src/types/poll";
  import { poll } from "$/store/pollStore";
  import { session } from "$/store/sessionStore";

  let nickname = "";
  let nameAlreadyInUse = false;

  const createSession = () => {
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
      nameAlreadyInUse = true;
      return;
    }

    $session = { nickname: nickname.trim(), voterId, voterSecret };
    localStorage.setItem(String($poll?.id), JSON.stringify(session));
  };
</script>

<main>
  <Modal open={$session === null} noClickaway>
    <Dialog constrainWidth title="Enter name">
      <p>You need a nickname to vote in this poll.</p>
      <TextField outline bind:value={nickname} placeholder="Name" />
      {#if nameAlreadyInUse}
        <p class="error">
          This name is taken. You may already have voted in this poll in another
          browser. If not, choose another nickname.
        </p>
      {/if}
      <Button on:click={createSession} style="float: right;">Join</Button>
    </Dialog>
  </Modal>
</main>

<style lang="scss">
  p.error {
    color: #b51f1f;
  }
</style>
