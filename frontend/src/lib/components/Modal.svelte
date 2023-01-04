<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import closeIcon from "$lib/icons/close.svg";

  export let allowClose = false;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  const requestClose = () => {
    if (allowClose) {
      close();
    }
  };
</script>

<div class="modal-container">
  <button class="modal-background" on:click={requestClose} />

  <div class="modal">
    <div class="header">
      <h2 class="header-text">
        <slot name="header" />
      </h2>

      {#if allowClose}
        <button class="close-button" on:click={requestClose}>
          <img alt="close" src={closeIcon} />
        </button>
      {/if}
    </div>

    <slot />
  </div>
</div>

<style lang="scss">
  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    z-index: 100;
    justify-content: center;
    align-items: center;
  }

  .modal-background {
    position: absolute;
    border: none;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal {
    background-color: white;
    border-radius: 6px;
    width: 400px;
    max-width: 100%;
    padding: 20px;
    margin: 0 20px;
    box-sizing: border-box;
    z-index: 101;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;

    .header-text {
      margin: 0;
    }
  }

  .close-button {
    background: none;
    position: relative;
    padding: 6px;
    margin: -6px -6px 0 15px;
    border: none;
    transition-duration: 0.1s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 100px;
    }

    img {
      display: block;
      width: 28px;
      height: 28px;
      /* https://codepen.io/sosuke/pen/Pjoqqp */
      filter: invert(63%) sepia(0%) saturate(690%) hue-rotate(136deg)
        brightness(86%) contrast(83%);
    }
  }
</style>
