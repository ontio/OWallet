<style scoped>
.auth-login {
    width:540px;
    margin:20px auto;
}
.select-wallet {
    width:100%;
}
.change-payer-radio {
    width:100%;
}
.payer-radio-item {
    margin-bottom:20px;
}
.btn-container {
    text-align: center;
    margin:5px auto;
    padding-top:15px;
}
.btn-container p {
    margin-bottom:5px;
}
</style>
<template>
    <div>
        <breadcrumb :current="$t('nodeMgmt.stakeAuthorization')" v-on:backEvent="handleRouteBack"></breadcrumb>
        <div class="auth-login">
            <div class="intro-item">
                <p class="font-medium-black">{{$t('nodeStake.selectStakeWallet')}}</p>
                <a-radio-group @change="changePayerWallet" v-model="payerWalletType" class="change-payer-radio">
                <a-radio value="commonWallet" class="payer-radio-item">{{$t('createIdentity.commonWallet')}}</a-radio>
                <a-radio value="ledgerWallet" class="payer-radio-item">{{$t('createIdentity.ledgerWallet')}}</a-radio>

                <div v-if="payerWalletType === 'commonWallet'">
                    <a-select :options="normalWallet" class="select-wallet" v-model="payerWalletValue"
                    :placeholder="$t('createIdentity.selectCommonWallet')"
                        @change="handleChangePayer">
                    </a-select>
                </div>

                <div v-if="payerWalletType === 'ledgerWallet'">

                    <div class="payer-ledger-status">
                    <div class="font-bold" style="margin-bottom: 10px;">{{$t('ledgerWallet.connectApp')}}</div>
                    <span class="font-medium-black">{{$t('ledgerWallet.status')}}: </span>
                    <span class="font-medium">{{ledgerStatus}} </span>
                    </div>
                    
                </div>
                </a-radio-group>
            </div>
        </div>
        <div class="footer-btns">
            <div class="btn-container">
                <!-- <p class="font-medium"><a-icon type="exclamation-circle" /> {{$t('nodeMgmt.userParticipate')}}</p> -->
                <a-button type="primary" class="btn-next" @click="next">{{$t('nodeStake.next')}}</a-button>
            </div>
        </div>
    </div>
</template>
<script>
import Breadcrumb from '../../Breadcrumb'
import {mapState} from 'vuex'
export default {
    name: 'AuthorizeLogin',
    components: {
        Breadcrumb
    },
    data(){
        return {
            payerWalletType: 'commonWallet',
            payerWalletValue: undefined
        }
    },
    mounted() {
        this.$store.dispatch("fetchWalletsFromDb").then(() => {
            //set payer wallet 
        });
        const stakeAuthorizationWalletAddress = this.$store.state.NodeAuthorization.stake_authorization_wallet;
        if(stakeAuthorizationWalletAddress) {
            const index = this.$store.state.Wallets.NormalWallet.findIndex((w)=> w.address === stakeAuthorizationWalletAddress.address)
            if(index > -1) {
                this.payerWalletType = 'commonWallet'
                this.payerWalletValue = stakeAuthorizationWalletAddress
                this.payerWallet = this.$store.state.Wallets.NormalWallet[index]
            } else {    
                this.payerWalletType = 'ledgerWallet'
                this.$store.dispatch('getLedgerStatus')
            } 
        }

    },
    beforeDestroy(){
        this.$store.dispatch('stopGetLedgerStatus')
    },
    computed: {
        ...mapState({
            ledgerStatus: state => state.LedgerConnector.ledgerStatus,
            ledgerPk : state => state.LedgerConnector.publicKey,
            ledgerWallet: state => state.LedgerConnector.ledgerWallet
        }),
        normalWallet: {
            get() {
                const list = this.$store.state.Wallets.NormalWallet.slice();
                return list.map(i => {
                    return Object.assign({}, i, {
                        label: i.label + " " + i.address,
                        value: i.address
                    });
                });
            }
        },
    },
    methods: {
        handleRouteBack() {
            this.$router.go(-1);
        },
        changePayerWallet(e) {
            this.payerWalletType = e.target.value
            if(e.target.value === 'ledgerWallet') {
                this.$store.dispatch('getLedgerStatus')
            } else {
                this.$store.dispatch('stopGetLedgerStatus')
            }
        },
        handleChangePayer(value) {
            this.payerWallet = this.normalWallet.find((v)=>{return v.address === value})
            this.payerWalletValue = this.payerWallet.address
        },
        next() {
            if(this.payerWalletType === 'commonWallet' && !this.payerWallet) {
                this.$message.error(this.$t('nodeStake.selectIndividualWallet'))
                return;
            }
            if(this.payerWalletType === 'ledgerWallet' && !this.ledgerPk) {
                this.$message.error(this.$t('nodeStake.selectLedgerWallet'))
                return;
            }
            let stakeWallet = ''
            if(this.payerWalletType === 'commonWallet' && this.payerWallet){
                stakeWallet = this.payerWallet
            } else {
                stakeWallet = this.ledgerWallet
            }
            this.$store.commit('UPDATE_STAKE_WALLET', {stakeWallet: stakeWallet})             
            this.$router.push({name: 'AuthorizationMgmt'})
        }
    }
}
</script>
