<script lang="ts">
  export let name: string;
</script>

<main>
  <div class="voter-icon">
    <span>{name.charAt(0).toUpperCase()}</span>
  </div>
</main>

<style lang="scss">
  .voter-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border: 2px solid white;
    box-shadow: 0px 0px 5px 0px #888;
    border-radius: 100%;
    background-color: #769289;
    margin-left: -5px;

    span {
      font-size: 14px;
      font-weight: 700;
      color: white;
    }
  }
</style>
