<template>
	<div class="select-container">
		<a-select :options="normalWalletAndLedgerWallet"
			class="select-ontid"
			:placeholder="$t('createIdentity.selectCommonWallet')"
			@change="handleChangeWallet">
		</a-select>

		<!-- <a-radio-group @change="changePayerWallet"
			v-model="walletType"
			class="change-payer-radio">
			<a-radio value="commonWallet"
				class="payer-radio-item">{{$t('createIdentity.commonWallet')}}</a-radio>
			<a-radio value="ledgerWallet"
				class="payer-radio-item">{{$t('createIdentity.ledgerWallet')}}</a-radio>

			<div v-if="walletType === 'commonWallet'">
				<a-select :options="normalWalletAndLedgerWallet"
					class="select-ontid"
					:placeholder="$t('createIdentity.selectCommonWallet')"
					@change="handleChangeWallet">
				</a-select>
			</div>

			<div v-if="walletType === 'ledgerWallet'">

				<div class="payer-ledger-status">
					<div class="font-bold"
						style="margin-bottom: 10px;">{{$t('ledgerWallet.connectApp')}}</div>
					<span class="font-medium-black">{{$t('ledgerWallet.status')}}: </span>
					<span class="font-medium">{{ledgerStatus}} </span>
				</div>

			</div>

		</a-radio-group> -->
	</div>
</template>
<script>
import { mapState } from "vuex";
import {WALLET_TYPE}  from '../../core/consts'

export default {
	name: "SelectWallet",
	data: () => ({
		walletType: "commonWallet"
	}),
	props: {
		walletSelected: {}
	},
	created() {
		// this.$store.dispatch("fetchWalletsFromDb");
	},
	beforeDestroy() {
		// this.$store.dispatch("stopGetLedgerStatus");
	},
	computed: {
		...mapState({
			ledgerStatus: state => state.LedgerConnector.ledgerStatus,
			ledgerPk: state => state.LedgerConnector.publicKey,
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
						type: WALLET_TYPE.HardwareWallet,
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
	watch: {
		// ledgerPk(newV, oldV) {
		// 	if (newV) {
		// 		const wallet = this.ledgerWallet;
		// 		this.$emit("walletSelected", {
		// 			walletType: this.walletType,
		// 			wallet
		// 		});
		// 	}
		// }
	},
	methods: {
		// changePayerWallet(e) {
		// 	this.walletType = e.target.value;
		// 	if (e.target.value === "ledgerWallet") {
		// 		this.$store.dispatch("getLedgerStatus");
        //     } else {
		// 		this.$store.dispatch('stopGetLedgerStatus')
		// 	}
        //     this.$emit("walletSelected", {
		// 		walletType: this.walletType,
		// 		wallet: null
		// 	});
		// },
		handleChangeWallet(value) {
			const wallet = this.normalWalletAndLedgerWallet.find(v => {
				return v.address === value;
			});
			this.$emit("walletSelected", {
				walletType: wallet.type === WALLET_TYPE.HardwareWallet ? "ledgerWallet" : "commonWallet",
				wallet
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.label {
    
}
.change-payer-radio {
    width: 100%;
}
.payer-radio-item {
    margin-bottom: 10px;
}
</style>