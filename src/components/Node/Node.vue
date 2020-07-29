<style scoped>
.node-container {
    position: relative;
    width:100%;
    padding:22px 20px;
}
.center-content {
    display: flex;
    flex-wrap: wrap;
}
.btn-item {
    width:280px;
    height:160px;
    background: #F4F4F6;
    text-align: left;
    margin-bottom:32px;
    margin-right: 32px;
    padding:16px 24px;
    position:relative;
}

.btn-item p:first-child {
    margin-bottom: 12px;
}
.btn-item p:nth-child(2) {
    font-size:14px;
    font-family:AvenirNext-Regular,AvenirNext;
    font-weight:400;
    color:rgba(0,0,0,1);
    opacity: 0.4;
}
.btn-item button {
    font-size:18px !important;
    height: 80px !important;
    width:300px !important;
}
.page-title {
    font-size:18px;
    font-family:AvenirNext-Medium,AvenirNext;
    font-weight:500;
    color:rgba(0,0,0,1);
    margin-bottom:24px;
}
.icon-bottom {
    position: absolute;
    bottom: 0;
    right: 0;
    text-align: right;
    padding-right: 24px;
    padding-bottom:10px;
    width:100%;
    font-weight:400;
    color:rgba(0,0,0,1);
    font-size:16px;
    cursor: pointer;
}
.icon-bottom:hover, .icon-policy:hover > i {
    color: #196BD8;
}

.icon-policy {
    position: absolute;
    top: 10px;
    right:24px;
    cursor: pointer;
}

</style>

<template>
    <div class="negative-margin-top node-container">
        <h1 class="page-title">{{$t('vote.node')}}</h1>
        <div class="center-content">
            <div class="btn-item" >
                <p class="font-title">{{$t('nodeMgmt.nodeStakeMgmt')}}</p>
                <p >{{$t('nodeMgmt.nodeUser')}}</p>
                <div class="icon-bottom" @click="handleNodeStake">
                    <i class="fa fa-arrow-right fa-s icon-bottom"></i>
                </div>
            </div>
            <div class="btn-item" >
                <p class="font-title">{{$t('nodeMgmt.stakeAuthorizaton')}}</p>
                <p class="font-medium">{{$t('nodeMgmt.normalUser')}}</p>
                <div class="icon-bottom" @click="handleAuthorization">
                    <i class="fa fa-arrow-right fa-s icon-bottom"></i>
                </div>
            </div>
            <div class="btn-item" >
                <p class="font-title">{{$t('vote.vote')}}</p>
                <p class="font-medium">{{$t('vote.voteTip')}}</p>
                <div class="icon-policy" @click="openPolicyPage">
                    <i class="fa fa-question-circle-o fa-lg" aria-hidden="true"></i>
                </div>
                <div class="icon-bottom" @click="handleVote">
                    <i class="fa fa-arrow-right fa-s"></i>
                </div>
            </div>
            <div class="btn-item" >
                <p class="font-title">{{$t('nodeMgmt.newNodeApply')}}</p>
                <p class="font-medium">{{$t('nodeMgmt.nodeApplyTip')}}</p>
                <div class="icon-bottom" @click="handleNodeApply">
                    <i class="fa fa-arrow-right fa-s"></i>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import {open} from '../../core/utils'
export default {
    name: 'NodeManagement',
    data(){
        return {
            onlyTestNet: false
        }
    },
    mounted() {
        this.$store.dispatch('fetchVoteContract')
    },
    methods: {
        handleNodeStake() {
            // const net = localStorage.getItem('net');
            // if(net === 'TEST_NET' && this.onlyTestNet) {
            //     this.$message.warning(this.$t('nodeMgmt.switchMainnet'));
            //     return;
            // }
            // this.$router.push({name: 'NodeStakeIntro'})
            this.$router.push({name: 'MyNode'})
        },
        handleAuthorization() {
            const net = localStorage.getItem('net');
            if(net === 'TEST_NET' && this.onlyTestNet) {
                this.$message.warning(this.$t('nodeMgmt.switchMainnet'));
                return;
            }
            this.$router.push({name: 'NodeList'})
        },
        handleVote() {
            const net = localStorage.getItem('net');
            if(net === 'TEST_NET' && this.onlyTestNet) {
                this.$message.warning(this.$t('nodeMgmt.switchMainnet'));
                return;
            }
            this.$router.push('/vote/login')
        },
        handleNodeApply() {
            this.$router.push({name: 'NodeApply'})
        },
        openPolicyPage() {
            const lang = localStorage.getItem('user_lang') || 'en'
            const url = 'https://node.ont.io/voting-policy/' + lang
            open(url)
        }
    }
}
</script>

