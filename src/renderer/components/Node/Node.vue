<style scoped>
.node-container {
    position: relative;
    width:100%;
    padding:22px 20px;
}
.center-content {
    display: flex;
}
.btn-item {
    width:300px;
    height:160px;
    background: #F4F4F6;
    text-align: left;
    margin-bottom:80px;
    margin-right: 32px;
    padding:16px 24px;
    position:relative;
    cursor: pointer;
}
.btn-item:hover > i {
    color: #196BD8;
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
    bottom: 10px;
    right: 24px;
    width:14px;
    height:16px;
    font-weight:400;
    color:rgba(0,0,0,1);
    font-size:16px;
}

</style>

<template>
    <div class="negative-margin-top node-container">
        <h1 class="page-title">{{$t('vote.node')}}</h1>
        <div class="center-content">
            <div class="btn-item" @click="handleNodeStake">
                <p class="font-title">{{$t('nodeMgmt.nodeStakeMgmt')}}</p>
                <p >{{$t('nodeMgmt.nodeUser')}}</p>
                <i class="fa fa-arrow-right fa-s icon-bottom"></i>
            </div>
            <div class="btn-item" @click="handleAuthorization">
                <p class="font-title">{{$t('nodeMgmt.stakeAuthorizaton')}}</p>
                <p class="font-medium">{{$t('nodeMgmt.normalUser')}}</p>
                <i class="fa fa-arrow-right fa-s icon-bottom"></i>
            </div>
            <div class="btn-item" @click="handleVote">
                <p class="font-title">{{$t('vote.vote')}}</p>
                <p class="font-medium">{{$t('vote.voteTip')}}</p>
                <i class="fa fa-arrow-right fa-s icon-bottom"></i>
            </div>
        </div>
    </div>
    
</template>

<script>
export default {
    name: 'NodeManagement',
    data(){
        return {
            onlyTestNet: false
        }
    },
    methods: {
        handleNodeStake() {
            const net = localStorage.getItem('net');
            if(net === 'TEST_NET' && this.onlyTestNet) {
                this.$message.warning(this.$t('nodeMgmt.switchMainnet'));
                return;
            }
            this.$router.push({name: 'NodeStakeIntro'})
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
        }
    }
}
</script>

