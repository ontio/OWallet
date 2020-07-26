<template>
  <div>
    <breadcrumb :current="$t('sharedWalletHome.send')" :routes="routes"
                v-on:backEvent="backToWallets"></breadcrumb>

    <div class="send-container">
      <div class="steps">
        <a-steps :current="current">
          <a-step/>
          <a-step/>
        </a-steps>
      </div>

      <send-asset
        v-on:cancelEvent="handleCancel"
        v-on:sendAssetNext="handleSendAssetNext"
        v-if="current ===0">
      </send-asset>

      <send-confirm
        v-on:backEvent="handleConfirmBack"
        v-on:sendConfirmSubmit="handleSubmit"
        v-if="current === 1">
      </send-confirm>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '../Breadcrumb'
  import SendAsset from '../SharedWallet/Transfer/SendAsset'
  import SendConfirm from '../CommonWallet/SendConfirm'

  export default {
    name: 'CommonSendHome',
    components: {
      Breadcrumb,
      SendAsset,
      SendConfirm
    },
    data() {
      const currentWallet = JSON.parse(sessionStorage.getItem('currentWallet'))
      return {
        walletName: currentWallet.label,
        routes: [{name: currentWallet.label, path: '/dashboard'}],
        current: 0
      }
    },
    methods: {
      backToWallets() {
        this.$router.push({name: 'Wallets'})
      },
      handleCancel() {
        this.$router.go(-1);
      },
      handleSendAssetNext() {
        this.current = 1;
      },
      handleConfirmBack() {
        this.current = 0;
      },
      handleSubmit() {
        this.$router.go(-1);
      }

    }
  }
</script>

<style scoped>
  .send-container {
    width: 600px;
    margin: 0 auto;
    padding-bottom: 5.3rem;
  }

  .steps {
    height: 68px;
    padding: 0 4rem;
  }
</style>
