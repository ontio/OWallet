<style scoped>
.container {
    width:540px;
    margin:4rem auto;
}
.label {
    font-family: AvenirNext-Bold;
    font-size: 20px;
    color: #5E6369;
}
.input-pass {
    margin-top:12px;
    padding-left: 4rem;
}
.connect-ledger-app {
    margin-top: 20px;
    margin-left: 4rem;
}

.ledger-status {
    margin-top:10px;
    margin-left: 4rem;
}
</style>
<template>
    <div>
        <breadcrumb :current="$t('commonWalletHome.redeem')" :routes="routes"
                v-on:backEvent="backToWallets"></breadcrumb>
        <div class="container">
            <div class="label">
                {{$t('commonWalletHome.redeemCharge')}}
            </div>
            <div class="input-pass" v-if="type=== 'commonWallet'">
                <a-input type="password" class="input" :placeholder="$t('commonWalletHome.inputPass')" v-model="password"></a-input>
            </div>
            <div v-if="type === 'hardwareWallet'" class="connect-ledger-app font-medium">
                {{$t('ledgerWallet.connectApp')}}
            </div>
            <div v-if="ledgerStatus" class="ledger-status ">
                <span class="font-medium-black">{{$t('ledgerWallet.status')}}: </span>
                <span class="font-medium">{{ledgerStatus}} </span>
            </div>
        </div>
        <div class="footer-btns">
            <div class="footer-btn-container">
                <a-button type="default" class="btn-cancel" @click="cancel">{{$t('commonWalletHome.cancel')}}</a-button>
                <a-button type="primary" class="btn-next" @click="submit" :disabled="sending">
                    {{$t('commonWalletHome.submit')}}
                    </a-button>
            </div>
        </div>
        
    </div>
</template>

<script>
import Breadcrumb from '../Breadcrumb'
import {legacySignWithLedger} from '../../../core/ontLedger'
import {RestClient, Crypto,OntAssetTxBuilder, TransactionBuilder, utils, TxSignature} from 'ontology-ts-sdk'
import { TEST_NET, MAIN_NET, ONT_CONTRACT, ONT_PASS_NODE, DEFAULT_SCRYPT, GAS_PRICE, GAS_LIMIT } from '../../../core/consts'
import {mapState} from 'vuex'
import {getDeviceInfo, getPublicKey} from '../../../core/ontLedger'
import {BigNumber} from 'bignumber.js'
import { getRestClient } from '../../../core/utils'
export default {
    name: 'CommonRedeem',
    components: {
        Breadcrumb
    },
    mounted: function () {
    const currentWallet = JSON.parse(sessionStorage.getItem('currentWallet'));
      if(currentWallet.key) {
          return;
      }
      let that = this;
      that.getDevice()
      this.intervalId = setInterval(() => {
        that.getDevice()
      }, this.interval)
    },
    beforeDestroy(){
      clearInterval(this.intervalId)
    },
    data() {
        const net = localStorage.getItem('net');
        const type = this.$route.params.walletType
        const currentWallet = JSON.parse(sessionStorage.getItem('currentWallet'))
        const routes = [{name: currentWallet.label, path:'/dashboard'}]
        return {
            currentWallet,
            routes,
            type,
            password:'',
            interval:10000,
            invervalId:'',
            publicKey:'',
            ledgerStatus:'',
            sending: false
        }
    },
    computed:{
        ...mapState({
            redeem: state => state.CurrentWallet.redeem
        })
    },
    methods: {
        backToWallets() {
            this.$router.push({name: 'Wallets'})
        },
        cancel() {
            this.$router.push('/dashboard')
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
      sendTx(tx) {
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
            const title = this.$t('common.transSentSuccess')
            this.$router.push({path:'/dashboard'})
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
            if(this.type === 'commonWallet' &&!this.password) {
                this.$message.error(this.$t('commonWalletHome.emptyPass'))
                return;
            }
            this.sending = true;
            const from = new Crypto.Address(this.currentWallet.address);
            const to = from;
            const value = new BigNumber(this.redeem.claimableOng);
            const amount = value.multipliedBy(1e9).toString();
            const tx = OntAssetTxBuilder.makeWithdrawOngTx(from, to, amount, from, GAS_PRICE, GAS_LIMIT);
            if(this.type === 'commonWallet') {
                this.$store.dispatch('showLoadingModals')
                const enc = new Crypto.PrivateKey(this.currentWallet.key)
                let pri;
                try {
                    pri = enc.decrypt(this.password, from, this.currentWallet.salt, DEFAULT_SCRYPT)
                } catch (err) {
                    console.log(err);
                    this.$store.dispatch('hideLoadingModals')
                    this.$message.error(this.$t('common.pwdErr'))
                    this.sending = false;
                    return;
                }
                TransactionBuilder.signTransaction(tx, pri);
                this.sendTx(tx);
            } else {
                if(this.publicKey) {
                    this.$store.dispatch('showLoadingModals')
                    this.sending = true;
                    this.ledgerStatus = this.$t('common.waitForSign')
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


