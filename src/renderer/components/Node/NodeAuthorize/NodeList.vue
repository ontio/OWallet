<style scoped>
.block-clock {
    width:540px;
    /* height:50px; */
    margin:15px auto;
    border:1px solid #dddddd;
    padding:20px 40px;
}
</style>
<template>
    <div>
        <breadcrumb :current="$t('nodeMgmt.stakeAuthorization')" v-on:backEvent="handleRouteBack"></breadcrumb>
        <div class="block-clock">
            <div></div>
            <div>
                <p>{{$t('nodeMgmt.toNextRound')}}</p>
                <div>
                    <span>4319</span>
                    <span>blocks</span>
                </div>
            </div>
        </div>
        <a-table :columns="columns"
        :dataSource="data"
        :customRow="customRow">
        <span slot="action" slot-scope="text, record">
            <a-icon type="arrow-right" />
        </span>
        </a-table>
    </div>
</template>
<script>
import Breadcrumb from '../../Breadcrumb'
export default {
    name: 'NodeList',
    components: {
        Breadcrumb
    },
    data() {
        const columns = [
            {
                title: this.$t('nodeMgmt.rank'),
                dataIndex: 'rank'
            },
            {
                title: this.$t('nodeMgmt.name'),
                dataIndex: 'name'
            },
            {
                title: this.$t('nodeMgmt.currentStake'),
                dataIndex: 'currentStake'
            },
            {
                title: this.$t('nodeMgmt.process'),
                dataIndex: 'process'
            },
            {
                title: this.$t('nodeMgmt.changes'),
                dataIndex: 'changes'
            },
            {
                title: '',
                key: 'action',
                scopedSlots: {customRender:'action'}
            }
        ]
        const data = [
            {rank:1, name: 'Node No1', currentStake: '444,333',process: '4.95%', changes:3},
            {rank:2, name: 'Node No2', currentStake: '444,333',process: '4.95%', changes:3},
            {rank:3, name: 'Node No3', currentStake: '444,333',process: '4.95%', changes:3},
            {rank:4, name: 'Node No4', currentStake: '444,333',process: '4.95%', changes:3},
            
        ]
        return {
            columns,
            data
        }
    },
    mounted(){
        //loop to fetch data
    },
    methods: {
        handleRouteBack() {
            this.$router.go(-1);
        },
        customRow(record) {
            return {
                on: {
                    click: () => {
                        this.$router.push({name: 'AuthorizeLogin'})
                    }
                }
            }
        }
    }
}
</script>
