<template>
  <div class="common-detail-container">
    <div >
      <div class="div-shared-wallet-sign">
        <span>{{ $t('identitys.identity')}}</span>
      </div>
      <div class="div-wallet-name">{{identity.label}}</div>
      <!--<img class="img-wallet-edit" src="./../assets/edit.png" alt="">-->
      <div class="div-wallet-address">
        <div>{{$t('identitys.ontid')}} :</div>
        {{identity.ontid}}
      </div>
    </div>
    <div v-show="addressCopied" class="copied-label">Copied</div>
    <img class="img-wallet-copy" src="../../assets/copy.png" @click="copyAddress(identity)" alt="">

  </div>
</template>

<script>
  import {Wallet, Account} from 'ontology-ts-sdk';
	export default {
    name: "IdentityView",
    props: ['identity'],
    data() {
      return {
        addressCopied: false,
      }
    },
    methods: {
      copyAddress(identity) {
        this.$copyText(identity.ontid)
        this.addressCopied = true
        this.$nextTick(function () {
          setInterval(this.addressCopiedDisabled, 3000);
        })
      },
      addressCopiedDisabled() {
        this.addressCopied = false
      },
      
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
    width:78px;
    background:#5EA2FF;
    font-family: AvenirNext-Regular;
    font-size: 16px;
    color: #FFFFFF;
    border: 1px solid #FFFFFF;
    border-radius: 0;
    position: absolute;
    top: 0px;
    right: 20px;
  }
</style>
