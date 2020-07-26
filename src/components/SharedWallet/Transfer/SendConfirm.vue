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
</style>

<template>
    <div class="confirm-container clearfix">
        <p class="label" v-if="transfer.isRedeem">{{$t('sharedWalletHome.redeemOng')}}</p>
        <div class="asset-table" v-if="transfer.isRedeem">
            <div class="asset-item">
                <span class="font-medium">{{$t('sharedWalletHome.amount')}}</span>
                <span class="font-medium-black">{{redeem.claimableOng}} ONG</span>

            </div>
            <div class="fee font-medium-black">{{$t('sharedWalletHome.fee')}}: 0.05 ONG</div>
        </div>

        <p class="label" v-if="!transfer.isRedeem">{{$t('sharedWalletHome.send')}}</p>
        <div class="asset-table" v-if="!transfer.isRedeem">
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

        <div >
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
        </div>



        <div class="confirm-btns">
            <div class="btns-container">
                <a-button type="default" class="btn-cancel" @click="back">{{$t('sharedWalletHome.back')}}</a-button>
                <a-button type="primary" class="btn-next" @click="next">{{$t('sharedWalletHome.next')}}</a-button>
            </div>

        </div>
    </div>
</template>
<script>
import draggable from 'vuedraggable'
import {mapState} from 'vuex'
import dbService from '../../../core/dbService'
export default {
    name: 'SendConfirm',
    data() {
        const sharedWallet = JSON.parse(sessionStorage.getItem('sharedWallet'));
        const payers = sharedWallet.coPayers
        return {
            sharedWallet,
            payers,
            sponsorPayer:''
        }
    },
    mounted(){
        this.updateLocalCopayers()
    },
    components:{
        draggable
    },
    computed:{
        ...mapState({
            transfer: state => state.CurrentWallet.transfer,
            redeem: state => state.CurrentWallet.redeem
        }),
        localCopayers : {
            get() {
                const copayers = [...this.$store.state.CurrentWallet.localCopayers]
                return copayers.map(c => Object.assign({}, c, {value: c.address, label: c.name}))
            }
        }
    },
    methods: {
        updateLocalCopayers() {
            var that = this;
                const coPayers = this.sharedWallet.coPayers;
                const localCopayers = []
                dbService.find({type: {$in:['CommonWallet', 'HardwareWallet']}}, function (err, accounts) {
                    debugger
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
                        that.$store.commit('UPDATE_LOCAL_COPAYERS', {localCopayers})
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
            if(this.sponsorPayer) {
                const coPayers = [];
                coPayers.push(this.sponsorPayer);
                coPayers.push(...this.payers);
                const transfer = { coPayers };
                this.$store.commit('UPDATE_TRANSFER', { transfer })
                this.$emit('sendConfirmNext')
            }
        }
    }
}
</script>
