<template>
  <div>
    <breadcrumb :current="$t('importLedgerWallet.import')" v-on:backEvent="back"></breadcrumb>
    <div class="shared-container">
      <div class="steps-content">
        <basic-info></basic-info>
      </div>
    </div>
  </div>

</template>

<script>
  import en from '../../lang/en'
  import zh from '../../lang/zh'
  import BasicInfo from './Import/BasicInfo'
  import Breadcrumb from '../Breadcrumb'
  import {mapState} from 'vuex';

  export default {
    name: 'ImportLedgerWallet',
    data() {
      const langType = localStorage.getItem('user_lang') || 'en';
      const lang = langType === 'en' ? en : zh;
      return {
        lang: lang,
        steps: [{
          title: lang.importJsonWallet.basicInfo,
          content: 'First-content',
        }]
      }
    },
    components: {
      BasicInfo,
      Breadcrumb
    },
    methods: {
      back() {
        this.$router.push({name: 'Wallets'})
      }
    }
  }
</script>
