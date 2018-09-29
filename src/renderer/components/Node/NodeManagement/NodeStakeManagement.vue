<style scoped>
.btn-new-stake {
    width:200px !important;
    float: right;
    margin-right: 10px;
    top: -50px;
}
.node-stake-info {
    padding-bottom: 5rem;
    overflow-y:auto;
}

</style>
<template>
    <div>
        <breadcrumb :current="$t('nodeMgmt.nodeStakeMgmt')" v-on:backEvent="handleRouteBack"></breadcrumb>
        <!-- NODE_HIDE -->
        <a-menu v-model="current" mode="horizontal" @click="handleSelect">
            <a-menu-item key="Node_Stake">{{$t('nodeMgmt.nodeStake')}}</a-menu-item>
            <a-menu-item key="Node_Authorization">{{$t('nodeMgmt.userStakeAuthorization')}}</a-menu-item>
        </a-menu>
        <div>
            <div v-if="current[0] === 'Node_Stake'" class="node-stake-info">
                <node-stake-info :showPosBtn="true" :breadcrumb="true"></node-stake-info>
                
            </div>
            <!-- NODE_HIDE -->
            <node-stake-authorization v-if="current[0] === 'Node_Authorization'"></node-stake-authorization>
        </div>
    </div>
</template>

<script>
import Breadcrumb from '../../Breadcrumb'
import NodeStakeInfo from '../NodeStake/NodeStakeInfo'
import NodeStakeAuthorization from './NodeStakeAuthorization'
export default {
    name: 'NodeStakeManagement',
    components: {
        Breadcrumb,
        NodeStakeInfo,
        NodeStakeAuthorization
    },
    data(){
        return {
            current: ['Node_Stake']
        }
    },
    methods: {
        handleRouteBack(){
            this.$router.go(-1);

        },
        handleSelect({item, key, keyPath}){
            this.current[0] = key
        },
        newStake() {
            this.$router.push({name: 'NodeStakeIntro'})
        }
    }
}
</script>
