<style scoped>
.confirm-container {
    height: 400px;
    padding-bottom: 20px;
    overflow:auto;
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
    text-align: center;
}

</style>

<template>
    <div class="confirm-container clearfix">
            <p class="label" v-if="!isRedeem">{{$t('sharedWalletHome.send')}}</p>
            <p class="label" v-if="isRedeem">{{$t('sharedWalletHome.redeemOng')}}</p>

        <div class="asset-table">
            <div class="asset-item">
                <span class="font-medium">{{$t('sharedWalletHome.amount')}}</span>
                <span class="font-medium-black">{{pendingTx.amount}} {{pendingTx.assetName}}</span>
                              
            </div>
            <div class="asset-item">
                <span class="font-medium">{{$t('sharedWalletHome.recipient')}}</span>  
                <span class="font-medium-black">{{pendingTx.receiveaddress}}</span>                
            </div>
            <div class="fee font-medium-black">{{$t('sharedWalletHome.fee')}}: {{gas}} ONG</div>
        </div>

        <div >
            <div class="sponsor-label">
                <span class="label">{{$t('sharedWalletHome.sponsor')}}</span>
                <span class="label">[{{sharedWallet.requiredNumber}} - OF - {{sharedWallet.totalNumber}} ]</span>
            </div>
            <div class="sponsor-item">
                <span class="circle font-medium-black" :class="pendingTx.coPayerSignDtos[0] && pendingTx.coPayerSignDtos[0].isSign? 'circle-signed': 'circle-unsigned'">1</span>
                <span class="font-medium-black">{{pendingTx.coPayerSignDtos[0] && pendingTx.coPayerSignDtos[0].name}}</span>
                <span class="font-medium">{{pendingTx.coPayerSignDtos[0] && pendingTx.coPayerSignDtos[0].address}}</span>
            </div>

            <p class="label">{{$t('sharedWalletHome.signSequence')}}
            </p>
            <div class="drag-item" v-for="(payer,index) in pendingTx.coPayerSignDtos" :key="payer.address">
                <div class="payer-item" v-if="index!==0">
                    <span class="circle font-medium-black" :class="payer.isSign? 'circle-signed': 'circle-unsigned'">{{index+1}}</span>
                    <span class="font-medium-black">{{payer.name}}</span>
                    <span class="font-medium">{{payer.address}}</span>
                </div>
            </div>
        </div>

        

        <div class="confirm-btns" v-if="showSign">
            <div class="btns-container">          
                <a-button type="primary" class="btn-next" @click="next">{{$t('sharedWalletHome.sign')}}</a-button>
            </div>
            
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import dbService from '../../../../core/dbService'
import { BigNumber } from 'bignumber.js';
export default {
    name: 'PendingConfirm',
    data() {
        const sharedWallet = JSON.parse(sessionStorage.getItem('sharedWallet'));
        const payers = sharedWallet.coPayers
        return {
            sharedWallet,
            payers,
            sponsorPayer:'',
            showSign:false
        }
    },
    
    computed:{
        ...mapState({
            pendingTx: state => state.CurrentWallet.pendingTx,
            isRedeem: state => state.CurrentWallet.transfer.isRedeem
        }),
        gas: {
            get() {
                const gasPrice = new BigNumber(this.$store.state.CurrentWallet.pendingTx.gasprice)
                const gasLimit = new BigNumber(this.$store.state.CurrentWallet.pendingTx.gaslimit)
                const gas = gasPrice.multipliedBy(gasLimit).div(1e9).toString();
                return gas;
            }
        }
    },
    mounted() {
        this.updateShowSign()
    },
    methods: {
        updateShowSign() {
            var that = this;
                const nextSigner = this.pendingTx.coPayerSignDtos.find((e)=> e.isSign=== false)
                if(!nextSigner) {
                    return;
                }
                const localCopayers = []
                dbService.find({type: {$in: ['CommonWallet', 'HardwareWallet']}}, function (err, accounts) {
                    if (err) {
                        console.log(err)
                        return;
                    }
                    for (let ac of accounts) {
                        if (nextSigner.address === ac.address) {
                            that.$store.commit('UPDATE_CURRENT_SIGNER', {account: {...ac.wallet, type: ac.type}})
                            that.showSign = true;
                            return;
                        }
                    }
                })
        },
        handleChangeSponsor(value) {
            const payers = []
            for(let p of this.sharedWallet.coPayers) {
                if(p.address !== value) {
                    payers.push(p)
                } else {
                    this.sponsorPayer = p
                }
            }
            this.payers = payers;
        },
        cancel(){
            this.$emit('cancelEvent')
        },
        back(){
            this.$emit('sendConfirmBack')
        },
        next(){
            this.$emit('signEvent')
        }
    }
}
</script>
