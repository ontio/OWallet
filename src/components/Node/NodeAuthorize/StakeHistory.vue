<style scoped>
.detail-link {
    text-align: center;
    cursor: pointer;
}
.detail-link i {
    font-size:20px;
}

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
.stake-btn-container {
    width: 540px;
    margin: 25px auto;
    text-align: center;
}
</style>

<template>
    <div>
        <breadcrumb :current="$t('nodeMgmt.stakeHistory')" v-on:backEvent="handleRouteBack"></breadcrumb>
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
            <div class="stake-btn-container">
                <!-- <p class="font-medium"><a-icon type="exclamation-circle" /> {{$t('nodeMgmt.userParticipate')}}</p> -->
                <a-button type="primary" class="btn-next" @click="handleSearch" :disabled="requesting">{{$t('nodeStake.search')}}</a-button>
            </div>
        </div>
        <a-table :columns="columns"
        :dataSource="stakeHistory"
        :loading="requesting"
        >
        <div slot="action" slot-scope="text, record" class="detail-link">
            <a-icon type="arrow-right" @click="handleAuthorizeLogin(record)"/>
        </div>

        </a-table>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import Breadcrumb from '../../Breadcrumb'

export default {
    name: 'StakeHistory',
    data() {
        const columns = [
            {
                title: this.$t('nodeMgmt.name'),
                dataIndex: 'name',
                key:'name'
            },
            // {
            //     title: this.$t('nodeMgmt.stakeWalletAddress'),
            //     dataIndex: 'stakeWalletAddress',
            //     key: 'stakeWalletAddress'
            // },

            {
                title: this.$t('nodeMgmt.inAuthorization'),
                dataIndex: 'inAuthorization',
                key: 'inAuthorization'
            },
            {
                title: this.$t('nodeMgmt.locked'),
                dataIndex: 'locked',
                key: 'locked'
            },
            {
                title: this.$t('nodeMgmt.claimableONT'),
                dataIndex: 'claimable',
                key: 'claimable'
            },
            
            {
                title: '',
                key: 'action',
                scopedSlots: {customRender:'action'}
            }
        ]
        return {
            columns,
            payerWalletType: 'commonWallet',
            payerWalletValue: undefined,
            stakeWallet:'',
            payerWallet: '',
            requesting: false
        }
    },
    components:{
        Breadcrumb
    },
    mounted() {
        // this.$store.commit('CLEAR_STAKE_HISTORY')
        this.$store.dispatch("fetchWalletsFromDb").then(() => {
            //set payer wallet 
        });
        // const stakeAuthorizationWalletAddress = this.$store.state.NodeAuthorization.stake_authorization_wallet;
        // if(stakeAuthorizationWalletAddress) {
        //     const index = this.$store.state.Wallets.NormalWallet.findIndex((w)=> w.address === stakeAuthorizationWalletAddress.address)
        //     if(index > -1) {
        //         this.payerWalletType = 'commonWallet'
        //         this.payerWalletValue = stakeAuthorizationWalletAddress
        //         this.payerWallet = this.$store.state.Wallets.NormalWallet[index]
        //     } else {    
        //         this.payerWalletType = 'ledgerWallet'
        //         this.$store.dispatch('getLedgerStatus')
        //     } 
        // }

    },
    beforeDestroy(){
        this.$store.dispatch('stopGetLedgerStatus')
    },
    computed: {
        ...mapState({
            ledgerStatus: state => state.LedgerConnector.ledgerStatus,
            ledgerPk : state => state.LedgerConnector.publicKey,
            ledgerWallet: state => state.LedgerConnector.ledgerWallet,
            stakeHistory: state => state.NodeAuthorization.stakeHistory,
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
        handleAuthorizeLogin(record, item){
            // this.$store.commit('UPDATE_STAKE_AUTHORIZATION_WALLET', {stakeWallet: this.stakeWallet})
            // this.$router.push({name: 'AuthorizeLogin'})
            this.$store.commit('UPDATE_CURRENT_NODE', {current_node : record})
            this.$store.commit('UPDATE_STAKE_AUTHORIZATION_WALLET', {stakeWallet: record.stakeWallet})          
            this.$router.push({name: 'AuthorizationMgmt'})
        },
        changePayerWallet(e) {
            this.payerWalletType = e.target.value
            if(e.target.value === 'ledgerWallet') {
                this.$store.dispatch('getLedgerStatus')
            }
        },
        handleChangePayer(value) {
            this.payerWallet = this.normalWalletAndLedgerWallet.find((v)=>{return v.address === value})
            this.payerWalletValue = this.payerWallet.address
        },
        handleSearch() {
            if(this.payerWalletType === 'commonWallet' && !this.payerWallet) {
                this.$message.error(this.$t('nodeStake.selectIndividualWallet'))
                return;
            }
            if(this.payerWalletType === 'ledgerWallet' && !this.ledgerWallet.address) {
                this.$message.error(this.$t('nodeStake.selectLedgerWallet'))
                return;
            }
            if(this.payerWalletType === 'commonWallet' && this.payerWallet){
                this.stakeWallet = this.payerWallet
            } else {
                this.stakeWallet = this.ledgerWallet
            }
            this.$store.commit('UPDATE_STAKE_WALLET', {stakeWallet: this.stakeWallet})  
            this.requesting = true;
            this.$store.dispatch('searchStakeHistory', {address: this.stakeWallet.address}).then(res => {
                this.requesting = false;
            })      
        }
    }
}
</script>
