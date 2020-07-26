<style scoped>
.shared-container {
}
  .steps-content {
  }

  .steps-action {
    margin-top: 24px;
  }

  .create-steps {
    width:520px;
    height:4rem;
    margin:2px auto;
  }

</style>
<template>
  <div>
    <breadcrumb :current="$t('createSharedWallet.create')" v-on:backEvent="back"></breadcrumb>
    <div class="shared-container">
      <a-steps :current="current" class="create-steps">
        <a-step v-for="item in steps" :key="item.title" />
      </a-steps>
      <div class="steps-content">
          <basic-info v-if="current === 0"></basic-info>
          <confirm-sig-num v-if="current === 1"></confirm-sig-num>
      </div>
    </div>
  </div>

</template>
<script>
import en from '../../lang/en'
import zh from '../../lang/zh'
import BasicInfo from './Create/BasicInfo'
import ConfirmSigNum from './Create/ConfirmSigNum'
import CreateSuccess from './Create/CreateSuccess'
import Breadcrumb from '../Breadcrumb'
import { mapState } from 'vuex';

  export default {
    name: 'CreateSharedWallet',
    data() {
        const langType = localStorage.getItem('user_lang') || 'en';
        const lang = langType === 'en' ? en : zh;
      return {
        lang: lang,
        steps: [{
          title: lang.createSharedWallet.basicInfo,
          content: 'First-content',
        }, {
          title: lang.createSharedWallet.copayers,
          content: 'Second-content',
        }]
      }
    },
    computed : {
        ...mapState({
            current: state => state.CreateSharedWallet.currentStep,
        })
    },
    components: {
        BasicInfo,
        ConfirmSigNum,
        Breadcrumb
    },
    methods: {
      back(){
        this.$router.push({name:'Wallets'})
      }
    }
  }
</script>

