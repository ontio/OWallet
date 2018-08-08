<template>
  <div class="container ledger-import-container">
    <div>
      <a-input class="input" :placeholder="$t('importLedgerWallet.label')" v-model="label"></a-input>
    </div>
    <div class="div-ledger-info">
      <div class="div-ledger-info-tit"><strong>{{$t('ledgerWallet.info')}}</strong></div>

      <div class="font-bold" style="margin-bottom: 15px;">{{$t('ledgerWallet.connectApp')}}</div>

      <div class="ledger-status">
          <span class="font-medium-black">{{$t('ledgerWallet.status')}}: </span>
          <span class="font-medium">{{ledgerStatus}} </span>
      </div>

    </div>

    <div class="basic-pk-btns">
      <div class="btn-container">
        <a-button type="default" @click="cancel" class="btn-cancel">{{$t('importJsonWallet.cancel')}}</a-button>
        <a-button type="primary" @click="next" class="btn-next">{{$t('importJsonWallet.next')}}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {Wallet, Account, Crypto} from "ontology-ts-sdk"
  import dbService from '../../../../core/dbService'
  import {WALLET_TYPE}  from '../../../../core/consts'
  import {getDeviceInfo, getPublicKey} from '../../../../core/ontLedger'

  export default {
    name: 'BasicInfo',
    created: function () {
      let that = this;
      this.intervalId = setInterval(() => {
        that.getDevice()
      }, this.interval)
    },
    beforeDestroy(){
      clearInterval(this.intervalId)
    },
    data() {
      return {
        intervalId: '',
        interval: 3000,
        label: '',
        ledgerStatus: ''
      }
    },
    methods: {
      next() {
        if(!this.label) {
          this.$message.error(this.$t('ledgerWallet.labelEmpty'))
          return;
        }
        if(!this.publicKey) {
          this.$message.error(this.$t('ledgerWallet.deviceError'))
          return;
        }
        if(this.publicKey) {
          this.$store.dispatch('createLedgerWalletWithPk', this.publicKey).then(res => {
            if(res) {
              this.saveToDb(res)
            }
          })
        }
      },

      getDevice() {
        getDeviceInfo().then(res => {
          console.log('device: ' + res)
          this.device = res;
          this.getPublicKey()
        }).catch(err => {
          console.log(err)
          if (err === 'NOT_FOUND') {
            this.ledgerStatus = this.$t('ledgerNotOpen')
          } else if (err === 'NOT_SUPPORT') {
            this.ledgerStatus = this.$t('ledgerNotSupported')
          } else {
            this.ledgerStatus = this.$t('common.pluginDevice')
          }
        })
      },
      getPublicKey() {
        getPublicKey().then(res => {
          console.log('pk info: ' + res);
          this.publicKey = res
          this.ledgerStatus = this.$t('common.readyToImport')
        }).catch(err => {
          this.ledgerStatus = err.message
        })
      },
      login() {
        if (!this.device || !this.publicKey) {
          console.log('no device.')
          return;
        }
        this.$store.dispatch('loginWithLedger', this.publicKey).then(res => {
          if (res) {
            console.log(res)
            // this.$router.push({name: 'Dashboard'})
          }
        });
      },

      saveToDb(account) {
        account.label = this.label;
        const that = this;
        const wallet = {
          type: WALLET_TYPE.HardwareWallet,
          address: account.address,
          wallet: account
        }
        dbService.insert(wallet, function (err, newDoc) {
          if (err) {
            console.log(err)
            that.$message.warning(that.$t('common.existLocal'))
            return;
          }
          that.$message.success(that.$t('common.importLedgerSuccess'))
          that.$router.push({name: 'Wallets'})
        })
      },
      cancel() {
        this.$router.push({name: 'Wallets'})
      }
    }
  }
</script>

<style>
  .ledger-import-container {
    width: 36rem;
  }

  .div-ledger-info {
    border: 1px solid #DFE2E9;
    margin-top: 15px;
    padding: 10px;
  }

  .div-ledger-info-tit {
    border-bottom: 1px solid #DFE2E9;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .basic-pk-btns {
    position: fixed;
    bottom: 0;
    width: calc(100% - 4rem);
    height: 85px;
    left: 4rem;
    background: #FFFFFF;
    box-shadow: 0 -1px 6px 0 #F2F2F2;
    z-index: 1000;
  }

  .btn-container {
    width: 540px;
    margin: 20px auto;
  }

  .basic-pk-btns button:first-child {
    float: left;
  }

  .basic-pk-btns :nth-child(2) {
    float: right;
  }

  .basic-pk-btns :nth-child(3) {
    float: right;
    margin-right: 20px;
  }

  .error-input {
    border-color: red;
  }
</style>

