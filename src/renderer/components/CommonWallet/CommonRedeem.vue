<style scoped>
.redeem-container {
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
</style>
<template>
    <div>
        <breadcrumb :current="$t('commonWalletHome.redeem')" :routes="routes"
                v-on:backEvent="backToWallets"></breadcrumb>
        <div class="redeem-container">
            <div class="label">
                {{$t('commonWalletHome.redeemCharge')}}
            </div>
            <div class="input-pass" v-if="type=== 'commonWallet'">
                <a-input type="password" class="input" :placeholder="$t('commonWalletHome.inputPass')" v-model="password"></a-input>
            </div>
            <div v-if="type === 'hardwareWallet'">
                Connect and open Ledger ONT app
            </div>
        </div>
        <div class="footer-btns">
            <div class="footer-btn-container">
                <a-button type="default" class="btn-cancel" @click="cancel">{{$t('commonWalletHome.cancel')}}</a-button>
                <a-button type="primary" class="btn-next" @click="submit" >
                    {{$t('commonWalletHome.submit')}}
                    </a-button>
            </div>
        </div>
        
    </div>
</template>

<script>
import Breadcrumb from '../Breadcrumb'
import {RestClient, Crypto,OntAssetTxBuilder, TransactionBuilder} from 'ontology-ts-sdk'
import { TEST_NET, MAIN_NET, ONT_CONTRACT, ONT_PASS_NODE, DEFAULT_SCRYPT } from '../../../core/consts'
import {mapState} from 'vuex'
export default {
    name: 'CommonRedeem',
    components: {
        Breadcrumb
    },
    data() {
        const net = localStorage.getItem('net');
        let url = ''
        if (net === 'TEST_NET') {
            url = TEST_NET + ':20334'
        } else {
            url = MAIN_NET + ':20334'
        }
        const type = this.$route.params.walletType
        const currentWallet = JSON.parse(sessionStorage.getItem('currentWallet'))
        const routes = [{name: currentWallet.label, path:'/dashboard'}]
        return {
            currentWallet,
            routes,
            type,
            password:'',
            nodeUrl: url
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
        submit() {
            if(!this.password) {
                this.$message.error(this.$t('commonWalletHome.emptyPass'))
                return;
            }
            const restClient = new RestClient(this.nodeUrl);
            if(this.type === 'commonWallet') {
                this.$store.dispatch('showLoadingModals')
                const from = new Crypto.Address(this.currentWallet.address);
                const to = from;
                const value = Number(this.redeem.claimableOng) * 1e9;
                const tx = OntAssetTxBuilder.makeWithdrawOngTx(from, to, value, from, '500', '20000');
                const enc = new Crypto.PrivateKey(this.currentWallet.key)
                let pri;
                try {
                    pri = enc.decrypt(this.password, from, this.currentWallet.salt, DEFAULT_SCRYPT)
                } catch (err) {
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
                this.$router.push({path:'/dashboard'})
                })
            } else {

            }
        }
    }
}
</script>


