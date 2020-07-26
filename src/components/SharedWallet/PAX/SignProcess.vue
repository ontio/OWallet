<style scoped>
.sign-container {
    width:700px;
    margin:20px auto;
}
.label-container {
    position: relative;
}
.label {
    font-weight: bold;
    font-family: 'AvenirNext-Bold';
    color: #5E6369;
    font-size:1.25rem;
    margin:0;
}

.asset-table {
    padding: 5px 50px;
}
.asset-item {
    border-bottom: 1px solid #dddddd;
    padding:10px 20px;
}
.asset-item span {
    width: 30%;
    display: inline-block;
    text-align: left;
}
.asset-item :nth-child(2) {
    width:69%;
    display: inline-block;
    text-align: right
}
.select-sponsor {
    margin-left: 20px;
    width:80%;
    margin-bottom:15px;
}
.circle {
    display: inline-block;
    text-align: center;
    border-radius:50%;
    width:1.5rem;
    height:1.5rem;
    line-height: 1.5rem;
}

.circle-signed {
    background:#FBE45A;
}
.circle-unsigned {
    background:#F5F7FB;
}
.confirm-btns {
    position: fixed;
    bottom: 0;
    left: 4rem;
    height:5.3rem;
    width:calc(100% - 4rem);
    z-index: 1000;
    box-shadow: 0 -1px 6px 0 #F2F2F2;
    background:#ffffff;
}
.fee {
    padding-left: 20px;
    padding-top:10px;
    margin-bottom:50px;
}
.sponsor-item {
    padding-left: 4rem;
    margin-bottom:12px;
}
.sponsor-item :nth-child(2) {
    margin-left: 14px;
}
.sponsor-item :nth-child(3) {
    float: right;
    margin-right: 14px;
}
.sponsor-label {
    margin-bottom:20px;
}
.sponsor-label :last-child {
    float: right;
}

.payer-item {
    height: 20px;
    margin-top: 20px;
    padding-left: 4rem;
}

.payer-item :nth-child(2) {
    margin-left: 14px;
}
.payer-item :nth-child(3) {
    float: right;
    margin-right: 14px;
}

.btns-container {
    width:500px;
    margin:20px auto;
}
.btns-container :last-child {
    float: right;
}
.sign-content {
    margin-top: 20px;
    padding-left: 4rem;
}
</style>
<template>
    <div>
        <breadcrumb :routes="routes" :current="$t('pax.paxSign')"></breadcrumb>
        <div class="sign-container">
            <div >
                <div class="sponsor-label">
                    <span class="label">{{$t('sharedWalletHome.sponsor')}}</span>
                    <span class="label">[{{sharedWallet.requiredNumber}} - OF - {{sharedWallet.totalNumber}} ]</span>
                </div>
                <div class="sponsor-item">
                    <span class="circle font-medium-black" :class="processing_list[0].cosigners[0] && processing_list[0].cosigners[0].isSign? 'circle-signed': 'circle-unsigned'">1</span>
                    <span class="font-medium-black">{{processing_list[0].cosigners[0] && processing_list[0].cosigners[0].name}}</span>
                    <span class="font-medium">{{processing_list[0].cosigners[0] && processing_list[0].cosigners[0].address}}</span>
                </div>

                <p class="label">{{$t('sharedWalletHome.signSequence')}}
                </p>
                <div class="drag-item" v-for="(payer,index) in processing_list[0].cosigners" :key="payer.address">
                    <div class="payer-item" v-if="index!==0">
                        <span class="circle font-medium-black" :class="payer.isSign? 'circle-signed': 'circle-unsigned'">{{index+1}}</span>
                        <span class="font-medium-black">{{payer.name}}</span>
                        <span class="font-medium">{{payer.address}}</span>
                    </div>
                </div>
            </div>
            <div class="sign-container" v-if="showSign">
                    <p class="label">{{$t('pax.currentSign')}}</p>
                    <div class="sign-content">
                        <div v-if="currentSigner.type === 'CommonWallet'">
                            <a-input type="password" class="input-pass" :placeholder="$t('pax.inputPassword')" v-model="password"></a-input>
                        </div>

                        <div class="ledger-status" v-if="currentSigner.type === 'HardwareWallet'">
                            <div class="font-bold" style="margin-bottom: 15px;">{{$t('ledgerWallet.connectApp')}}</div>
                            <span class="font-medium-black">{{$t('ledgerWallet.status')}}: </span>
                            <span class="font-medium">{{ledgerStatus}} </span>
                            <p>{{$t('pax.ledgerSignMultiTimes')}}</p>
                        </div>
                    </div>

            </div>
        </div>
        <div class="confirm-btns">
            <div class="btns-container">
                <a-button type="default" class="btn-cancel" @click="back">{{$t('pax.back')}}</a-button>
                <a-button type="primary" class="btn-next" @click="confirm"
                :disabled="sending || !currentSigner
                || currentSigner.type === 'CommonWallet' && !password
                || currentSigner.type === 'HardwareWallet' && !ledgerPk">
                {{$t('pax.confirm')}}</a-button>
            </div>
        </div>

         <a-modal
            :title="$t('pax.sendingTx')"
            :visible="visible"
            :footer="null"
            >
            <p>{{$t('pax.txToSend')}} {{txToSend}}</p>
            <p>{{$t('pax.txSent')}} {{txSent}}</p>
        </a-modal>
    </div>
</template>
<script>
import Breadcrumb from '../../Breadcrumb'
import {mapState} from 'vuex'
import { getRestClient } from '../../../core/utils'
import {Transaction, Crypto, TransactionBuilder, TxSignature, utils, RestClient} from 'ontology-ts-sdk'
import {legacySignWithLedger} from '../../../core/ontLedger'
import {PAX_API} from '../../../core/consts'
import {decryptWallet} from '../../../core/utils'

export default {
    name: 'SignProcess',
    components: {
        Breadcrumb
    },
    data() {
        const sharedWallet = JSON.parse(sessionStorage.getItem('sharedWallet'));
        const routes = [
            {name: sharedWallet.sharedWalletName, path:'/sharedWallet/home'},
            {name: this.$t('sharedWalletHome.paxMgmt'), path: '/sharedWallet/paxMgmt'}
        ]
        const payers = sharedWallet.coPayers
        return {
            routes,
            sharedWallet,
            payers,
            password: '',
            sending: false,
            showSign: true,
            visible: false,
            txToSend:0,
            txSent: 0
        }
    },
    computed:{
        ...mapState({
            processing_list: state => state.PaxMgmt.processing_list,
            ledgerStatus: state => state.LedgerConnector.ledgerStatus,
            ledgerPk : state => state.LedgerConnector.publicKey,
            currentSigner: state => state.PaxMgmt.currentSigner
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
    methods: {
        back() {
            this.$router.back();
        },
        async confirm() {
            //sign tx
            if(this.processing_list.length === 0) {
                return;
            }

            this.$store.dispatch('showLoadingModals')
            const M = this.sharedWallet.requiredNumber;
            //避免已发交易被再签
            const txBefore = Transaction.deserialize(this.processing_list[0].Txbodyhash)
            const sigNumBefore = txBefore.sigs[0].sigData.length;
            if(sigNumBefore >= M) {
                this.$message.error(this.$t('pax.hasSignedSent'), 10)
                return;
            }
            this.sending = true;

            const pks = this.sharedWallet.coPayers.map(p => new Crypto.PublicKey(p.publickey))
            const txbodyhashes = [];
            const txhashes = [];
            const cosignerList = [];

            const cosignerUpdate = this.processing_list[0].cosigners.map((item) => {
                if(item.address === this.currentSigner.address) {
                    return {...item, isSign: true}
                }
                return {...item};
            })

            if (this.currentSigner.type === 'CommonWallet') {
                const enc = new Crypto.PrivateKey(this.currentSigner.wallet.key)
                const pri = decryptWallet({
                    key: this.currentSigner.wallet.key,
                    address: this.currentSigner.address,
                    salt: this.currentSigner.wallet.salt
                    }, this.password);
                if (!pri) {
                    return;
                }

                for(let item of this.processing_list) {
                    const tx = Transaction.deserialize(item.Txbodyhash)
                    console.log(tx)
                    TransactionBuilder.signTx(tx, M, pks, pri)
                    console.log(tx)
                    txbodyhashes.push(tx.serialize())
                    txhashes.push(item.Txhash)
                    cosignerList.push(JSON.stringify(cosignerUpdate))
                }
            } else {
                for(let item of this.processing_list) {
                    const tx = Transaction.deserialize(item.Txbodyhash)
                    let res;
                    try {
                        res = await legacySignWithLedger(tx.serializeUnsignedData())
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
                    txbodyhashes.push(tx.serialize())
                    txhashes.push(item.Txhash)
                    cosignerList.push(JSON.stringify(cosignerUpdate))
                }
            }

            //decide to send to chain
                const tx = Transaction.deserialize(txbodyhashes[0])
                const sigNum = tx.sigs[0].sigData.length;
                const data = {
                    txhashs: txhashes,
                    cosigners: cosignerList,
                    txbodyhashs: txbodyhashes,
                    status:1
                }
                if(M <= sigNum) {
                    data.status = 2;
                }
                if(M <= sigNum) {
                    const senthashs = [];
                    this.$store.dispatch('hideLoadingModals')
                    this.visible = true;
                    this.txToSend = txbodyhashes.length;
                    for(let txData of txbodyhashes) {
                        const txRes = await this.sendTx(txData)
                        if(txRes) {
                            this.txSent ++;
                            senthashs.push(txRes)
                        } else {
                            // send tx failed
                            this.visible = false;
                            return;
                        }
                    }
                    data.senthashs =  senthashs;
                    setTimeout(()=> {
                        this.visible = false;
                        if(this.txToSend === this.txSent && this.txSent > 0) {
                            this.updateApprovalList(data)
                        }
                    }, 2000)
                } else {
                    this.updateApprovalList(data)
                }

        },
        async updateApprovalList(data) {
            this.$store.dispatch('showLoadingModals')
            const net = localStorage.getItem('net');
            const result = await this.httpService({
                method:'post',
                data,
                url: (net === 'TEST_NET' ? PAX_API.TestHost : PAX_API.Host) + PAX_API.updateApprovals
            })
            console.log(result)
            this.sending = false;
            if(result && result.ErrorCode === 0) {
                this.$message.success(this.$t('pax.signSuccess'))
                this.$router.push({path: '/sharedWallet/paxMgmt'})
            } else {
                this.$store.dispatch('hideLoadingModals')
                this.$message.error(result.Error)
            }
        },
        async sendTx(txData) {
             //send tx
            const restClient = getRestClient();
            try {
                const res = await restClient.sendRawTransaction(txData)
                console.log(res)
                if(res.Error === 0) {
                    return res.Result;
                } else {
                    if(res.Result.indexOf('balance insufficient') > -1 ) {
                        this.$message.error(this.$t('common.balanceInsufficient'), 5)
                    } else if(res.Result.indexOf('cover gas cost') > -1){
                        this.$message.error(this.$t('common.ongNoEnough'), 5)
                    } else {
                        this.$message.error(res.Result, 5)
                    }
                    this.$store.dispatch('hideLoadingModals')
                    return '';
                }
            }catch(err) {
                console.log(err)
                return '';
            }
        }
    }
}
</script>
