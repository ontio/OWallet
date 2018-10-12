<style scoped>
.detail-link {
    text-align: center;
    cursor: pointer;
}
.detail-link i {
    font-size:20px;
}
</style>

<template>
    <div>
        <breadcrumb :current="$t('nodeMgmt.stakeHistory')" v-on:backEvent="handleRouteBack"></breadcrumb>
        <a-table :columns="columns"
        :dataSource="stakeHistory"
        >
        
        <div slot="action" slot-scope="text, record" class="detail-link">
            <a-icon type="arrow-right" @click="handleAuthorizeLogin(record)"/>
        </div>

        </a-table>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import Breadcrumb from '../../Breadcrumb'

export default {
    name: 'StakeHistory',
    data() {
        const columns = [
            {
                title: this.$t('nodeMgmt.name'),
                dataIndex: 'nodeName',
                key:'nodeName'
            },
            {
                title: this.$t('nodeMgmt.stakeWalletAddress'),
                dataIndex: 'stakeWalletAddress',
                key: 'stakeWalletAddress'
            },
            // hide for now
            // {
            //     title: this.$t('nodeMgmt.stakeAmount'),
            //     dataIndex: 'amount',
            //     key: 'amount'
            // },
            {
                title: this.$t('nodeMgmt.lastUpdate'),
                dataIndex: 'updatedAt',
                key: 'updatedAt'
            },
            {
                title: '',
                key: 'action',
                scopedSlots: {customRender:'action'}
            }
        ]
        return {
            columns
        }
    },
    components:{
        Breadcrumb
    },
    mounted() {
        this.$store.dispatch('fetchStakeHistory')
    },
    computed: {
        ...mapState({
            stakeHistory: state => state.NodeAuthorization.stakeHistory,
            node_list: state => state.NodeAuthorization.node_list,
        })
    },
    methods: {
        handleRouteBack() {
            this.$router.go(-1);
        },
        handleAuthorizeLogin(record, item){
            console.log(record)
            let current_node;
            for(let node of this.node_list) {
                if(node.pk === record.nodePk) {
                    current_node = node;
                    break;
                }
            }  
            const stakeWallet = record.stakeWalletAddress
            this.$store.commit('UPDATE_STAKE_AUTHORIZATION_WALLET', {stakeWallet})
            this.$store.commit('UPDATE_CURRENT_NODE', {current_node})
            this.$router.push({name: 'AuthorizeLogin'})
        },
    }
}
</script>
