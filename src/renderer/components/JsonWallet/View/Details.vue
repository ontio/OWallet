<template>
  <div class="common-detail-container">
    <div @click="toWalletHome(wallet)">
      <div class="div-shared-wallet-sign">
        <span>{{ $t('common.normalWallet') }}</span>
      </div>
      <div class="div-wallet-name">{{wallet.label}}</div>
      <!--<img class="img-wallet-edit" src="./../assets/edit.png" alt="">-->
      <div class="div-wallet-address">
        <div>Wallet Address:</div>
        {{wallet.address}}
      </div>
    </div>
    <div v-show="addressCopied" class="copied-label">Copied</div>
    <img class="img-wallet-copy" src="../../../assets/copy.png" @click="copyAddress(wallet)" alt="">
    <a-button type="primary" class="common-export-btn" @click="exportWallet(wallet)">{{$t('common.export')}}</a-button>  
    
  </div>
</template>

<script>
  import {Wallet, Account} from 'ontology-ts-sdk';
  import FileHelper from "../../../../core/fileHelper"
	export default {
    name: "JsonWalletDetails",
    props: ['wallet'],
    data() {
      return {
        addressCopied: false
      }
    },
    methods: {
      toWalletHome(wallet) {
        localStorage.setItem('publicKey', wallet.publicKey);
        localStorage.setItem('address', wallet.address)
        sessionStorage.setItem('currentWallet', JSON.stringify(wallet))
        this.$router.push({name: 'Dashboard'})
      },
      copyAddress(wallet) {
        this.$copyText(wallet.address)
        this.addressCopied = true
        this.$nextTick(function () {
          setInterval(this.addressCopiedDisabled, 3000);
        })
      },
      addressCopiedDisabled() {
        this.addressCopied = false
      },
      exportWallet(commonWallet) {
        console.log(commonWallet)
        let wallet = Wallet.create(commonWallet.label || "")
        console.log(wallet)
        wallet.scrypt.n = 16384;
        const account = Account.parseJsonObj(commonWallet)
        wallet.addAccount(account)
        FileHelper.downloadFile(wallet.toJsonObj());
      }
    }
  }
</script>

<style scoped>
  .common-detail-container {
    position: relative;
  }
  .div-shared-wallet-sign {
    margin-top: 0.88rem;
    font-family: AvenirNext-Medium;
    font-size: 14px;
    color: #196BD8;
  }

  .div-wallet-name {
    margin-top: 1.75rem;
    font-family: AvenirNext-Medium;
    font-size: 18px;
    color: #515457;
    line-height: 24px;
  }

  .img-wallet-edit {
    position: absolute;
    top: 4.13rem;
    right: 1.41rem;
  }

  .div-wallet-address {
    margin-top: 4.25rem;
    font-family: AvenirNext-Regular;
    font-size: 14px;
    color: #B2B2B3;
  }

  .img-wallet-copy {
    position: absolute;
    top: 9rem;
    right: 1.29rem;
  }

  .copied-label {
    position: absolute;
    top: 9rem;
    right: 2.69rem;
    background-color: #8a9098;
    border-radius: 2px;
    padding: 3px 4px;
    font-size: 10px;
    font-weight: 100;
    color: white;
  }
  .common-export-btn {
    height: 34px;
    width:114px;
    background:#5EA2FF;
    font-family: AvenirNext-Medium;
    font-size: 18px;
    color: #FFFFFF;
    border:none;
    border-radius:0;
    position: absolute;
    top:0px;
    right:20px;
  }
</style>
