<template>
  <div class="modal modal_wapper fade" id="setPathModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-title text-center">{{ $t('SetPaths.name') }}</div>
        <div class="modal-header"></div>

        <div class="modal-body">{{ $t('SetPaths.tips') }}</div>

        <div class="modal-footer text-center">
          <!--<button class="btn btn-skip" data-dismiss="modal" aria-label="Close">{{ $t('SetPaths.close') }}</button>-->
          <button class="btn btn-save-path" @click="setSavePath">{{ $t('SetPaths.enter') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {mapState} from 'vuex'
  import { validateKeystorePath } from '../../../core/utils'

  const {dialog} = require('electron').remote;

  export default {
    name: "set-path-modal",
    data() {
      return {}
    },
    methods: {
      setSavePath() {
        dialog.showOpenDialog({properties: ['openDirectory', 'createDirectory']}, (filePath) => {
          if (filePath === undefined) {
            alert('You did not set the path')
            return;
          }
          if (filePath === undefined) {
            // alert('You did not set the path')
            this.$message.warning(this.$t('setting.notSetPath'))
            return;
          }
          if (!validateKeystorePath(filePath[0])) {
            this.$message.warning(this.$t('setting.notInstallationPath'))
            return;
          }
          localStorage.setItem('savePath', filePath)
          localStorage.setItem('isSavePath', 'true')
          window.location.reload();//reset dbService
          $("#setPathModal").modal("hide")
        })
      }
    }
  }
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
    top: 30%;
  }

  .modal-dialog {
    width: 25rem;
    /* height: 15rem; */
    border-radius: 0;
  }

  .modal-title {
    margin-top: 30px;
    font-family: AvenirNext-Bold;
    font-size: 14px;
    color: #000000;
    text-align: center;
  }

  .modal-header {
    border-bottom: 0 !important;
  }

  .modal-content {
    width: 25rem;
    height: 18rem;
    border-radius: 0;
  }

  .modal-footer {
    border-top: 0 !important;
    display: block !important;
  }

  .modal-footer button {
    width: 6.25rem;
    height: 2.13rem;
    border-radius: 0;
    border: 0;
    font-family: AvenirNext-Medium;
    font-size: 14px;
  }

  .btn-skip {
    color: #5E6369;
    background: #F5F7FB;
  }

  .btn-save-path {
    color: #FFFFFF;
    background: #196BD8;
  }
</style>
