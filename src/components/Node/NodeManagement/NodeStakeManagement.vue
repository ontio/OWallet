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

        <a-tabs :default-active-key="currentIndex" :animated="false">
            <a-tab-pane :key="1" :tab="$t('nodeMgmt.nodeStake')">
                <node-stake-info :showPosBtn="true" :breadcrumb="true"></node-stake-info>
            </a-tab-pane>
            <a-tab-pane :key="2" :tab="$t('nodeMgmt.userStakeAuthorization')">
                <node-stake-authorization ></node-stake-authorization>
            </a-tab-pane>
            <a-tab-pane :key="3" :tab="$t('nodeInfo.nodeInfo')">
                <node-info></node-info>
            </a-tab-pane>
        </a-tabs>


        <!-- <a-menu  mode="horizontal" @click="handleSelect">
            <a-menu-item key="1">{{$t('nodeMgmt.nodeStake')}}</a-menu-item>
            <a-menu-item key="2">{{$t('nodeMgmt.userStakeAuthorization')}}</a-menu-item>
            <a-menu-item key="3">{{$t('nodeInfo.nodeInfo')}}</a-menu-item>
        </a-menu>
        <div>
            <div v-show="currentIndex === 1 " class="node-stake-info">
                <node-stake-info :showPosBtn="true" :breadcrumb="true"></node-stake-info>
            </div>
            <node-stake-authorization v-show="currentIndex === 2"></node-stake-authorization>
            <node-info v-show="currentIndex === 3"></node-info>
        </div> -->
    </div>
</template>

<script>
import Breadcrumb from '../../Breadcrumb'
import NodeStakeInfo from '../NodeStake/NodeStakeInfo'
import NodeStakeAuthorization from './NodeStakeAuthorization'
import NodeInfo from '../NodeStake/NodeInfo'
import {mapState} from  'vuex'
export default {
    name: 'NodeStakeManagement',
    components: {
        Breadcrumb,
        NodeStakeInfo,
        NodeStakeAuthorization,
        NodeInfo
    },
    data(){
        return {
            current: [1]
        }
    },
    computed: {
        ...mapState({
            currentIndex: state => state.NodeStake.menuTabIndex
        })
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
