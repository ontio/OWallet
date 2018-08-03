<template>
  <div class="container json-confirm-container">
    <p><b>{{$t('createJsonWallet.labelN')}}: </b> {{label}}</p>
    <p><b>{{$t('createJsonWallet.addressN')}}: </b> {{ address }}</p>
    <p><b>{{$t('createJsonWallet.pubKeyN')}}: </b> {{publicKey}}</p>
    <p><b>{{$t('createJsonWallet.signatureSchemeN')}}: </b> SHA256withECDSA </p>

    <div class="confirm-btns">
      <div class="confirm-btn-container">
        <a-button type="default" class="btn-cancel" @click="back">{{ $t('createJsonWallet.back') }}</a-button>
        <a-button type="primary" class="btn-next" @click="next">{{ $t('createJsonWallet.next') }}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {Crypto} from 'ontology-ts-sdk'
  import FileHelper from "../../../../core/fileHelper"
  import dbService from '../../../../core/dbService'
  import en from '../../../../common/lang/en'
  import zh from '../../../../common/lang/zh'

  export default {
    name: 'ConfirmInfo',
    data() {
      const langType = localStorage.getItem('user_lang') || 'en';
      const lang = langType === 'en' ? en : zh;
      return {
        lang: lang,
        processing: false
      }
    },
    computed: {
      ...mapState({
        label: state => state.CreateJsonWallet.label,
        account: state => state.CreateJsonWallet.account,
        downloadContent: state => state.CreateJsonWallet.downloadContent,
        address: state => state.CreateJsonWallet.address,
        publicKey: state => state.CreateJsonWallet.publicKey
      })
    },
    methods: {
      back() {
        this.$store.commit('SUB_CREATE_JSON_STEP')
      },
      next() {
        //Download file
        // FileHelper.downloadFile(this.downloadContent)

        //save to db
        dbService.wallet.insert(this.account, function (err, newDoc) {
          if (err) {
            console.log(err)
          }
          // console.log(newDoc)
        })

        localStorage.setItem('publicKey', this.publicKey);
        localStorage.setItem('address', this.address)

        this.$store.commit('INIT_JSON_WALLET')
        this.$message.success('Create common wallet successfully!')
        this.$router.push({name: 'Wallets'})
      }
    }
  }
</script>

<style scoped>
  .json-confirm-container {
    width: 36rem;
  }

  .confirm-btns {
    position: fixed;
    bottom: 0;
    width: calc(100% - 4rem);
    height: 85px;
    left: 4rem;
    background: #FFFFFF;
    box-shadow: 0 -1px 6px 0 #F2F2F2;
    z-index: 1000;
  }

  .confirm-btn-container {
    width: 540px;
    margin: 20px auto;
  }

  .confirm-btn-container :last-child {
    float: right;
  }
</style>
