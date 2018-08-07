<template>
  <div class="container ledger-import-container">
    <div>
      <a-input class="input" :placeholder="$t('importLedgerWallet.label')" v-model="label"></a-input>
    </div>
    <div class="div-ledger-info">
      <div class="div-ledger-info-tit"><strong>Ledger Info</strong></div>

      <div class="title" style="margin-bottom: 15px;">Login with Ledger</div>
      <button :disabled="ledgerStatus!==''" @click="login">Login</button>
      <p style="color: red;margin-top: 30px;">
        <strong style="color: black">Status: </strong>{{ ledgerStatus }}
      </p>
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
  import {getDeviceInfo, getPublicKey} from '../../../../core/ontLedger'

  export default {
    name: 'BasicInfo',
    created: function () {
      let that = this;
      this.intervalId = setInterval(() => {
        that.getDevice()
      }, this.interval)
      console.log('created.')
    },
    data() {
      return {
        interval: 3000,
        label: '',
        ledgerStatus: ''
      }
    },
    methods: {
      next() {
        let account
        // Get address, Create account.
        // account =

        // this.saveToDb(account)
      },

      getDevice() {
        getDeviceInfo().then(res => {
          console.log('device: ' + res)
          this.device = res;
          this.getPublicKey()
        }).catch(err => {
          console.log(err)
          if (err === 'NOT_FOUND') {
            this.ledgerStatus = 'USB not found.'
          } else if (err === 'NOT_SUPPORT') {
            this.ledgerStatus = 'Ledger not supported.'
          } else {
            this.ledgerStatus = 'Please plugin device to login.'
          }
        })
      },
      getPublicKey() {
        getPublicKey().then(res => {
          console.log('pk info: ' + res);
          this.publicKey = res
          this.ledgerStatus = ''
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
        const that = this;
        const wallet = {
          type: 'CommonWallet',
          address: account.address,
          wallet: account
        }
        dbService.insert(wallet, function (err, newDoc) {
          if (err) {
            console.log(err)
            that.$message.warning('The wallet already exists in local.')
            return;
          }
          // console.log(newDoc)
          that.$store.commit('INIT_JSON_WALLET')
          that.$message.success('Import wallet succeessfully!')
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

