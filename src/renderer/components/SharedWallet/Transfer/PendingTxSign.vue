<style scoped>
.label {
    font-weight: bold;
    font-family: 'AvenirNext-Bold';
    color: #5E6369;
    font-size:1.25rem;
    margin:0;
}

.asset-table {
    padding: 10px 20px;
}
.asset-item {
    border-bottom: 1px solid #dddddd;
    padding:10px 10px;
}
.asset-item span {
    width: 30%;
    display: inline-block;
    text-align: center;
}
.asset-item :nth-child(2) {
    width:69%;
    display: inline-block;
}
.select-sponsor {
    margin-left: 20px;
    width:80%;
    margin-bottom:15px;
}
.circle {
    display: inline-block;
    text-align: center;
    border:1px solid #dddddd;
    border-radius:50%;
    width:20px;
    height:20px;
    line-height: 20px;
}
.input-btns :last-child {
    float: right;
}
.input-content {
    padding-left: 4rem;
}
.input-check {
    margin-top:12px;
    margin-bottom: 40px;
}
.input-pass {
    margin-bottom:50px;
}
</style>
<template>
    <div class="clearfix">
        <p class="label">{{$t('sharedWalletHome.confirmation')}}</p>
        <div class="input-content">
            <div>
                <a-checkbox @change="onChange" :checked="checked" class="input-check">{{$t('sharedWalletHome.agreeToSend')}}</a-checkbox>

                <div v-if="currentSigner.type === 'CommonWallet'">
                    <a-input type="password" class="input-pass" :placeholder="$t('sharedWalletHome.inputPassToTransfer')" v-model="password"></a-input>
                </div>

                <div class="ledger-status" v-if="currentSigner.type === 'HardwareWallet'">
                    <div class="font-bold" style="margin-bottom: 15px;">{{$t('ledgerWallet.connectApp')}}</div>
                    <span class="font-medium-black">{{$t('ledgerWallet.status')}}: </span>
                    <span class="font-medium">{{ledgerStatus}} </span>
                </div>
            </div>
        <div class="input-btns">
            <a-button type="danger" class="btn-cancel" @click="back">{{$t('sharedWalletHome.back')}}</a-button>
            <a-button type="primary" class="btn-next" @click="submit" 
            :disabled="sending || !checked
                || currentSigner.type === 'CommonWallet' && !password
                || currentSigner.type === 'HardwareWallet' && !ledgerPk">
                {{$t('sharedWalletHome.submit')}}
                </a-button>
        </div>
        </div>

    </div>
</template>

<script>
import {mapState} from 'vuex'
import {OntAssetTxBuilder, Crypto, TransactionBuilder, Transaction, RestClient, utils, TxSignature} from 'ontology-ts-sdk'
import {ONT_PASS_NODE, ONT_PASS_NODE_PRD, ONT_PASS_URL, DEFAULT_SCRYPT, TEST_NET, MAIN_NET} from '../../../../core/consts'
import axios from 'axios'
import dbService from '../../../../core/dbService'
import {legacySignWithLedger} from '../../../../core/ontLedger'
import { getRestClient } from '../../../../core/utils';

export default {
    name:'PendingTxSign',
    data() {
        const net = localStorage.getItem('net');
        const sharedWallet = JSON.parse(sessionStorage.getItem('sharedWallet'));
        return {
            sharedWallet,
            payers: [],
            password:'',
            checked: false,
            sending:false
        }
    },
    computed:{
        ...mapState({
            pendingTx: state => state.CurrentWallet.pendingTx,
            currentSigner: state => state.CurrentWallet.currentSigner,
            ledgerStatus: state => state.LedgerConnector.ledgerStatus,
            ledgerPk : state => state.LedgerConnector.publicKey, 
        })
    },
    mounted() {
        if(this.currentSigner.type === 'HardwareWallet') {
            this.$store.dispatch('getLedgerStatus')
        }
    },
    beforeDestroy(){
        if(this.currentSigner.type === 'HardwareWallet') {
            this.$store.dispatch('stopGetLedgerStatus')
        }
    },
    methods:{
        back(){
            this.$emit('backEvent')
        },
        onChange(){
            this.checked = !this.checked;
        },
        async submit() {
            if(!this.sending) {
                this.sending = true;
                this.$store.dispatch('showLoadingModals')
                //sign and decide to send
                const tx = Transaction.deserialize(this.pendingTx.transactionbodyhash);
                const txHash = this.pendingTx.transactionidhash;
                const M = tx.sigs[0].M;
                const pks = tx.sigs[0].pubKeys;
                 if (this.currentSigner.type === 'CommonWallet') {
                    const enc = new Crypto.PrivateKey(this.currentSigner.key)
                    let pri;
                    try {
                        pri = enc.decrypt(this.password, new Crypto.Address(this.currentSigner.address), this.currentSigner.salt, DEFAULT_SCRYPT)
                    }catch(err) {
                        this.$store.dispatch('hideLoadingModals')
                        this.sending = false;
                        console.log(err);
                        this.$message.error(this.$t('common.pwdErr'))
                        return;
                    }
                    TransactionBuilder.signTx(tx, M, pks, pri)
                } else {
                    const txData = tx.serializeUnsignedData();
                    let res;
                    try {
                        res = await legacySignWithLedger(txData)
                    } catch(err) {
                        this.ledgerStatus = '';
                        this.$store.dispatch('hideLoadingModals')
                        alert(err.message)
                        return;
                    }
                    const sig = new TxSignature();
                    sig.M = M;
                    sig.pubKeys = pks;
                    const sigVal = '01' + res;
                    tx.sigs[0].sigData.push(sigVal);
                }
                //send
                const net = localStorage.getItem('net')
                const ontPassNode = net === 'TEST_NET' ? ONT_PASS_NODE : ONT_PASS_NODE_PRD
                const url = ontPassNode + ONT_PASS_URL.SignSharedTransfer

                const body = {
                    transactionIdHash:txHash,
                    signedAddress: this.currentSigner.address,
                    signedHash: tx.serialize()
                }
                const res = await axios.post(url, body)
                    if(res.data && res.data.Error && res.data.Error !== 0) {
                        this.$message.error(res.data.Desc)
                        this.$store.dispatch('hideLoadingModals')
                        this.sending = false;
                        return;
                    }
              
                // await this.httpService({
                //     method: 'post',
                //     data: body,
                //     url
                // })
                //decide to send to chain
                const sigNum = tx.sigs[0].sigData.length;
                if(M <= sigNum) {
                    //send tx
                    const that = this;
                    const restClient = getRestClient();
                    const res = await restClient.sendRawTransaction(tx.serialize())
                        console.log(res)
                        this.$store.dispatch('hideLoadingModals')
                        if(res.Error === 0) {
                            this.$message.success(that.$t('common.transSentSuccess'))
                            this.$emit('submitEvent')
                            const title = that.$t('common.transSentSuccess')
                            setTimeout(() => {
                                this.$success({
                                    title: title,
                                    content: 'Transaction hash: ' + utils.reverseHex(tx.getHash())
                                })
                            }, 100)
                            return;
                        } else if(res.Error === -1) {
                            alert(res.Result)
                            return;
                        }
                    

                }
                this.$store.dispatch('hideLoadingModals')
                this.$emit('submitEvent')
            }
        }
    }
}
</script>


