<template>
<div>
  <transition name="fade">
    <!-- transition seems not working -->
  <div v-if="showLoading">
        <a-spin size="large" tip="Loading..." class="modal-dialog">
          <div class="spin-content"></div>
        </a-spin>
        <div class="modal-backdrop"></div>
      
    </div>
  </transition>
  </div>
  <!-- <div class="modal fade" aria-hidden="true" data-backdrop="static" id="loadingModal" v-if="showLoading">
    <div class="modal-dialog" role="document">
      <div class="div-loading">
        <a-spin size="large" tip="Loading...">
          <div class="spin-content"></div>
        </a-spin>
      </div>
    </div>
  </div> -->
</template>

<script>
import {mapState} from 'vuex'
  export default {
    name: "loading-modals",
    computed: {
      ...mapState({
        showLoading: state => state.LoadingModal.showLoading
      })
    }
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
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    opacity: 1;
}
.fade-enter, .fade-leave-to /* .fade-leave-active, 2.1.8 版本以下 */ {
    opacity: 0
}
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
    z-index: 1050;
  }
  .modal-backdrop {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1040;
      background-color: #000;
      opacity: .5;
  }
</style>
