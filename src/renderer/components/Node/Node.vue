<style scoped>
.node-container {
    position: relative;
    width:100%;
    height:100vh;
}
.center-content {
    width: 540px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left:auto;
    margin-right: auto;
    transform: translate(-50%, -50%);
}
.btn-item {
    text-align: center;
    margin-bottom:80px;
}
.btn-item p {
    text-align: center;
    font-size: 16px;
    margin-bottom: 5px;
}
.btn-item button {
    font-size:18px !important;
    height: 80px !important;
    width:300px !important;
}
</style>

<template>
    <div class="node-container">
        <div class="center-content">
            <div class="btn-item">
                <p class="font-medium">{{$t('nodeMgmt.nodeUser')}}</p>
                <a-button class="btn-next" @click="handleNodeStake">{{$t('nodeMgmt.nodeStakeMgmt')}}</a-button>
            </div>
            <!-- <div class="btn-item">
                <p class="font-medium">{{$t('nodeMgmt.normalUser')}}</p>
                <a-button class="btn-next" @click="handleAuthorization">{{$t('nodeMgmt.stakeAuthorizaton')}}</a-button>
            </div> -->
        </div>
    </div>
    
</template>

<script>
export default {
    name: 'NodeManagement',
    methods: {
        handleNodeStake() {
            this.$router.push({name: 'NodeStakeIntro'})
        },
        handleAuthorization() {
            this.$router.push({name: 'NodeList'})
        }
    }
}
</script>

