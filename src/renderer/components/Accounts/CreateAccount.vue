<template>
  <div>
    <breadcrumb :current="$t('createAccount.create')" v-on:backEvent="back"></breadcrumb>
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
  import BasicInfo from './Create/BasicInfo'
  import ConfirmInfo from './Create/ConfirmInfo'
  import Breadcrumb from '../Breadcrumb'
  import {mapState} from 'vuex';

  export default {
    name: 'CreateAccount',
    data() {
      return {
        steps: [{
          title: this.$t('createAccount.basicInfo'),
          content: 'First-content',
        }, {
          title: this.$t('createAccount.confirmInfo'),
          content: 'Second-content',
        }]
      }
    },
    computed: {
      ...mapState({
        current: state => state.CreateAccount.currentStep,
      })
    },
    components: {
      BasicInfo,
      ConfirmInfo,
      Breadcrumb
    },
    methods: {
      back() {
        this.$router.push({name: 'Accounts'})
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
