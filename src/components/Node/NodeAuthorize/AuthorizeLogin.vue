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
                <p class="font-medium-black" style="margin-bottom: 10px">{{$t('nodeStake.selectStakeWallet')}}</p>

                <div>
                    <a-select :options="normalWalletAndLedgerWallet" class="select-wallet" v-model="payerWalletValue"
                    :placeholder="$t('createIdentity.selectCommonWallet')"
                        @change="handleChangePayer">
                    </a-select>
                </div>
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
                this.payerWalletValue = stakeAuthorizationWalletAddress
                this.payerWallet = this.$store.state.Wallets.NormalWallet[index]
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

		normalWalletAndLedgerWallet: {
			get() {
				const NormalList = this.$store.state.Wallets.NormalWallet.slice();
				const LedgerList = this.$store.state.Wallets.HardwareWallet.slice();

				const list1 = NormalList.map(i => {
					return Object.assign({}, i, {
						label: i.label + " " + i.address,
						value: i.address
					});
				});

				const list2 = LedgerList.map(i => {
					return Object.assign({}, i, {
						label: i.label + " " + i.address + " (Ledger)",
						value: i.address
					});
				});
                list2.sort((a,b)=>{
					if (b.timestamp !== a.timestamp) {
						return b.timestamp - a.timestamp;
					} else {
						return b.acct - a.acct;
					}
				})

				return [...list1, ...list2];
			}
		}
    },
    methods: {
        handleRouteBack() {
            this.$router.go(-1);
        },
        handleChangePayer(value) {
            this.payerWallet = this.normalWalletAndLedgerWallet.find((v)=>{return v.address === value})
            this.payerWalletValue = this.payerWallet.address
        },
        next() {
            if(!this.payerWallet) {
                this.$message.error(this.$t('nodeStake.selectIndividualWallet'))
                return;
            }

            let stakeWallet = this.payerWallet
            this.$store.commit('UPDATE_STAKE_WALLET', {stakeWallet: stakeWallet})             
            this.$router.push({name: 'AuthorizationMgmt'})
        }
    }
}
</script>
