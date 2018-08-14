<template>
  <div class="modal fade" aria-hidden="true" data-backdrop="static" id="loadingModal">
    <div class="modal-dialog" role="document">
      <div class="div-loading">
        <a-spin size="large" tip="Loading...">
          <div class="spin-content"></div>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'loading-modals'
  }
  /**
   * 【 Usage 】
   *
   * Start:
   * this.$store.dispatch('showLoadingModals')
   *
   * Automatic end:
   * Routing changes, automatically hidden.
   *
   * End of the manual:
   * this.$store.dispatch('hideLoadingModals')
   */
</script>

<style scoped>
  .modal-dialog {
    -webkit-transform: translate(0, -50%);
    -ms-transform: translate(0, -50%);
    -o-transform: translate(0, -50%);
    transform: translate(0, -50%);
  }

  .modal-dialog {
    position: absolute;
    width: auto;
    margin: 0 auto;
    left: 0;
    right: 0;
    top: 40%;
  }
</style>
