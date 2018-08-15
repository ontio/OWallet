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
    font-family: AvenirNext-Medium;
    font-size: 14px;
    color: #000000;
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

                <a-input type="password" class="input-pass" :placeholder="$t('sharedWalletHome.inputPassToTransfer')" v-model="password"></a-input>
            </div>
        <div class="input-btns">
            <a-button type="default" class="btn-cancel" @click="back">{{$t('sharedWalletHome.back')}}</a-button>
            <a-button type="primary" class="btn-next" @click="submit" >
                {{$t('sharedWalletHome.submit')}}
                </a-button>
        </div>
        </div>

    </div>
</template>

<script>
import {mapState} from 'vuex'
import draggable from 'vuedraggable'
import {OntAssetTxBuilder, Crypto, TransactionBuilder, utils} from 'ontology-ts-sdk'
import {ONT_PASS_NODE, ONT_PASS_NODE_PRD, ONT_PASS_URL, DEFAULT_SCRYPT} from '../../../../core/consts'
import axios from 'axios'
import dbService from '../../../../core/dbService'
import { BigNumber } from 'bignumber.js';

export default {
    name:'InputPassword',
    data() {
        const sharedWallet = JSON.parse(sessionStorage.getItem('sharedWallet'));
        return {
            sharedWallet,
            payers: [],
            password:'',
            sponsorWallet:null,
            checked: false,
            sending:false
        }
    },
    computed:{
        ...mapState({
            transfer: state => state.CurrentWallet.transfer
        })
    },

    mounted(){
        //to support update vuex data
        this.payers = this.transfer.coPayers;
        const that = this

        dbService.findOne({address: this.transfer.coPayers[0].address}, function(err, doc) {
            if(err) {
                console.log(err)
            }
            that.sponsorWallet = doc.wallet
        })
    },
    components:{
        draggable
    },
    methods:{
        back(){
            this.$emit('inputPassBack')
        },
        onChange(){
            this.checked = !this.checked;
        },
        submit() {
            if(!this.password || !this.checked) {
                this.$message.error(this.$t('common.confirmPwdTips'));
                return;
            }
            if(this.password && this.checked && !this.sending) {
            this.sending = true;
            //create transaction
            const tokenType = this.transfer.asset;
            const from = new Crypto.Address(this.sharedWallet.sharedWalletAddress)
            const to = new Crypto.Address(this.transfer.to);
            const amount = tokenType === 'ONT' ? this.transfer.amount : new BigNumber(this.transfer.amount).multipliedBy(1e9);
            const gasLimit = '20000';
            const gas = new BigNumber(this.transfer.gas).multipliedBy(1e9);
            const gasPrice = gas.div(gasLimit).toString();
            const tx = OntAssetTxBuilder.makeTransferTx(tokenType, from, to, amount, gasPrice, gasLimit, from);
            this.$store.dispatch('showLoadingModals')
            //sign tx
            const M = this.sharedWallet.requiredNumber;
            const pks = this.sharedWallet.coPayers.map(p => new Crypto.PublicKey(p.publickey))
            //sponsorWallet
            const enc = new Crypto.PrivateKey(this.sponsorWallet.key)
            let pri;
            try {
                pri = enc.decrypt(this.password, new Crypto.Address(this.sponsorWallet.address), this.sponsorWallet.salt, DEFAULT_SCRYPT)
            }catch(err) {
                this.$store.dispatch('hideLoadingModals')
                this.sending = false;
                console.log(err);
                this.$message.error(this.$t('common.pwdErr'))
                return;
            }
            TransactionBuilder.signTx(tx, M, pks, pri)
            const txHash = utils.reverseHex(tx.getHash());
            const txData = tx.serialize();
            //save transaction to backend
            const net = localStorage.getItem('net')
            const ontPassNode = net === 'TEST_NET' ? ONT_PASS_NODE : ONT_PASS_NODE_PRD
            const url = ontPassNode + ONT_PASS_URL.CreateSharedTransfer
            const body = {
                sendAddress: this.sharedWallet.sharedWalletAddress,
                receiveAddress: this.transfer.to,
                assetName: tokenType,
                amount: amount,
                gasLimit,
                gasPrice,
                transactionIdHash: txHash,
                transactionBodyHash: txData,
                coPayers: this.payers
            }
            axios.post(url, body).then(res => {
                console.log(res)
                if(res.status === 200) {
                    this.sending = false;
                    this.$emit('inputPassNext')
                    // //save signed tx
                    // const url2 = ONT_PASS_NODE + ONT_PASS_URL.SignSharedTransfer
                    // const body2 = {
                    //     transactionIdHash:txHash,
                    //     signedAddress: this.sponsorWallet.address,
                    //     signedHash: tx.serialize()
                    // }
                    // axios.post(url2, body2).then(res => {
                    //     if(res.status === 200) {
                    //         this.$emit('inputPassNext')
                    //     }
                    // })

                }
            }).catch(err => {
                this.$store.dispatch('hideLoadingModals')
                this.sending = false;
                console.log(err);
                this.$message.error(this.$t('common.networkErr'))
            })



            }
        }
    }
}
</script>


