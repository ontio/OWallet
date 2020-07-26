<template>
	<div class="nodes-container">
		<breadcrumb :current="$t('myNode.myNode')"
			v-on:backEvent="back"></breadcrumb>
		<ul class="nodes-list">
			<li v-for="(item, index) of myNodes"
				:key="index">
				<div class="node-item">
					<p class="node-name">{{item.name}}</p>
					<div class="info-item">
						<label for="">{{$t('myNode.stakeWalletAddress')}}</label>
						<p>{{item.stakeAddress}}</p>
					</div>
					<div class="info-item">
						<label for="">{{$t('myNode.operationWalletPk')}}</label>
						<p>{{item.publicKey}}</p>
					</div>
					<div class="btn-footer">
						<a-button class="btn-next" @click="onManage(item)">{{$t('myNode.manage')}}</a-button>
					</div>
				</div>
			</li>
			<li>
				<div class="node-item node-item-create"
					:class="[showCreate?'show-create-btn':'']"
					@mouseenter="()=>{this.showCreate = true;}"
					@mouseleave="()=>{this.showCreate = false;}">
					<div class="node-create"
						v-show="showCreate">
						<router-link class="btn btn-default btn-create"
							:to="{name: 'NodeApply'}">{{$t('myNode.applyNode')}}</router-link>
					</div>
					<img class="img-wallet-create"
						v-show="!showCreate"
						src="../../../assets/create-wallet.png"
						alt="">
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
import { mapState } from "vuex";
import { GovernanceTxBuilder } from "ontology-ts-sdk";
import { getNodeUrl } from "../../../core/utils";
import { OFF_CHAIN_NODES, GovernanceStatus } from "../../../core/consts";
import axios from "axios";
import Breadcrumb from "../../Breadcrumb";

export default {
	name: "MyNode",
	data() {
		return {
			myNodes: [],
			showCreate: true
		};
	},
	components: {
		Breadcrumb
	},
	created() {
		this.$store.dispatch("fetchWalletsFromDb");
	},
	computed: {
        localWallets: {
            get() {
                const list1 = this.$store.state.Wallets.NormalWallet.slice();
                const list2 = this.$store.state.Wallets.HardwareWallet.slice();
                return [...list1, ...list2]
            }
        }
	},
	watch: {
		localWallets(newV, oldV) {
			if (newV && newV.length > 0) {
				this.fetchMyNodes();
			}
		},
	},
	methods: {
		back() {
			this.$router.back();
        },
        // 先从off_chain 接口查询所有节点，用节点的stake address跟本地钱包（普通钱包和ledger钱包）的地址比对，
        // 找出用户的节点，同时找出stake wallet，节点的运营公钥也能从接口获取到。
        // 再将用户的节点跟链上的peerPoolMap进行比对，获取节点的状态。如果节点不在peerPoolMap中，表示节点已经退出
		async fetchMyNodes() {
            this.$store.dispatch('showLoadingModals')
            const url = getNodeUrl();
			const peers = await GovernanceTxBuilder.getPeerPoolMap(url);
			const mynodes = [];
            const net = localStorage.getItem("net");
			const off_chain_nodes_url = OFF_CHAIN_NODES[net];
			const res = await axios.get(off_chain_nodes_url);
            const result = res.data.result;

            for(const wallet of this.localWallets) {
                for(const resItem of result) {
                    if(wallet.address === resItem.address) {
                        const node ={
                            publicKey: resItem.public_key,
                            stakeAddress: wallet.address,
                            stakeWallet: wallet,
                            name: resItem.name || "Node_" + resItem.public_key.substr(0, 6)
                        }
                        const peerOnchain = peers[resItem.public_key]
                        if(peerOnchain) {
                            node.stakeAmount = peerOnchain.initPos + peerOnchain.totalPos
                            node.status = peerOnchain.status
                        } else {
                            node.stakeAmount = 0 // 已退出节点
                            node.status = GovernanceStatus.EXIXTED
                        }
                        mynodes.push(node)
                    }
                }
            }

            this.myNodes = mynodes;
            this.$store.dispatch('hideLoadingModals')
        },
        onManage(node) {
            this.$store.commit('UPDATE_STAKE_WALLET', {stakeWallet: node.stakeWallet})
            this.$store.commit('UPDATE_NODE_PUBLICKEY', {nodePublicKey: node.publicKey})
            this.$store.commit('UPDATE_NODE_STATUS', {status: node.status})
            this.$router.push({name: 'NodeStakeManagement'})
        }
	}
};
</script>
<style lang="scss" scoped>
.nodes-list {
	display: flex;
	flex-wrap: wrap;
	list-style: none;
}
.node-item {
	.node-name {
		font-family: AvenirNext-Medium;
		font-size: 18px;
		color: #515457;
		margin-bottom: 15px;
	}
	background-color: #f5f7fb;
	padding: 1.25rem;
	position: relative;
	width: 440px;

	margin-right: 40px;
	margin-bottom: 40px;
	height: 250px;
	.info-item {
		margin-bottom: 15px;
		font-family: AvenirNext-Regular;
		font-size: 14px;
		color: #b2b2b3;
		p {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.btn-footer {
		text-align: right;
	}
}
.show-create-btn {
	background-color: #498fef;
}
.node-item-create {
	display: flex;
	justify-content: center;
	align-items: center;
}
.btn-create {
	color: white;
	border: white solid 1px;
	border-radius: 0;
}
</style>
