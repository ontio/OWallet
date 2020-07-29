<template>
  <div class="container json-confirm-container">
    <p><b>{{$t('createIdentity.label')}}: </b> {{label}}</p>
    <p><b>{{$t('createIdentity.ontid')}}: </b> {{ ontid }}</p>


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
  import {Crypto, Wallet, Account} from 'ontology-ts-sdk'
  import FileHelper from "../../../core/fileHelper"
  import dbService from '../../../core/dbService'
  import {WALLET_TYPE,DEFAULT_SCRYPT} from '../../../core/consts'
  import en from '../../../lang/en'
  import zh from '../../../lang/zh'

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
        label: state => state.CreateIdentity.label,
        ontid: state => state.CreateIdentity.ontid,
        identity: state => state.CreateIdentity.identity,
        tx: state => state.CreateIdentity.tx
      })
    },
    beforeDestroy() {
      console.log('clear')
      this.$store.commit('INIT_CREATE_IDENTITY')
    },
    methods: {
      back() {
        this.$store.commit('SUB_CREATE_IDENTITY_STEP')
      },
      downloadWallet() {
        const commonWallet = this.account
        let wallet = Wallet.create(commonWallet.label || "")
        console.log(wallet)
        wallet.scrypt.n = 16384;
        const account = Account.parseJsonObj(commonWallet)
        wallet.addAccount(account)
        FileHelper.downloadFile(wallet.toJsonObj(), commonWallet.label);
      },
      next() {
        this.$store.dispatch('showLoadingModals')
        //Download file
        // FileHelper.downloadFile(this.downloadContent)

        //save to db
        const wallet = {
          type : 'Identity',
          address: this.ontid,
          wallet: this.identity
        }
        dbService.insert(wallet, (err, newDoc) => {
          if (err) {
            console.log(err)
            this.$store.dispatch('hideLoadingModals')
            this.$message.error(this.$t('common.savedbFailed'))
          }
          // console.log(newDoc)
        })

        this.$store.commit('INIT_CREATE_IDENTITY')
        this.$message.success(this.$t('createIdentity.createSuccess'))
        this.$router.push({name: 'Identitys'})
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
  .backup-text {
    text-align: center;
    padding: 20px;
    border: 1px solid #dddddd;
    font-size: 16px;
  }
  .backup-text p {
    margin:0;
    font-size:16px !important;
  }

</style>
