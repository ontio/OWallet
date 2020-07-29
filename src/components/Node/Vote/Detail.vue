<template>
	<div>
		<breadcrumb :routes="routes"
			:current="$t('vote.votingDetail')"
			v-on:backEvent="back"></breadcrumb>
		<div class="detail-container">
			<div class="left-part">
				<div class="title">
					{{vote.title}}
				</div>
				<div class="voted-container">

					<div class="visiter-approve"
						v-if="!isVoter">
						<a-icon type="caret-up"
							class="icon-approve" />
						<span class="total-voted">{{vote.approves}}</span>
						<span class="text-smal">votes</span>
					</div>
					<div class="short-line"
						v-if="!isVoter"></div>
					<div class="visiter-reject"
						v-if="!isVoter">
						<a-icon type="caret-down"
							class="icon-reject" />
						<span class="total-voted">{{vote.rejects}}</span>
						<span class="text-smal">votes</span>
					</div>

					<div class="not-voted"
						v-if="isVoter"
						@click="onApprove"
						:class="{'voted-approve': myVoted === MY_VOTED.APPROVED}">
						<p>
							<a-icon type="caret-up"
								class="icon-approve" />
							<span :class="{'my-voted-text': myVoted === MY_VOTED.APPROVED}"
								class="total-voted">{{vote.approves}}</span>
							<span :class="{'my-voted-text': myVoted === MY_VOTED.APPROVED}"
								class="text-smal">votes</span>
						</p>
						<p class="vote-option"
							v-if="myVoted !== MY_VOTED.APPROVED ">Vote Up</p>
						<p class="my-voted my-voted-approve"
							v-if="myVoted === MY_VOTED.APPROVED ">
							<span>Voted</span> <span class="added-votes"> +{{my_weight}}</span>
						</p>
					</div>
					<div class="not-voted"
						v-if="isVoter"
						@click="onReject"
						:class="{'voted-reject': myVoted === MY_VOTED.REJECTED}">
						<p>
							<a-icon type="caret-down"
								class="icon-reject" />
							<span :class="{'my-voted-text': myVoted === MY_VOTED.REJECTED}"
								class="total-voted">{{vote.rejects}}</span>
							<span :class="{'my-voted-text': myVoted === MY_VOTED.REJECTED}"
								class="text-smal">votes</span>
						</p>
						<p class="my-voted my-voted-reject"
							v-if="myVoted === MY_VOTED.REJECTED ">
							<span>Voted</span> <span class="added-votes"> +{{my_weight}}</span>
						</p>
						<p class="vote-option"
							v-if="myVoted !== MY_VOTED.REJECTED ">Vote Down</p>
					</div>
				</div>
				<div class="stop-btn"
					@click="onStop"
					v-if="vote.admin === voteWallet.address">
					{{$t('vote.stopVote')}}
				</div>
				<div class="content">
					{{vote.content}}
				</div>
			</div>
			<div class="right-part">
				<div class="info-container">
					<p class="title">{{$t('vote.info')}}</p>
					<div class="info-item">
						<span>{{$t('vote.startTime')}}</span>
						<span>{{formatTime(vote.startTime)}}</span>
					</div>
					<div class="info-item">
						<span>{{$t('vote.endTime')}}</span>
						<span>{{formatTime(vote.endTime)}}</span>
					</div>
					<div class="info-item">
						<span>{{$t('vote.hash')}}</span>
						<span>{{vote.hash}}</span>
					</div>
					<div class="info-item">
						<span>{{$t('vote.creatorAddress')}}</span>
						<span>{{vote.admin}}</span>
					</div>
					<div class="info-item">
						<span>{{$t('vote.votingStatus')}}</span>
						<span>{{formatStatus(vote)}}</span>
					</div>
					<div class="info-item">
						<span>{{$t('vote.myVotes')}}</span>
						<span>{{my_weight}}</span>
					</div>
				</div>
				<div class="records-container">
					<a-tabs defaultActiveKey="1">
						<a-tab-pane :tab="$t('vote.approval')"
							key="1">
							<a-table :columns="columns"
								:dataSource="approve_data"
								:pagination="false"
                                :bordered="false"
								size="small">
							</a-table>
						</a-tab-pane>
						<a-tab-pane :tab="$t('vote.opposition')"
							key="2">
							<a-table :columns="columns"
								:dataSource="reject_data"
								:pagination="false"
                                :bordered="false"
								size="small">
							</a-table>
						</a-tab-pane>
					</a-tabs>
				</div>
			</div>
		</div>

		<sign-send-tx :visible="signVisible"
			:tx="tx"
			:wallet="voteWallet"
			v-on:signClose="handleCancel"
			v-on:txSent="handleTxSent"></sign-send-tx>
	</div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import SignSendTx from "../../Common/SignSendTx";
import { VOTE_STATUS_TEXT, MY_VOTED } from "../../../store/modules/Vote";

import { mapState } from "vuex";
var dateFormat = require("dateformat");

export default {
	name: "VoteCreate",
	components: {
		Breadcrumb,
		SignSendTx
	},
	data() {
		const routes = [
			{ name: this.$t("vote.node"), path: "/node" },
			{ name: this.$t("vote.votingTopics"), path: "/vote/votes" }
		];
		const columns = [
			{
				dataIndex: "name",
				key: "name",
				title: this.$t("vote.name")
			},
			{
				dataIndex: "address",
				key: "address",
				title: this.$t("vote.address"),
				width: "100px"
			},
			{
				dataIndex: "weight",
				key: "weight",
				title: this.$t("vote.votes")
			}
		];
		return {
			routes,
			columns,
			approve_data: [],
			reject_data: [],
			myVoted: "",
			MY_VOTED,
			isVoter: false,
			signVisible: false,
			tx: ""
		};
	},
	computed: {
		...mapState({
			vote: state => state.Vote.currentVote,
			role: state => state.Vote.role,
			my_weight: state => state.Vote.my_weight,
			voteWallet: state => state.Vote.voteWallet,
			votedRecords: state => state.Vote.current_vote_records
		})
	},
	mounted() {
		window.scroll(0, 0);
		this.refresh();
		this.intervalId = setInterval(() => {
			this.refresh();
		}, 10 * 1000);
	},
	beforeDestroy() {
		clearInterval(this.intervalId);
	},
	watch: {
		votedRecords: function(newVal, oldVal) {
			this.approve_data = newVal.filter(item => item.isApproval);
			this.reject_data = newVal.filter(item => !item.isApproval);
		}
	},
	methods: {
		back() {
			this.$router.back();
		},
		formatTime(dateTime) {
			const time = dateFormat(dateTime, "yyyy-mm-dd HH:MM:ss");
			return time;
		},
		formatStatus(vote) {
			const statusMap = {
				[VOTE_STATUS_TEXT.NOT_START]: this.$t("vote.notStart"),
				[VOTE_STATUS_TEXT.IN_PROGRESS]: this.$t("vote.inProgress"),
				[VOTE_STATUS_TEXT.FINISHED]: this.$t("vote.finished"),
				[VOTE_STATUS_TEXT.CANCELED]: this.$t("vote.canceled")
			};
			return statusMap[vote.statusText];
		},
		refresh() {
			const hash = this.vote.hash;
			const address = this.voteWallet.address;
			this.$store
				.dispatch("getVotedInfo", { hash, address })
				.then(res => {
					this.myVoted = res;
				});
			this.$store.dispatch("isVoter", { hash }).then(res => {
				this.isVoter = res;
			});
			this.$store.dispatch("getVotedRecords", { hash });
			this.$store.dispatch("updateCurrentVote", { hash });
		},
		handleCancel() {
			this.signVisible = false;
			this.tx = "";
		},
		handleTxSent() {
			this.signVisible = false;
			// 更新页面数据
			setTimeout(() => {
				this.refresh();
			}, 3000);
		},
		onApprove() {
			if (this.myVoted === this.MY_VOTED.APPROVED) {
				return;
			}
			if (this.vote.statusText !== VOTE_STATUS_TEXT.IN_PROGRESS) {
				this.$message.warning(
					this.$t("vote.notAllowVote") + this.formatStatus(this.vote)
				);
				return;
			}
			this.$store
				.dispatch("submitVote", {
					type: true,
					hash: this.vote.hash
				})
				.then(tx => {
					this.tx = tx;
					this.signVisible = true;
				});
		},
		onReject() {
			if (this.myVoted === this.MY_VOTED.REJECTED) {
				return;
			}
			if (this.vote.statusText !== VOTE_STATUS_TEXT.IN_PROGRESS) {
				this.$message.warning(
					this.$t("vote.notAllowVote") + this.formatStatus(this.vote)
				);
				return;
			}
			this.$store
				.dispatch("submitVote", {
					type: false,
					hash: this.vote.hash
				})
				.then(tx => {
					this.tx = tx;
					this.signVisible = true;
				});
		},
		onStop() {
			if (
				this.vote.statusText === VOTE_STATUS_TEXT.CANCELED ||
				this.vote.statusText === VOTE_STATUS_TEXT.FINISHED
			) {
				this.$message.warning(
					this.$t("vote.notAllowStop") + this.formatStatus(this.vote)
				);
				return;
			}
			this.$store
				.dispatch("stopVote", {
					hash: this.vote.hash
				})
				.then(tx => {
					this.tx = tx;
					this.signVisible = true;
				});
		}
	}
};
</script>
<style lang="scss" scoped>
.icon-approve {
	color: #4eb926;
}
.icon-reject {
	color: #ea4545;
}
.text-smal {
	font-size: 14px;
	font-family: AvenirNext-Regular, AvenirNext;
	font-weight: 400;
	color: rgba(0, 0, 0, 1);
}

.detail-container {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	.left-part {
		width: 50%;
		margin-right: 50px;
		.title {
			font-size: 18px;
			font-family: AvenirNext-DemiBold, AvenirNext;
			font-weight: 600;
			color: rgba(0, 0, 0, 1);
			margin-bottom: 24px;
		}
	}
	.right-part {
		width: 50%;
	}
}
.visiter-approve {
	min-width: 120px;
	margin-right: 24px;
}
.visiter-reject {
	min-width: 120px;
	margin-left: 24px;
}
.short-line {
	width: 1px;
	height: 22px;
	background: rgba(244, 244, 246, 1);
}
.voted-container {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	margin-bottom: 23px;
	.voted-approve {
		margin-right: 32px;
		width: 200px;
		height: 86px;
		border-radius: 6px;
		background: rgba(78, 185, 38, 0.1);
		padding: 16px;
		border-bottom: 3px solid #4eb926;
		cursor: pointer;
	}
	.my-voted {
		margin-top: 5px;
		span {
			font-size: 14px;
			font-family: AvenirNext-Regular, AvenirNext;
			font-weight: 400;
		}
		span:last-child {
			color: rgba(0, 0, 0, 1);
			opacity: 0.4;
		}
	}
	.my-voted-approve {
		span:first-child {
			color: rgba(78, 185, 38, 1);
		}
    }
	.my-voted-reject {
		span:first-child {
			color: rgba(234, 69, 69, 1);
		}
	}
	.not-voted {
		width: 200px;
		height: 86px;
		border-radius: 6px;
		background: rgba(245, 247, 251, 1);
		padding-top: 16px;
		padding: 16px;
		cursor: pointer;
		margin-right: 32px;
	}
	.not-voted:hover {
		background: #e4e6ea;
	}
	.voted-reject {
		background: rgba(234, 69, 69, 0.1);
		border-bottom: 3px solid #ea4545;
		cursor: default;
	}
	.voted-approve {
		background: rgba(78, 185, 38, 0.1);
		border-bottom: 3px solid #4eb926;
		cursor: default;
    }
    .voted-reject:hover {
        background: rgba(234, 69, 69, 0.1);
    }
    .voted-approve:hover {
        background: rgba(78, 185, 38, 0.1);
    }
	.total-voted {
		font-size: 18px;
		font-family: AvenirNext-Regular, AvenirNext;
		font-weight: 400;
		color: rgba(0, 0, 0, 1);
		opacity: 0.4;
	}
	.text-smal {
		opacity: 0.4;
	}
	.vote-option {
		font-size: 14px;
		font-family: AvenirNext-Regular, AvenirNext;
		font-weight: 400;
		color: rgba(0, 0, 0, 1);
		opacity: 0.4;
		margin-top: 5px;
	}
}
.stop-btn {
	width: 432px;
	height: 32px;
	background: rgba(244, 244, 246, 1);
	border-radius: 3px;
	font-size: 14px;
	font-family: AvenirNext-Medium, AvenirNext;
	font-weight: 500;
	color: rgba(234, 69, 69, 1);
	text-align: center;
	line-height: 32px;
	cursor: pointer;
	margin-bottom: 16px;
}

.stop-btn:hover {
    background: #e4e6ea;
}

.content {
	font-size: 16px;
	font-family: AvenirNext-Regular, AvenirNext;
	font-weight: 400;
	color: rgba(0, 0, 0, 1);
	opacity: 0.6;
}
.info-container {
	margin-bottom: 22px;
	.title {
		font-size: 16px;
		font-family: AvenirNext-Bold, AvenirNext;
		font-weight: bold;
		color: rgba(0, 0, 0, 1);
		opacity: 0.6;
		border-bottom: 1px solid #f4f4f6;
	}
	.info-item {
		padding: 10px 0;
		border-bottom: 1px solid #f4f4f6;
		display: flex;
		flex-direction: row;
		text-align: left;
		width: 100%;
		word-break: break-all;
		span:first-child {
			width: 200px;
			font-size: 12px;
			font-family: AvenirNext-Medium, AvenirNext;
			font-weight: 500;
			color: rgba(81, 84, 87, 1);
		}
		span:last-child {
			flex: 1;
			font-size: 14px;
			font-family: AvenirNext-Regular, AvenirNext;
			font-weight: 400;
			color: rgba(0, 0, 0, 1);
		}
	}
}
.my-voted-text {
	opacity: 1 !important;
}
</style>