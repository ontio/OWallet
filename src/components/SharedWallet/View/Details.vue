<template>
  <div>
    <div @click="toSharedWalletHome(wallet)">
      <div class="div-shared-wallet-sign">{{ $t('common.sharedWallet') }}</div>
      <div class="div-wallet-name" >{{wallet.sharedWalletName}}</div>
      <!--<img class="img-wallet-edit" src="./../assets/edit.png" alt="">-->
      <div class="div-wallet-address">
        <div>Wallet Address:</div>
        {{wallet.sharedWalletAddress}}
      </div>
    </div>
    <div v-show="addressCopied" class="copied-label">Copied</div>
    <img class="img-wallet-copy" src="../../../assets/copy.png" @click="copyAddress(wallet)" alt="">
    <div class="common-topRight-btns">
      <span class="common-delete-icon" @click="deleteWallet()" ></span>
    </div>

    <a-modal
        :title="$t('common.confirmation')"
        :visible="showModal"
        @ok="handleDelete"
        @cancel="handleCancel">
          <div>
              <p class="font-medium">
                {{$t('wallets.deleteingWallet') }}
                 {{wallet.sharedWalletAddress}}</p>
          </div>
    </a-modal>
  </div>
</template>

<script>
import dbService from '../../../core/dbService'
	export default {
		name: "SharedWalletDetails",
    props: ['wallet'],
    data() {
      return {
        addressCopied: false,
        showModal : false
      }
    },
    methods: {
      toSharedWalletHome(wallet) {
        sessionStorage.setItem('sharedWallet', JSON.stringify(wallet))
        this.$router.push({path: '/sharedWallet/home'})
      },
      copyAddress(wallet) {
        this.$copyText(wallet.sharedWalletAddress)
        this.addressCopied = true
        this.$nextTick(function () {
          setInterval(this.addressCopiedDisabled, 3000);
        })
      },
      addressCopiedDisabled() {
        this.addressCopied = false
      },
      deleteWallet() {
        this.showModal = true;
      },
      handleDelete() {
        // remove from db
        this.$store.dispatch('showLoadingModals')
        const that = this;
        dbService.remove({type:'SharedWallet', address: this.wallet.sharedWalletAddress}, {}, function(err, numRemoved) {
          if(err) {
            that.$store.dispatch('hideLoadingModals')
            that.$message.error(that.$t('wallets.deleteFailed'));
            return;
          }
           // remove from store
          that.$store.commit('DELETE_SHARED_WALLET', {address: that.wallet.sharedWalletAddress})
          that.$store.dispatch('hideLoadingModals')
          that.$message.success(that.$t('wallets.deleteSucceess'))
          that.showModal = false;
        })
      },
      handleCancel() {
        this.showModal = false;
      }
    }
	}
</script>

<style scoped>
  .div-shared-wallet-sign {
    margin-top: 0.88rem;
    font-family: AvenirNext-Medium;
    font-size: 14px;
    color: #196BD8;
    cursor: default;
  }

  .div-wallet-name {
    margin-top: 1.75rem;
    font-family: AvenirNext-Medium;
    font-size: 18px;
    color: #515457;
    line-height: 24px;
    word-wrap: break-word;
    height:6rem;
    cursor: pointer;
  }

  .img-wallet-edit {
    position: absolute;
    top: 4.13rem;
    right: 1.41rem;
  }

  .div-wallet-address {
    font-family: AvenirNext-Regular;
    font-size: 14px;
    color: #B2B2B3;
    position:absolute;
    bottom:10px;
    cursor: default;
  }

  .img-wallet-copy {
    position: absolute;
    bottom:15px;
    right: 1.29rem;
  }

  .copied-label {
    position: absolute;
    top: 9.56rem;
    right: 2.69rem;
    background-color: #8a9098;
    border-radius: 2px;
    padding: 3px 4px;
    font-size: 10px;
    font-weight: 100;
    color: white;
  }
  .common-topRight-btns {
    position: absolute;
    top: 10px;
    right: 1.29rem;
  }
  .common-delete-icon {
    width:24px;
    height: 24px;
    display: inline-block;
    cursor: pointer;
    background:url('../../../assets/delete.png') center center;
    background-repeat:no-repeat;
  }

</style>
