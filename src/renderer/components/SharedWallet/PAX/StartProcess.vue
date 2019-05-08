<style scoped>
.start-container {
    width: 700px;
    margin:20px auto;
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
    border:1px solid #dddddd;
    border-radius:50%;
    width:1.5rem;
    height:1.5rem;
    line-height: 1.5rem;
    background:#FBE45A;
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
    text-align: left !important;
}
.sponsor-select {
    padding-left: 4rem;
}
.sponsor-label {
    margin-bottom:20px;
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
    width:500px;
    margin:20px auto;
}
.btns-container :last-child {
    float: right;
}

.sign-container {
    margin-top: 30px;
    position: relative;
}
.sign-container > button {
    position: absolute;
    right:0;
    top: -5px;
}

.sign-content {
    margin-top: 20px;
    padding-left:4rem;
}
</style>
<template>
    <div>
        <breadcrumb :routes="routes" :current="$t('pax.paxStart')"></breadcrumb>
        <div class="start-container">
            <div class="sponsor-label">
                <span class="label">{{$t('sharedWalletHome.sponsor')}}</span>
                <span class="label">[{{sharedWallet.requiredNumber}} - OF - {{sharedWallet.totalNumber}} ]</span>
            </div>
            <div class="sponsor-select">
                <span class="circle font-medium-black">1</span>
                <a-select :options="localCopayers" class="select-sponsor"  @change="handleChangeSponsor"></a-select>
            </div>

            <p class="label">{{$t('sharedWalletHome.dragDecide')}}
            </p>
            <draggable v-model="payers" @start="drag=true" @end="drag=false" class="drag-container">
                <div class="drag-item" v-for="(payer,index) in payers" :key="payer.address">
                    <div class="payer-item">
                        <span class="circle font-medium-black">{{index+2}}</span>
                        <span class="font-medium-black">{{payer.name}}</span>
                        <span class="font-medium">{{payer.address}}</span>
                    </div>
                </div>
            </draggable>

            <div class="sign-container" v-if="sponsorPayer">
                <p class="label">{{$t('pax.sponsorSign')}}</p>
                    
                <div class="sign-content">
                    <div v-if="sponsorPayer.type === 'CommonWallet'">
                        <a-input type="password" class="input-pass" :placeholder="$t('pax.inputPassword')" v-model="password"></a-input>
                    </div>

                    <div class="ledger-status" v-if="sponsorPayer.type === 'HardwareWallet'">
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
                :disabled="sending || !sponsorPayer
                || sponsorPayer.type === 'CommonWallet' && !password
                || sponsorPayer.type === 'HardwareWallet' && !ledgerPk">
                {{$t('pax.confirm')}}</a-button>
            </div>
        </div>
    </div>
</template>
<script>
import Breadcrumb from '../../Breadcrumb'
import draggable from 'vuedraggable'
import dbService from '../../../../core/dbService'
import {mapState} from 'vuex'
import {legacySignWithLedger} from '../../../../core/ontLedger'
import {Transaction, Crypto, TransactionBuilder, TxSignature, utils} from 'ontology-ts-sdk'
import {PAX_API} from '../../../../core/consts'
import {decryptWallet} from '../../../../core/utils'

export default {
    name: 'StartProcess',
    components: {
        Breadcrumb,
        draggable
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
            sponsorPayer:'',
            localCopayers: [],
            password: '',
            sending: false
        }
    },
    computed:{
        ...mapState({
            unprocess_list: state => state.PaxMgmt.unprocess_list,
            ledgerStatus: state => state.LedgerConnector.ledgerStatus,
            ledgerPk : state => state.LedgerConnector.publicKey,            
        })
    },
    mounted() {
        this.updateLocalCopayers()
        if(this.sponsorPayer.type === 'HardwareWallet') {
            this.$store.dispatch('getLedgerStatus')
        }
    },
    beforeDestroy(){
        if(this.sponsorPayer.type === 'HardwareWallet') {
            this.$store.dispatch('stopGetLedgerStatus')
        }
    },
    methods: {
        updateLocalCopayers() {
            var that = this;
                const coPayers = this.sharedWallet.coPayers;
                const localCopayers = []
                dbService.find({type: {$in:['CommonWallet', 'HardwareWallet']}}, function (err, accounts) {
                    if (err) {
                        console.log(err)
                        return;
                    }
                    for (let cp of coPayers) {
                        for (let ac of accounts) {
                            if (cp.address === ac.address) {
                                localCopayers.push(Object.assign({}, cp, {value:ac.address, label:ac.wallet.label, type: ac.type, wallet: ac.wallet}))
                            }
                        }
                    }
                    if (localCopayers.length > 0) {
                        that.localCopayers = localCopayers;
                    }
                })
        },
        handleChangeSponsor(value,option) {
            const payers = []
            for(let p of this.sharedWallet.coPayers) {
                if(p.address !== value) {
                    payers.push(p)
                } else {
                    this.sponsorPayer = this.localCopayers.find(item=> item.address === value)
                    if(this.sponsorPayer.type === 'HardwareWallet') {
                        this.$store.dispatch('getLedgerStatus')
                    }
                }
            }
            this.payers = payers;
        },
        back() {
            this.$router.back();
        },
        async confirm() {
            //sign tx
            if(this.unprocess_list.length === 0) {
                return;
            }
            this.$store.dispatch('showLoadingModals')
            const M = this.sharedWallet.requiredNumber;
            const pks = this.sharedWallet.coPayers.map(p => new Crypto.PublicKey(p.publickey))
            const txbodyhashes = [];
            const txhashes = [];
            const cosignerList = [];
            const cosigner = this.payers.map((item)=>{
                item.isSign = false;
                return item;
            })
            cosigner.unshift({
                address: this.sponsorPayer.address,
                name: this.sponsorPayer.name,
                publickey: this.sponsorPayer.publickey,
                isSign: true
            })
            //sponsorPayer
            if (this.sponsorPayer.type === 'CommonWallet') {
                const enc = new Crypto.PrivateKey(this.sponsorPayer.wallet.key)
                const pri = decryptWallet({
                    key: this.sponsorPayer.wallet.key,
                    address: this.sponsorPayer.address,
                    salt: this.sponsorPayer.wallet.salt
                    }, this.password);
                if (!pri) {
                    return;
                }
                
                for(let item of this.unprocess_list) {
                    const tx = Transaction.deserialize(item.Rawtxdata)
                    tx.payer = new Crypto.Address(this.sharedWallet.sharedWalletAddress);
                    TransactionBuilder.signTx(tx, M, pks, pri)
                    txbodyhashes.push(tx.serialize())
                    txhashes.push(item.Txhash)
                    cosignerList.push(JSON.stringify(cosigner))
                }
            } else {
                for(let item of this.unprocess_list) {
                    const tx = Transaction.deserialize(item.Rawtxdata)
                    tx.payer = new Crypto.Address(this.sharedWallet.sharedWalletAddress);
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
                    sig.sigData = ['01' + res];
                    tx.sigs.push(sig);
                    txbodyhashes.push(tx.serialize())
                    txhashes.push(item.Txhash)
                    cosignerList.push(JSON.stringify(cosigner))
                }
            }
            
            const data = {
                txhashs: txhashes,
                cosigners: cosignerList,
                txbodyhashs: txbodyhashes,
                status:1
            }
            const net = localStorage.getItem('net');
            const result = await this.httpService({
                method:'post',
                data,
                url: (net === 'TEST_NET' ? PAX_API.TestHost : PAX_API.Host) + PAX_API.updateApprovals
            })
            console.log(result)
            if(result && result.ErrorCode === 0) {
                this.$message.success(this.$t('pax.startProcessSuccess'))
                this.$router.push({path: '/sharedWallet/paxMgmt'})
            } else {
                this.$store.dispatch('hideLoadingModals')
                this.$message.error(result.Error)
            }
        },
        
    }
}
</script>
