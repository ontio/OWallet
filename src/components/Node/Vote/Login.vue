<template>
    <div>
        <breadcrumb :routes="routes" :current="$t('vote.login')" v-on:backEvent="back"></breadcrumb>
        <div class="auth-login">
            <div class="intro-item">
                <p class="font-medium-black">{{$t('vote.selectWallet')}}</p>
                <a-radio-group @change="changeVoteWallet" v-model="voteWalletType" class="change-payer-radio">
                <a-radio value="commonWallet" class="payer-radio-item">{{$t('createIdentity.commonWallet')}}</a-radio>
                <a-radio value="ledgerWallet" class="payer-radio-item">{{$t('createIdentity.ledgerWallet')}}</a-radio>

                <div v-if="voteWalletType === 'commonWallet'">
                    <a-select :options="normalWallet" class="select-wallet" v-model="voteWalletValue"
                    :placeholder="$t('createIdentity.selectCommonWallet')"
                        @change="handleChangePayer">
                    </a-select>
                </div>

                <div v-if="voteWalletType === 'ledgerWallet'">

                    <div class="payer-ledger-status">
                    <div class="font-bold" style="margin-bottom: 10px;">{{$t('ledgerWallet.connectApp')}}</div>
                    <span class="font-medium-black">{{$t('ledgerWallet.status')}}: </span>
                    <span class="font-medium">{{ledgerStatus}} </span>
                    </div>
                    
                </div>
                </a-radio-group>
                <div class="import-tip">
                    <span>{{$t('vote.notSeeWallet')}} </span>
                    <span @click="hereImport">{{$t('vote.importHere')}}</span>
                </div>
                <a-button type="primary" class="btn-next" @click="next">{{$t('nodeStake.next')}}</a-button>
            </div>
        </div>
    </div>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb'
import {mapState} from 'vuex'

export default {
    name: 'VoteLogin',
    components: {
        Breadcrumb
    },
    data() {
        const routes = [{name: this.$t('vote.node'), path:'/node'}]
        return {
            routes,
            voteWalletType: 'commonWallet',
            voteWallet: '',
            voteWalletValue: ''
        }
    },
    mounted() {
        this.$store.dispatch("fetchWalletsFromDb").then(() => {
            //set payer wallet 
        });
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
        back() {
            this.$router.back()
        },
        hereImport() {
            this.$router.push('/Wallets/importJsonWallet')
        },
        changeVoteWallet(e) {
            this.voteWalletType = e.target.value
            if(e.target.value === 'ledgerWallet') {
                this.$store.dispatch('getLedgerStatus')
            } else {
                this.$store.dispatch('stopGetLedgerStatus')
            }
        },
        handleChangePayer(value) {
            this.voteWallet = this.normalWallet.find((v)=>{return v.address === value})
            this.voteWalletValue = this.voteWallet.address
        },
        next() {
            if(this.voteWalletType === 'commonWallet' && !this.voteWallet) {
                this.$message.error(this.$t('nodeStake.selectIndividualWallet'))
                return;
            }
            if(this.voteWalletType === 'ledgerWallet' && !this.ledgerWallet.address) {
                this.$message.error(this.$t('nodeStake.selectLedgerWallet'))
                return;
            }
            let wallet = ''
            if(this.voteWalletType === 'commonWallet' && this.voteWallet){
                wallet = this.voteWallet
            } else {
                wallet = this.ledgerWallet
            }
            this.$store.commit('UPDATE_VOTE_WALLET', {voteWallet: wallet})    
            this.$store.commit('UPDATE_VOTE_WALLET_TYPE', {type: this.voteWalletType})         
            this.$router.push({name: 'VoteList'})
        }
    }
}
</script>
<style lang="scss" scoped>
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
.import-tip {
    text-align: right;
    font-size:12px;
    font-family:AvenirNext-Regular,AvenirNext;
    font-weight:400;
    
    margin-top: 4px;
    
    span:first-child {
        color:rgba(0,0,0,1);
        opacity: 0.6;
    }
    span:last-child {
        opacity: 1 !important;
        font-weight:400;
        color:rgba(25,107,216,1);
        text-decoration: underline;
        cursor: pointer;
    }

}
</style>