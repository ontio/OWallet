<template>
	<div>
        <breadcrumb :routes="routes" :current="$t('vote.votingTopics')" v-on:backEvent="back"></breadcrumb>
        <div class="top-menu-container" v-if="role.indexOf(VOTE_ROLE.ADMIN) > -1">
            <a-menu v-model="current" mode="horizontal" @click="handleSelectMenu">
                <a-menu-item v-for="menu in menus" :key="menu.key">{{menu.name}}</a-menu-item>
            </a-menu>
            <div class="btn-new" @click="handleAddVote" v-if="role.indexOf(VOTE_ROLE.ADMIN) > -1"></div>
            
        </div>
        <div class="list-container" v-show="current[0] === 'all' ">
            <div class="no-data" v-if="all_votes.length === 0"><p>No data</p> </div>
            <div class="list-item" v-for="item in all_votes" :key="item.hash">
                <div class="title">
                    {{item.title}}
                </div>
                <div class="duration">
                    <p>{{$t('vote.duration')}}</p>
                    <p>{{formatDuration(item)}}</p>
                </div>
                <div class="status">
                    <p>{{formatStatus(item)}}</p>
                    <div class="status-detail">
                        <div class="status-item">
                            <a-icon type="caret-up" class="icon-approve" /> <span>{{item.approves}}</span>
                        </div>
                        <div class="status-item">
                            <a-icon type="caret-down" class="icon-reject" /> <span>{{item.rejects}}</span>
                        </div>
                    </div>
                    
                </div>
                <div class="actions">
                    <a-button type="link" @click="toDetail(item)">Detail</a-button>
                </div>
            </div>
        </div>
        <div class="list-container" v-show="current[0] === 'created' ">
            <div class="no-data" v-if="admin_votes.length === 0"><p>No data</p> </div>
            <div class="list-item" v-for="item in admin_votes" :key="item.hash">
                <div class="title">
                    {{item.title}}
                </div>
                <div class="duration">
                    <p>{{$t('vote.duration')}}</p>
                    <p>{{formatDuration(item)}}</p>
                </div>
                <div class="status">
                    <p>{{formatStatus(item)}}</p>
                    <div class="status-detail">
                        <div class="status-item">
                            <a-icon type="caret-up" class="icon-approve" /> <span>{{item.approves}}</span>
                        </div>
                        <div class="status-item">
                            <a-icon type="caret-down" class="icon-reject" /> <span>{{item.rejects}}</span>
                        </div>
                    </div>
                    
                </div>
                <div class="actions">
                    <a-button type="link" @click="toDetail(item)">Detail</a-button>
                    <span>|</span>
                    <a-button type="link" style="color: #EA4545" @click="onStopVote(item)"
                    v-if="item.statusText === VOTE_STATUS_TEXT.NOT_START ||
                          item.statusText === VOTE_STATUS_TEXT.IN_PROGRESS">Stop Vote</a-button>
                </div>
            </div>
        </div>
        <sign-send-tx :visible="signVisible" :tx="tx" :wallet="voteWallet"
        v-on:signClose="handleCancel"
        v-on:txSent="handleTxSent"
        ></sign-send-tx>
	</div>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb'
import SignSendTx from "../../Common/SignSendTx";
import {mapState} from 'vuex'
import { VOTE_STATUS_TEXT } from '../../../store/modules/Vote'
var dateFormat = require('dateformat');

export default {
    name: "VoteList",
    components: {
        Breadcrumb,
        SignSendTx
    },
    data() {
        const routes = [{name: this.$t('vote.node'), path:'/node'}]
        return {
            routes,
            current: ['all'],
            menus: [
                {key: 'all', name: this.$t('vote.allVotes')}
            ],
            signVisible: false,
            tx: '',
            VOTE_STATUS_TEXT
        }
    },
    computed: {
        ...mapState({
            role: state => state.Vote.role,
            all_votes: state => state.Vote.all_votes,
            admin_votes: state => state.Vote.admin_votes,
            voteWallet : state => state.Vote.voteWallet,
            
        })
    },
    created() {
        this.$store.dispatch('getVoteRole', {address: this.voteWallet.address})
    },
	mounted() {
        this.refresh()
        this.intervalId = setInterval(() => {
            this.refresh(false)
        }, 10*1000)
    },
    beforeDestroy() {
        clearInterval(this.intervalId)
    },
    watch: {
        role: function(newVal, oldVal) {
            if(newVal.indexOf(this.VOTE_ROLE.ADMIN) > -1) {
                this.$store.dispatch('getAdminVotes')
                this.menus.push({key: 'created', name: this.$t('vote.created')})
            }
        }
    },
    methods: {
        back() {
            this.$router.back()
        },
        refresh(showLoading = true) {
            this.$store.dispatch('getAllVotes', {showLoading})
            if(this.role.indexOf(this.VOTE_ROLE.ADMIN) > -1) {
                    this.$store.dispatch('getAdminVotes')
            }
        },
        handleSelectMenu({item, key, keyPath}){
            this.current[0] = key
        },
        handleAddVote() {
            this.$router.push('/vote/create')
        },
        formatDuration(vote) {
            const start = dateFormat(vote.startTime, 'yyyy-mm-dd HH:MM')
            const end = dateFormat(vote.endTime, 'yyyy-mm-dd HH:MM')
            return start + ' ~ ' + end
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
        toDetail(vote) {
            this.$store.dispatch('setCurrentVote', {vote})
            this.$router.push('/vote/detail')
        },
        handleCancel() {
            this.signVisible = false;
            this.tx = ''
        },
        handleTxSent() {
            this.signVisible = false;
            // 更新页面数据
            this.refresh()
        },
        onStopVote(vote) {
            if(vote.statusText === VOTE_STATUS_TEXT.CANCELED 
                || vote.statusText === VOTE_STATUS_TEXT.FINISHED) {
                this.$message.warning(this.$t('vote.notAllowStop') + this.formatStatus(this.vote))
                return;
            }
            this.$store.dispatch('stopVote', {
                hash: vote.hash}).then(tx => {
                    this.tx = tx;
                    this.signVisible = true;
                })
        }
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
.top-menu-container {
    position: fixed;
    top:23px;
    right:49px;
    z-index: 101; 
    display: flex;
    flex-direction: row;
    align-items: center;
    .btn-new {
        background: url('../../../assets/icon-add.svg') no-repeat center center;
        width:20px;
        height:20px;
        border-radius: 50%;
        background-color:#F4F4F6;
        cursor: pointer;
        margin-left: 50px;   
    }
    .btn-new:hover {
        opacity: .8;
    }
    .ant-menu-horizontal {
        line-height: 36px;
    }
    .ant-menu-item {
        height: 36px;
        font-size:16px;
        font-family:AvenirNext-Regular,AvenirNext;
        font-weight:400;
        color:rgba(0,0,0,1);
        opacity: 0.4;
    }
    .ant-menu-item-selected {
        opacity: 1;
    }
}

.no-data {
    width: 100%;
    height:500px;
    text-align: center;
    line-height: 50px;
    background: #F4F4F6;
    position: relative;
    p {
        margin: 200px auto;
        font-size:16px;
        font-family:AvenirNext-Regular,AvenirNext;
        font-weight:400;
        color:rgba(0,0,0,1);
        opacity: 0.6;
        position: absolute;
        left:0;
        right:0;
    }
}

.list-container {
    margin-left:15px;
    margin-top:15px;
    .list-item {
        display: flex;
        flex-direction: row;
        padding: 16px 0;
        border-bottom: 1px solid #F4F4F6;
        align-items: center;

        .title {
            width:30%;
            margin-right:50px;
            font-size:14px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(0,0,0,0.65);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        .duration {
            margin-right:50px;
            p {
                opacity: 0.4;
                font-size:12px;
                font-family:AvenirNext-Regular,AvenirNext;
                font-weight:400;
                color:rgba(0,0,0,1);
            }
            
            p:last-child {
                margin-top:4px;
                font-size: 14px;
                opacity: 0.6;
            }
        }
        .status {
            font-size:12px;
            font-family:AvenirNext-Regular,AvenirNext;
            font-weight:400;
            color:rgba(0,0,0,1);
            .status-detail {
                margin-top:4px;
                display: flex;
                flex-direction: row;
                align-items:center;
                div:first-child {
                    margin-right: 20px;
                }
                .status-item {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items:center;
                    span {
                        margin-left:4px;
                        font-size: 14px;
                        opacity: 0.6;
                    }
                }

            }
        }
        .actions {
            position:absolute;
            right:22px;
            span {
                color: #E8E8E8;
            }
            button {
                padding:0;
            }
        }
    }
}
</style>