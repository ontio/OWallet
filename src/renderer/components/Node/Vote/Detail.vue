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
					<div class="voted-approve">
						<p>
							<a-icon type="caret-up"
								class="icon-approve" /> 
                                <span class="total-voted">{{vote.approves}}</span> <span class="text-smal">votes</span>
						</p>
						<p class="my-voted"><span>Voted</span> <span class="added-votes"> +{{my_weight}}</span> </p>
					</div>
					<div class="voted-reject">
						<p>
							<a-icon type="caret-down"
								class="icon-reject" /> <span class="total-voted">{{vote.approves}}</span> <span class="text-smal">votes</span>
						</p>
						<!-- <p class="my-voted"><span>Voted</span>+{{16}}</p> -->
						<p class="vote-option">Vote Down</p>
					</div>
				</div>
				<div class="stop-btn">
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
						<a-tab-pane :tab="$t('vote.approval')" key="1">
							<a-table :columns="columns"
								:dataSource="approve_data">
							</a-table>
						</a-tab-pane>
						<a-tab-pane :tab="$t('vote.opposition')"
							key="2">
                            <a-table :columns="columns"
								:dataSource="reject_data">
							</a-table>
						</a-tab-pane>
					</a-tabs>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import SignSendTx from "../../Common/SignSendTx";
import { VOTE_STATUS_TEXT } from '../../../store/modules/Vote'

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
                dataIndex: 'name',
                key: 'name',
                title: this.$t('vote.name')
            },
            {
                dataIndex: 'address',
                key: 'address',
                title: this.$t('vote.address')
            },
            {
                dataIndex: 'weight',
                key: 'weight',
                title: this.$t('vote.votes')
            },
        ]
		return {
            routes,
            columns: [],
            approve_dta: [],
            reject_data: []
		};
	},
	computed: {
		...mapState({
			vote: state => state.Vote.currentVote,
			role: state => state.Vote.role,
			my_weight: state => state.Vote.my_weight
		})
	},
	methods: {
		back() {
			this.$router.back();
        },
        formatTime(dateTime) {
            const time = dateFormat(dateTime, 'yyyy-mm-dd HH:MM:ss')
            return time
        },
        formatStatus(vote) {
            const statusMap = {
                [VOTE_STATUS_TEXT.NOT_START]: this.$t('vote.notStart'),
                [VOTE_STATUS_TEXT.IN_PROGRESS]: this.$t('vote.inProgress'),
                [VOTE_STATUS_TEXT.FINISHED]: this.$t('vote.finished'),
                [VOTE_STATUS_TEXT.CANCELED]: this.$t('vote.canceled')
            }
            return statusMap[vote.statusText]
        },
	}
};
</script>
<style lang="scss" scoped>
.icon-approve {
    color:#4EB926
}
.icon-reject {
    color:#EA4545
}
.text-smal {
    font-size:14px;
    font-family:AvenirNext-Regular,AvenirNext;
    font-weight:400;
    color:rgba(0,0,0,1);
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
            font-size:18px;
            font-family:AvenirNext-DemiBold,AvenirNext;
            font-weight:600;
            color:rgba(0,0,0,1);
            margin-bottom:24px;
        }

	}
}
.voted-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom:23px;
    .voted-approve {
        margin-right: 32px;
        width:200px;
        height:86px;
        border-radius:6px;
        background: rgba(78, 185, 38, 0.1);
        padding:16px;
        border-bottom: 3px solid #4EB926;
        cursor: pointer;
        .my-voted {
            margin-top:5px;
            span {
                font-size:14px;
                font-family:AvenirNext-Regular,AvenirNext;
                font-weight:400;
            }
            span:first-child {
                color:rgba(78,185,38,1);
            }
            span:last-child {
                color:rgba(0,0,0,1);
                opacity: 0.4;
            }
        }
    }
    .voted-reject {
        width:200px;
        height:86px;
        border-radius:6px;    
        background: rgba(245, 247, 251, 1);
        padding-top:16px;
        padding:16px;    
        cursor: pointer;
        .total-voted {
            font-size:18px;
            font-family:AvenirNext-Regular,AvenirNext;
            font-weight:400;
            color:rgba(0,0,0,1);
            opacity: 0.4;
        }
        .text-smal {
            opacity: 0.4;
        }
        .vote-option {
            font-size:14px;
            font-family:AvenirNext-Regular,AvenirNext;
            font-weight:400;
            color:rgba(0,0,0,1);
            opacity: 0.4;
            margin-top:5px;
        }
    }
}
.stop-btn {
    width:432px;
    height:32px;
    background:rgba(244,244,246,1);
    border-radius:3px;
    font-size:14px;
    font-family:AvenirNext-Medium,AvenirNext;
    font-weight:500;
    color:rgba(234,69,69,1);
    text-align: center;
    line-height: 32px;
    cursor: pointer;
    margin-bottom:16px;
}

.content {
    font-size:16px;
    font-family:AvenirNext-Regular,AvenirNext;
    font-weight:400;
    color:rgba(0,0,0,1);
    opacity: 0.6;
}
.info-container {
    margin-bottom:22px;
    .title {
        font-size:16px;
        font-family:AvenirNext-Bold,AvenirNext;
        font-weight:bold;
        color:rgba(0,0,0,1);
        opacity: 0.6;
        border-bottom: 1px solid #F4F4F6;
    }
    .info-item {
        padding:10px 0;
        border-bottom: 1px solid #F4F4F6;
        display: flex;
        flex-direction: row;
        text-align: left;
        width:100%;
        word-break: break-all;
        span:first-child {
            width:200px;
            font-size:12px;
            font-family:AvenirNext-Medium,AvenirNext;
            font-weight:500;
            color:rgba(81,84,87,1);
        }
        span:last-child {
            flex:1;
            font-size:14px;
            font-family:AvenirNext-Regular,AvenirNext;
            font-weight:400;
            color:rgba(0,0,0,1);
        }
    }
}

</style>