<template>
<div>
	<div v-if="!registerSucceed">
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
					v-show="current === 0">
					<div class="proxy-tip">
						<span>{{$t('nodeApply.proxyServiceTip')}}</span>
						<span @click="onProxyLink" class="proxy-link">{{$t('nodeApply.proxyServiceLink')}}</span>
					</div>
					<form>
						<div class="form-item">
							<label for="stakeWallet">{{$t('nodeApply.stakeWallet')}}</label>
							<select-wallet @walletSelected="onWalletSelected"></select-wallet>
						</div>

						<div class="form-item">
							<label for="stakeWallet">{{$t('nodeApply.operationWallet')}}</label>
							<a-tabs default-active-key="1" type="card" >
								<a-tab-pane key="1" :tab="$t('nodeApply.selectOperationWallet')">
									<a-select :options="normalWallet"
										class="select-ontid"
										v-model="operationWallet"
										@change="onSelectOperationWallet"
										:placeholder="$t('nodeApply.selectOperationWallet')">
									</a-select>
								</a-tab-pane>
								<a-tab-pane key="2" :tab="$t('nodeApply.enterOperationPk')" >
									<a-input v-model="operationPk" 
									@blur="onSelectOperationWallet"
									:placeholder="$t('nodeApply.enterOperationPk')"></a-input>
								</a-tab-pane>
								
							</a-tabs>
							
							
						</div>

						<div class="form-item">
							<label for="">{{$t('nodeApply.stakeAmount')}}</label>
							<a-input v-model="stakeAmount"
								type="number" 
								:class="validAmount ? '' : 'error-input' "
								@change="validateAmount"
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
					v-show="current === 1">

					<div class="form-item">
						<label for="">{{$t('nodeApply.stakeWallet')}}</label>
						<p>{{stakeWallet.address}}</p>
					</div>
					<div class="form-item">
						<label for="">{{$t('nodeApply.operationWalletPublickey')}}</label>
						<p>{{operationWallet || operationPk}}</p>
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
	<div class="success-container" v-if="registerSucceed">
        <img :src="require('../../../assets/success.svg')" alt="">
        <p class="success-tip">{{$t('nodeApply.registerSuccess')}}</p>
        <a-button class="btn-next" @click="onComplete">{{$t('nodeApply.completeNodeInfo')}}</a-button>
        <p class="later-tip" @click="onLater">{{$t('nodeApply.later')}}</p>
    </div>
</div>
</template>
<script>
import Breadcrumb from "../../Breadcrumb";
import SelectWallet from "../../Common/SelectWallet";
import { Crypto, GovernanceTxBuilder } from "ontology-ts-sdk";
import SignSendTx from '../../Common/SignSendTx'
import { open, varifyPositiveInt } from '../../../../core/utils'

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
			operationPk: '',
			stakeAmount: "",
            minStakeAmount: 10000,
            signVisible: false,
			tx: null,
			registerSucceed: false,
			validAmount: true
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
			this.stakeWallet = wallet ? wallet : {};
			this.onSelectOperationWallet();
		},
		next() {
			if (!this.stakeWallet.address) {
				this.$message.error(this.$t("nodeApply.stakeWalletRequired"));
				return;
			}
			if (!this.operationWallet && !this.operationPk) {
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
			if(!this.validAmount) {
				return;
			}
			this.current += 1;
			this.$store.dispatch('stopGetLedgerStatus') // 防止过多ledger请求
		},
		cancel() {
			this.current -= 1;
		},
		onSelectOperationWallet() {
            //TODO 同一个公钥智能注册一次节点
			if (this.stakeWallet && (this.operationWallet || this.operationPk )) {
				let address;
				try {
					address = Crypto.Address.fromPubKey(
					this.operationWallet ? new Crypto.PublicKey(this.operationWallet)
						: new Crypto.PublicKey(this.operationPk)
				).toBase58();
				} catch(err) {
					console.log(err)
					this.$message.warning(this.$t('nodeApply.invalidOperationPk'))
					this.operationPk = ''
					return;
				}
				 
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
            const publicKey = this.operationWallet ? this.operationWallet : this.operationPk
            const userAddr = new Crypto.Address(this.stakeWallet.address)
            const initPos = Number(this.stakeAmount)
            const tx = GovernanceTxBuilder.makeRegisterCandidateTx(ontid, publicKey, 1, userAddr, initPos, userAddr, '2500', '200000')
            this.tx = tx;
            this.signVisible = true;
        },
        handleTxCancel() {
            this.signVisible = false;
            this.tx = null;
        },
        async handleTxSent() {
            // 注册成功后，更新off chain 表。后台同步到off chain表。同步可能有时差。
			// this.$router.push({name: 'NodeApplySuccess'})
			this.registerSucceed = true
		},
		
		async onComplete() { // 进入节点管理页面且打开信息填写的tab
			const nodePk = this.operationWallet ? this.operationWallet : this.operationPk
			await this.$store.dispatch('newStakeInfo', {
				name: 'Node_' + nodePk.substr(0, 6),
				address: this.stakeWallet.address,
				public_key: nodePk
			})
            this.$store.commit('UPDATE_STAKE_WALLET', {stakeWallet: this.stakeWallet})
            this.$store.commit('UPDATE_NODE_PUBLICKEY', {nodePublicKey: nodePk})
			this.$store.commit('UPDATE_MENU_TAB_INDEX', 3)
			this.$router.push({name: 'NodeStakeManagement'})
        },
        onLater() {
            this.$router.push({name: 'MyNode'})
		},
		onProxyLink() {
			const url = 'http://triones-node.store.ont.io/'
			open(url)
		},
		validateAmount() {

			if(this.stakeAmount && !varifyPositiveInt(this.stakeAmount)) {
                this.validAmount = false;
                return;
			}
			this.validAmount = true
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
.success-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin-top: -4rem;
    img {
        width: 80px;
        height: 80px;
        margin-bottom: 20px;
    }
    .success-tip {
        font-size:24px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(0,0,0,1);
        margin-bottom: 40px;
    }
    button {
        margin-bottom: 23px;
    }
    .later-tip {
        font-size:14px;
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(0,0,0,.6);
        cursor: pointer;
        text-decoration: underline;
    }
}
.proxy-tip {
	text-align: left;
    font-size: 12px;
    font-family: AvenirNext-Regular,AvenirNext;
    font-weight: 400;
    margin-top: 4px;
	span:first-child {
		color: #000;
    	opacity: 0.6;
	}
	span:last-child {
		opacity: 1 !important;
		font-weight: 400;
		color: #196bd8;
		text-decoration: underline;
		cursor: pointer;
	}
}
</style>