<template>
  <div class="setting-container">
    <breadcrumb :current="$t('setting.name')" v-on:backEvent="handleBack"></breadcrumb>

    <div class="form-container">
      <form>
        <div class="form-group">
          <label for="network-selection">{{ $t('setting.net') }}</label>
          <select name="network-selection" id="network-selection" class="form-control" v-model="net"
                  @change="changeNet">
            <option value="TEST_NET">{{ $t('setting.testNet') }}</option>
            <option value="MAIN_NET">{{ $t('setting.mainNet') }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="network-selection">{{ $t('setting.nodeAddress') }}</label>
          <select name="network-selection" id="network-selection" class="form-control" v-model="nodeAddress"
                  @change="changeNode">
            <option v-for="item of nodeList" :key="item"  :value="item" >{{item}}</option>
          </select>
        </div>

        <div class="form-group form-group-top">
          <label for="lang-selection">{{ $t('setting.lang') }}</label>
          <select name="lang-selection" id="lang-selection" class="form-control" v-model="lang"
                  @change="changeLanguage">
            <option value="en">{{ $t('setting.en') }}</option>
            <option value="zh">{{ $t('setting.zh') }}</option>
          </select>
        </div>

        <div class="form-group form-group-top">
          <label>{{ $t('setting.path') }}</label>
          <p>
            <span class="span-path-title">{{ $t('setting.pathTit') }}</span>{{savePath}}
          </p>
          <div>
            <a-button type="primary" class="btn-next" @click="setSavePath">{{ $t('setting.change') }}</a-button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from './Breadcrumb'
  import LangStorage from './../core/lang'
  import { TEST_NET_LIST, MAIN_NET_LIST, TEST_NET} from '../core/consts'
  import { validateKeystorePath, validateAddress } from '../core/utils'
  const {dialog} = require('electron').remote;


  export default {
    name: 'Setting',
    data() {
      return {
        net: localStorage.getItem('net') || 'MAIN_NET',
        nodeAddress: localStorage.getItem('nodeAddress') || MAIN_NET_LIST[0],
        nodeList: localStorage.getItem('net') === 'TEST_NET' ? TEST_NET_LIST : MAIN_NET_LIST,
        lang: this.$i18n.locale,
        savePath: localStorage.getItem('savePath')
      }
    },
    methods: {
      handleBack() {
        this.$router.push({name: 'Wallets'})
      },
      changeNet() {
        localStorage.setItem('net', this.net);
        this.$store.commit('UPDATE_SETTING_NETWORK', {network: this.net})
        if(this.net === 'TEST_NET') {
          this.nodeList = TEST_NET_LIST;
          this.nodeAddress = TEST_NET_LIST[0]
          localStorage.setItem('nodeAddress', this.nodeAddress)
        } else {
          this.nodeList = MAIN_NET_LIST;
          this.nodeAddress = MAIN_NET_LIST[0]
          localStorage.setItem('nodeAddress', this.nodeAddress)
        }
        setTimeout(() => {
          const net = this.net === 'TEST_NET' ? this.$t('common.testNet') : this.$t('common.mainNet');
          this.$message.success(this.$t('setting.setNetworkSuccess') + net);
        }, 100)
      },
      changeNode() {
        localStorage.setItem('nodeAddress', this.nodeAddress)
        setTimeout(() => {
          this.$message.success(this.$t('setting.setNodeSuccess') + this.nodeAddress);
        }, 100)
      },
      changeLanguage() {
        this.$i18n.locale = this.lang
        LangStorage.setLang(this.$i18n.locale)
      },
      setSavePath() {
        dialog.showOpenDialog({properties: ['openDirectory','createDirectory']}).then(({filePaths}) => {
          if (filePaths === undefined) {
            // alert('You did not set the path')
            this.$message.warning(this.$t('setting.notSetPath'))
            return;
          }
          if (!validateKeystorePath(filePaths[0])) {
            this.$message.warning(this.$t('setting.notInstallationPath'))
            return;
          }
          localStorage.setItem('savePath', filePaths[0])
          localStorage.setItem('isSavePath', 'true')
          window.location.reload();
          this.savePath = filePaths[0]
        })
      }
    },
    components: {
      Breadcrumb
    }
  }
</script>

<style>
  .setting-container {
    padding: 0 20px;
    height: 100%;
  }

  .form-container {
    padding: 0 20px;
    width: 800px;
  }

  .form-container label {
    color: #000000;
    font-size: 16px;
    font-family: AvenirNext-Bold;
  }

  .form-container select {
    border-radius: 0;
  }

  .form-group-top {
    margin-top: 45px;
  }

  .span-path-title {
    color: #000000;
    font-size: 16px;
    font-family: AvenirNext;
  }
</style>
