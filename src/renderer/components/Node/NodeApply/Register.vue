<template>
	<div>
		<breadcrumb :current="$t('nodeApply.newNodeApply')"
			v-on:backEvent="back"></breadcrumb>
		<div class="app-container">
			<a-steps :current="current"
				class="create-steps">
				<a-step v-for="item in steps"
					:key="item.title" />
			</a-steps>
			<div class="steps-content">
				<div class="register-form"
					v-if="current === 0">
					<form>
						<div class="form-item">
							<label for="stakeWallet">{{$t('nodeApply.stakeWallet')}}</label>
							<select-wallet @walletSelected="onWalletSelected"></select-wallet>
						</div>

						<div class="form-item">
							<label for="stakeWallet">{{$t('nodeApply.operationWallet')}}</label>
							<a-select :options="normalWallet"
								class="select-ontid"
                                v-model="operationWallet"
								@change="onSelectOperationWallet"
								:placeholder="$t('nodeApply.selectOperationWallet')">
							</a-select>
						</div>

						<div class="form-item">
							<label for="">{{$t('nodeApply.stakeAmount')}}</label>
							<a-input v-model="stakeAmount"
								type="number"
								:placeholder="$t('nodeApply.inputStakeAmount')"></a-input>
						</div>
						<div class="footer-btns">
							<div class="btn-known">
								<a-button type="primary"
									class="btn-next"
									@click="next">{{$t('nodeApply.next')}}</a-button>
							</div>
						</div>
					</form>
				</div>
				<div class="register-confirm"
					v-if="current === 1">

					<div class="form-item">
						<label for="">{{$t('nodeApply.stakeWallet')}}</label>
						<p>{{stakeWallet.address}}</p>
					</div>
					<div class="form-item">
						<label for="">{{$t('nodeApply.operationWalletPublickey')}}</label>
						<p>{{operationWallet}}</p>
					</div>
					<div class="form-item">
						<label for="">{{$t('nodeApply.stakeAmount')}}</label>
						<p>{{stakeAmount}}</p>
					</div>
					<div class="footer-btns">
                        <div class="btn-container">
                            <a-button type="default"
							@click="cancel"
							class="btn-cancel">{{$t('nodeApply.cancel')}}</a-button>

                            <a-button type="primary"
                                    class="btn-next"
                                    @click="confirm">{{$t('nodeApply.ok')}}</a-button>
                        </div>
						
					</div>
				</div>
			</div>
		</div>
        <sign-send-tx :visible="signVisible" :tx="tx" :wallet="stakeWallet"
        v-on:signClose="handleTxCancel"
        v-on:txSent="handleTxSent"
        ></sign-send-tx>
	</div>

</template>
<script>
import Breadcrumb from "../../Breadcrumb";
import SelectWallet from "../../Common/SelectWallet";
import { Crypto, GovernanceTxBuilder } from "ontology-ts-sdk";
import SignSendTx from '../../Common/SignSendTx'
export default {
	name: "NodeApply",
	components: {
		Breadcrumb,
        SelectWallet,
        SignSendTx
	},
	data() {
		return {
			current: 0,
			steps: [{ title: "first" }, { title: "second" }],
			walletType: "",
			stakeWallet: {},
			operationWallet: undefined,
			stakeAmount: "",
            minStakeAmount: 10000,
            signVisible: false,
            tx: null
		};
	},
	created() {
		this.$store.dispatch("fetchWalletsFromDb");
	},
	computed: {
		normalWallet: {
			get() {
				const list = this.$store.state.Wallets.NormalWallet.slice();
				return list.map(i => {
					return Object.assign({}, i, {
						label: i.label + " " + i.address,
						value: i.publicKey
					});
				});
			}
		}
	},
	methods: {
		back() {
			this.$router.back();
		},
		onWalletSelected({ walletType, wallet }) {
			this.walletType = walletType;
			this.stakeWallet = wallet;
			this.onSelectOperationWallet();
		},
		next() {
			if (!this.stakeWallet) {
				this.$message.error(this.$t("nodeApply.stakeWalletRequired"));
				return;
			}
			if (!this.operationWallet) {
				this.$message.error(
					this.$t("nodeApply.operationWalletRequired")
				);
				return;
			}
			if (!this.stakeAmount) {
				this.$message.error(this.$t("nodeApply.stakeAmountRequired"));
				return;
			}
			if (Number(this.stakeAmount) < this.minStakeAmount) {
				this.$message.error(this.$t("nodeApply.minStateAmount"));
				return;
			}
			this.current += 1;
		},
		cancel() {
			this.current -= 1;
		},
		onSelectOperationWallet() {
            //TODO 同一个公钥智能注册一次节点
			if (this.stakeWallet && this.operationWallet) {
				const address = Crypto.Address.fromPubKey(
					new Crypto.PublicKey(this.operationWallet)
				).toBase58();
				if (this.stakeWallet.address === address) {
					this.$message.warning(
						this.$t("nodeApply.sameWalletNotAllowed")
					);
					this.operationWallet = null;
					return;
				}
			}
        },
        confirm() {
            const ontid = 'did:ont' + this.stakeWallet.address
            const publicKey = this.operationWallet
            const userAddr = new Crypto.Address(this.stakeWallet.address)
            const initPos = Number(this.stakeAmount)
            const tx = GovernanceTxBuilder.makeRegisterCandidateTx(ontid, publicKey, 1, userAddr, initPos, userAddr, '500', '200000')
            this.tx = tx;
            this.signVisible = true;
        },
        handleTxCancel() {
            this.signVisible = false;
            this.tx = null;
        },
        async handleTxSent() {
            // 注册成功后，更新off chain 表。后台同步到off chain表。同步可能有时差。
            this.$router.push({name: 'NodeApplySuccess'})
        }
	}
};
</script>
<style lang="scss" scoped>
.btn-known {
	margin: 20px auto;
	text-align: center;
}
.register-form,
.register-confirm {
	margin-top: 40px;
	.form-item {
		margin-bottom: 20px;
		label {
			font-family: AvenirNext-Medium;
			color: #000000;
		}
	}
}
.btn-container {
    width: 550px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>