<template>
  <div>
    <breadcrumb :current="$t('createJsonWallet.create')" v-on:backEvent="back"></breadcrumb>
    <div class="shared-container">
      <a-steps :current="current" class="create-steps">
        <a-step v-for="item in steps" :key="item.title"/>
      </a-steps>
      <div class="steps-content">
        <basic-info v-if="current === 0"></basic-info>
        <confirm-info v-if="current === 1"></confirm-info>
      </div>
    </div>
  </div>

</template>

<script>
  import en from '../../../common/lang/en'
  import zh from '../../../common/lang/zh'
  import BasicInfo from './Create/BasicInfo'
  import ConfirmInfo from './Create/ConfirmInfo'
  import Breadcrumb from '../Breadcrumb'
  import {mapState} from 'vuex';

  export default {
    name: 'CreateJsonWallet',
    data() {
      const langType = localStorage.getItem('user_lang') || 'en';
      const lang = langType === 'en' ? en : zh;
      return {
        lang: lang,
        steps: [{
          title: lang.createJsonWallet.basicInfo,
          content: 'First-content',
        }, {
          title: lang.createJsonWallet.confirmInfo,
          content: 'Second-content',
        }]
      }
    },
    computed: {
      ...mapState({
        current: state => state.CreateJsonWallet.currentStep,
      })
    },
    components: {
      BasicInfo,
      ConfirmInfo,
      Breadcrumb
    },
    methods: {
      back() {
        this.$router.push({name: 'Wallets'})
      }
    }
  }
</script>

<style scoped>
  .shared-container {
  }

  .steps-content {
  }

  .steps-action {
    margin-top: 24px;
  }

  .create-steps {
    width: 520px;
    height: 4rem;
    margin: 2px auto;
  }
</style>
