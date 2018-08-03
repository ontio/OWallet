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
  import LangStorage from './../../core/lang'

  const {dialog} = require('electron').remote;

  export default {
    name: 'Setting',
    data() {
      return {
        net: localStorage.getItem('net') || 'TEST_NET',
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
        setTimeout(() => {
          const net = this.net === 'TEST_NET' ? 'TestNet' : 'MainNet';
          this.$message.success('The network has been set to ' + net);
        }, 100)
      },
      changeLanguage() {
        this.$i18n.locale = this.lang
        LangStorage.setLang(this.$i18n.locale)
      },
      setSavePath() {
        dialog.showOpenDialog({properties: ['openDirectory','createDirectory']}, (filePath) => {
          if (filePath === undefined) {
            alert('You did not set the path')
            return;
          }
          localStorage.setItem('savePath', filePath[0])
          localStorage.setItem('isSavePath', 'true')
          this.savePath = filePath[0]
          window.location.reload()
          setTimeout(function(){
            this.$message.success('Change keystore file path successfully!')
          },100)
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
