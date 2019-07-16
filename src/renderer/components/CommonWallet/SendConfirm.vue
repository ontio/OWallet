<style scoped>
  .confirm-container {

  }

  .drag-item {
    cursor: pointer;
  }

  .label-container {
    position: relative;
  }

  .label {
    font-weight: bold;
    font-family: 'AvenirNext-Bold';
    color: #5E6369;
    font-size: 1.25rem;
    margin: 0;
  }

  .asset-table {
    padding: 5px 50px;
  }

  .asset-item {
    border-bottom: 1px solid #dddddd;
    padding: 10px 20px;
  }

  .asset-item span {
    width: 30%;
    display: inline-block;
    text-align: left;
  }

  .asset-item :nth-child(2) {
    width: 69%;
    display: inline-block;
    text-align: right
  }

  .select-sponsor {
    margin-left: 20px;
    width: 80%;
    margin-bottom: 15px;
  }

  .circle {
    display: inline-block;
    text-align: center;
    border: 1px solid #dddddd;
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    background: #FBE45A;
  }

  .confirm-btns {
    position: fixed;
    bottom: 0;
    left: 4rem;
    height: 5.3rem;
    width: calc(100% - 4rem);
    /* z-index: 1000; */
    box-shadow: 0 -1px 6px 0 #F2F2F2;
    background: #ffffff;
  }

  .fee {
    padding-left: 20px;
    padding-top: 10px;
    margin-bottom: 50px;
  }

  .sponsor-select {
    padding-left: 4rem;
  }

  .sponsor-label {
    margin-bottom: 20px;
  }

  .sponsor-label :last-child {
    float: right;
  }

  .drag-container {
    margin-top: 20px;
    padding-left: 4rem;
  }

  .payer-item {
    height: 30px;
  }

  .payer-item:hover {
    background: #F5F7FB;
  }

  .payer-item:hover span {
    color: #196BD8 !important;
  }

  .payer-item :nth-child(2) {
    margin-left: 14px;
  }

  .payer-item :nth-child(3) {
    float: right;
    margin-right: 14px;
  }

  .btns-container {
    width: 500px;
    margin: 20px auto;
  }

  .btns-container :last-child {
    float: right;
  }

  .label {
    font-weight: bold;
    font-family: 'AvenirNext-Bold';
    color: #5E6369;
    font-size: 1.25rem;
    margin: 0;
  }

  .input-content {
    padding-left: 4rem;
  }

  .input-check {
    margin-top: 12px;
    margin-bottom: 20px;
    font-family: AvenirNext-Medium;
    font-size: 14px;
    color: #000000;
  }

</style>

<template>
    <div class="confirm-container clearfix">
            <p class="label">{{$t('sharedWalletHome.send')}}</p>

        <div class="asset-table">
            <div class="asset-item">
                <span class="font-medium">{{$t('sharedWalletHome.amount')}}</span>
                <span class="font-medium-black">{{transfer.amount}} {{transfer.asset}}</span>

            </div>
            <div class="asset-item">
                <span class="font-medium">{{$t('sharedWalletHome.recipient')}}</span>
                <span class="font-medium-black">{{transfer.to}}</span>
            </div>
            <div class="fee font-medium-black">{{$t('sharedWalletHome.fee')}}: {{transfer.gas}} ONG</div>
        </div>

       <p class="label">{{$t('sharedWalletHome.confirmation')}}</p>
        <div class="input-content">
            <div>
                <a-checkbox @change="onChange" :checked="checked" class="input-check">{{$t('sharedWalletHome.agreeToSend')}}</a-checkbox>

                <a-input type="password" class="input"  v-if="isCommonWallet"
                :placeholder="$t('sharedWalletHome.inputPassToTransfer')" 
                v-model="password"></a-input>

                <p class="font-medium" v-if="!isCommonWallet">{{$t('ledgerWallet.connectApp')}}</p>
                <p v-if="ledgerStatus">
                   <span class="font-medium-black">{{$t('ledgerWallet.status')}}: </span> 
                    <span class="font-medium">{{ledgerStatus}}</span>
                </p>
            </div>
        </div>


        <div class="confirm-btns">
            <div class="btns-container">
                <a-button type="default" class="btn-cancel" @click="back">{{$t('sharedWalletHome.back')}}</a-button>
                <a-button type="primary" class="btn-next" @click="submit" :disabled="sending">{{$t('sharedWalletHome.submit')}}</a-button>
            </div>

        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import {legacySignWithLedger} from '../../../core/ontLedger'
import {Oep4} from 'ontology-ts-sdk'
import { TEST_NET, MAIN_NET, ONT_CONTRACT, ONT_PASS_NODE, DEFAULT_SCRYPT } from '../../../core/consts'
import {Crypto, OntAssetTxBuilder, TransactionBuilder, utils, RestClient, TxSignature} from 'ontology-ts-sdk'
import axios from 'axios';
import {getDeviceInfo, getPublicKey} from '../../../core/ontLedger'
import $ from 'jquery'
import {BigNumber} from 'bignumber.js'
import { getRestClient } from '../../../core/utils'

export default {
  name: 'SendConfirm',
  mounted: function () {
      const currentWallet = JSON.parse(sessionStorage.getItem('currentWallet'));
      if(currentWallet.key) {
          return;
      }
      this.getDevice()
      let that = this;
      this.intervalId = setInterval(() => {
        that.getDevice()
      }, this.interval)
    },
    beforeDestroy(){
      clearInterval(this.intervalId)
    },
  data() {
    const net = localStorage.getItem('net');
    const currentWallet = JSON.parse(sessionStorage.getItem('currentWallet'));
    return {
      interval:10000,
      invervalId: '',
      currentWallet,
      checked: false,
      password: '',
      isCommonWallet: currentWallet.key ? true: false,
      ledgerStatus: '',
      publicKey: '',
      sending: false
    }
  },
  computed: {
    ...mapState({
      transfer: state => state.CurrentWallet.transfer
    })
  },
  methods: {
    back() {
      this.$emit('backEvent')
    },
    onChange() {
      this.checked = !this.checked;
    },
    getDevice() {
        if(this.publicKey) {
            return;
        }
        getDeviceInfo().then(res => {
          console.log('device: ' + res)
          this.device = res;
          this.getPublicKey()
        }).catch(err => {
          console.log(err)
          this.publicKey = '';
          if (err === 'NOT_FOUND') {
            this.ledgerStatus = this.$t('common.ledgerNotOpen')
          } else if (err === 'NOT_SUPPORT') {
            this.ledgerStatus = this.$t('common.ledgerNotSupported')
          } else {
            this.ledgerStatus = this.$t('common.pluginDevice')
          }
        })
      },
      getPublicKey() {
        if(this.publicKey) {
            return;
        }
        getPublicKey().then(res => {
          console.log('pk info: ' + res);
          this.publicKey = res
          this.ledgerStatus = this.$t('common.readyToSubmit')
        }).catch(err => {
          this.ledgerStatus = err.message
        })
      },
      sendTx(tx){
          const restClient = getRestClient();
          restClient.sendRawTransaction(tx.serialize()).then(res => {
          console.log(res)
          this.$store.dispatch('hideLoadingModals')
          if (res.Error === 0) {
            this.$message.success(this.$t('common.transSentSuccess'))
          } else if (res.Error === -1) {
            const err = res.Result.indexOf('cover gas cost') > -1 ? this.$t('common.ongNoEnough') : res.Result
            this.$message.error(err)
            return;
          } else {
            this.$message.error(res.Result)
            return;
          }
          this.$emit('sendConfirmSubmit')
          const title = this.$t('common.transSentSuccess')
          setTimeout(() => {
              this.$success({
                  title: title,
                  content: 'Transaction hash: ' + utils.reverseHex(tx.getHash())
              })
          }, 100)
        }).catch(err => {
          console.log(err)
          this.$message.error(this.$t('common.networkError'))
        })
      },
    submit() {
      if (this.isCommonWallet && (!this.password || !this.checked)) {
        this.$message.warning(this.$t('common.confirmPwdTips'))
        return;
      }
      if(!this.isCommonWallet && !this.checked) {
          this.$message.warning(this.$t('common.confirmTips'))
          return;
      }
      const asset = this.transfer.asset;
      const from = new Crypto.Address(this.currentWallet.address);
      const to = new Crypto.Address(this.transfer.to);
      const gasLimit = '20000';
      const gas = (new BigNumber(this.transfer.gas)).multipliedBy(1e9);
      const gasPrice = gas.div(parseInt(gasLimit)).toString();
  
      let tx;
      if(asset === 'ONT' || asset === 'ONG') {
        const amount = asset === 'ONT' ? this.transfer.amount : (new BigNumber(this.transfer.amount).multipliedBy(1e9)).toString();
         tx = OntAssetTxBuilder.makeTransferTx(asset, from, to, amount, gasPrice, gasLimit);
      } else if (this.transfer.scriptHash) {
        const contractAddr = new Crypto.Address(utils.reverseHex(this.transfer.scriptHash));
        const oep4 = new Oep4.Oep4TxBuilder(contractAddr);
        const val = new BigNumber(this.transfer.amount).multipliedBy(Math.pow(10, this.transfer.decimal));
        console.log(val)
        const amount = val.toString()
        console.log(amount)
         tx = oep4.makeTransferTx(from, to, amount, gasPrice, gasLimit, from);
      }
      
      if (this.isCommonWallet) {
        this.$store.dispatch('showLoadingModals')
        const enc = new Crypto.PrivateKey(this.currentWallet.key)
        let pri;
        try {
          pri = enc.decrypt(this.password, new Crypto.Address(this.currentWallet.address), this.currentWallet.salt, DEFAULT_SCRYPT)
        } catch (err) {
          this.sending = false;
          console.log(err);
          this.$store.dispatch('hideLoadingModals')
          this.$message.error(this.$t('common.pwdErr'))
          return;
        }
        TransactionBuilder.signTransaction(tx, pri);
        this.sendTx(tx)
      } else {
        if(this.publicKey) {
            this.sending = true;
            this.ledgerStatus = this.$t('common.waitForSign')
            this.$store.dispatch('showLoadingModals')
            const pk = new Crypto.PublicKey(this.currentWallet.publicKey);
            const txSig = new TxSignature();
            txSig.M = 1;
            txSig.pubKeys = [pk];
            tx.payer = from;
            const txData = tx.serializeUnsignedData();
            const neo = this.currentWallet.neo;
            legacySignWithLedger(txData, neo).then(res => {
            // console.log('txSigned: ' + res);
            const sign = '01' + res; //ECDSAwithSHA256
            txSig.sigData = [sign]
            tx.sigs = [txSig];
            this.sendTx(tx);
            }, err => {
                this.sending = false;
                this.ledgerStatus = '';
                this.$store.dispatch('hideLoadingModals')
                alert(err.message)
            }) 
        } else {
            this.$message.warning(this.$t('ledgerWallet.connectApp'))
        }
      }
    }

  }
}
</script>
