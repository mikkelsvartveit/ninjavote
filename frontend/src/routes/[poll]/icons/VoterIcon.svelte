<script lang="ts">
  export let name: string;
  export let stacked = false;
</script>

<div class="voter-icon" class:stacked>
  <span>{name.charAt(0).toUpperCase()}</span>
</div>

<style lang="scss">
  .voter-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border: 2px solid white;
    box-shadow: 0px 0px 5px 0px $shadow-color;
    border-radius: 100%;
    background-color: $accent-color-secondary;

    &.stacked {
      margin-left: -6px;
    }

    span {
      font-size: 14px;
      font-weight: 700;
      color: $text-color-light;
    }
  }
</style>
