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
    z-index: 1000;
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

                <a-input type="password" class="input" :placeholder="$t('sharedWalletHome.inputPassToTransfer')" v-model="password"></a-input>
            </div>
        </div>


        <div class="confirm-btns">
            <div class="btns-container">
                <a-button type="default" class="btn-cancel" @click="back">{{$t('sharedWalletHome.back')}}</a-button>
                <a-button type="primary" class="btn-next" @click="submit">{{$t('sharedWalletHome.submit')}}</a-button>
            </div>

        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import {legacySignWithLedger} from '../../../core/ontLedger'
import { TEST_NET, MAIN_NET, ONT_CONTRACT, ONT_PASS_NODE, DEFAULT_SCRYPT } from '../../../core/consts'
import {Crypto, OntAssetTxBuilder, TransactionBuilder} from 'ontology-ts-sdk'
import axios from 'axios';
export default {
  name: 'SendConfirm',
  data() {
    const net = localStorage.getItem('net');
    let url = ''
    if (net === 'TEST_NET') {
        url = TEST_NET + ':20334'
    } else {
        url = MAIN_NET + ':20334'
    }
    const currentWallet = JSON.parse(sessionStorage.getItem('currentWallet'));
    return {
      currentWallet,
      checked: false,
      password: '',
      nodeUrl: url
    }
  },
  computed: {
    ...mapState({
      transfer: state => state.CurrentWallet.transfer
    })
  },
  methods: {
    isCommonWallet() {
      return this.currentWallet.key ? true : false;
    },
    back() {
      this.$emit('backEvent')
    },
    onChange() {
      this.checked = !this.checked;
    },
    submit() {
      if (!this.password || !this.checked) {
        this.$message.warning(this.$t('common.confirmPwdTips'))
        return;
      }
      const restClient = new Ont.RestClient(this.nodeUrl);
      const from = new Ont.Crypto.Address(this.currentWallet.address);
      const to = new Ont.Crypto.Address(this.transfer.to);
      const asset = this.transfer.asset;
      const amount = asset === 'ONT' ? this.transfer.amount : Number(this.transfer.amount) * 1e9;
      const gasLimit = '20000';
      const gasPrice = (this.transfer.gas * 1e9 / parseInt(gasLimit)).toString();
      const tx = Ont.OntAssetTxBuilder.makeTransferTx(asset, from, to, amount, gasPrice, gasLimit);
      this.$store.dispatch('showLoadingModals')
      if (this.isCommonWallet()) {
        const enc = new Crypto.PrivateKey(this.currentWallet.key)
        let pri;
        try {
          pri = enc.decrypt(this.password, new Crypto.Address(this.currentWallet.address), this.currentWallet.salt, DEFAULT_SCRYPT)
        } catch (err) {
          this.sending = false;
          console.log(err);
          this.$message.error(this.$t('common.pwdErr'))
          return;
        }
        TransactionBuilder.signTransaction(tx, pri);
        restClient.sendRawTransaction(tx.serialize()).then(res => {
          console.log(res)
          if (res.Error === 0) {
            this.$message.success(this.$t('common.transSentSuccess'))
          } else if (res.Error === -1) {
            this.$message.error(this.$t('common.ongNoEnough'))
          } else {
            this.$message.error(res.Result)
          }
          this.$emit('sendConfirmSubmit')
        })
      } else {
        const pk = new Ont.Crypto.PublicKey(this.publicKey);
        const txSig = new Ont.TxSignature();
        txSig.M = 1;
        txSig.pubKeys = [pk];
        tx.payer = from;
        const txData = tx.serializeUnsignedData();
        legacySignWithLedger(txData, this.publicKey).then(res => {
          // console.log('txSigned: ' + res);
          const sign = '01' + res; //ECDSAwithSHA256
          txSig.sigData = [sign]
          tx.sigs = [txSig];
          const txSerialized = tx.serialize();
          // console.log('txSerialized: ' + txSerialized);

          //send tx
          restClient.sendRawTransaction(txSerialized).then(resp => {
            console.log('send tx resp: ' + JSON.stringify(resp));

            if (resp.Error === 0) {
              this.$message.success(this.$t('common.transSentSuccess'))
            } else if (res.Error === -1) {
              this.$message.error(this.$t('common.ongNoEnough'))
            } else {
              alert(this.$t('common.transferFailed') + resp.Result)
            }
            this.$emit('sendConfirmSubmit')
          })
        }, err => {
          alert(err.message)
        })
      }
    }

  }
}
</script>
