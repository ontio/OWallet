<style scoped>
.block-clock {
    width:540px;
    height: 80px;
    margin:15px auto;
    border:1px solid #dddddd;
}
.countdown-img {
    float: left;
    height:80px;
    line-height: 80px;
}
.countdown-img img {
    width:60px;
    height: 60px;
}
.countdown-text {
    padding-right: 60px;
    text-align: center;
}
.countdown-text p {
    margin-bottom:10px;
    font-family: 'AvenirNext-Medium';
    color: #5E6369;
    font-size: 16px;
}
.label {
    font-size: 18px;
    margin-left: 15px;
}
.detail-link {
    text-align: center;
    cursor: pointer;
}
.detail-link i {
    font-size:20px;
}

.proportion-title p {
    margin:0
}
.proportion-info-icon {
    cursor: pointer;
}

.btn-history {
    float: right;
}
.question-icon {
    position:absolute;
    top:10px;
    right:10px;
    font-size:18px;
    cursor: pointer;
}
.node-name {
    /* color: #227EEC !important; */
}
.node-name:hover {
    color: #227EEC !important;
}
</style>
<template>
    <div>
        <breadcrumb :current="$t('nodeMgmt.stakeAuthorization')" v-on:backEvent="handleRouteBack"></breadcrumb>
            <a-button type="primary" class="btn-next btn-history" @click="toStakeHistory">{{$t('nodeMgmt.stakeHistory')}}</a-button>
        <div class="block-clock">
            <div style="position:relative;">
                <div class="countdown-img">
                    <img src="../../../assets/countdown.svg" alt="">
                </div>
                <div class="countdown-text">
                    <p>{{$t('nodeMgmt.toNextRound')}}</p>
                    <span class="font-medium-black" style="font-size:20px;">{{countdown}}</span>
                    <span class="font-medium label">{{$t('nodeMgmt.blocks')}}</span>
                </div>
                <span class="question-icon" @click="toQuestion"><a-icon type="question-circle-o" /></span>
            </div>
        </div>
        <a-table :columns="columns"
            :dataSource="node_list"
            :loading= "requesting"
            :pagination="pagination"
            @change="handleTableChange"
        >
            <div slot="nodeProportionTitle"  class="proportion-title">
                <p>{{$t('nodeMgmt.proportionNextRound')}}
                    <a-icon type="info-circle-o" class="proportion-info-icon" @click="showProportionTip"/>
                </p>
                </div>
            <a slot="name" slot-scope="text, record" class="node-name" :class="record.status ===2 ? 'node-consensus' : 'node-candidate' "
                @click="handleNodeDetail(record)">
                
                <a-tooltip placement="top" :title="$t('nodeMgmt.consensusNode')">
                    <a-icon type="star" v-if="record.status === 2" />
                </a-tooltip>
                <a-tooltip placement="top" :title="$t('nodeMgmt.candidateNode')">
                    <a-icon type="star-o" v-if="record.status === 1" />
                </a-tooltip>
                {{text}}
            </a>
            <div slot="action" slot-scope="text, record" class="detail-link" v-if="record.maxAuthorize>0 && record.process !== '100.00%'">
                <a-icon type="arrow-right" @click="handleAuthorizeLogin(record)" v-if="record.maxAuthorize>0"/>
            </div>

        </a-table>
    </div>
</template>
<script>
import Breadcrumb from '../../Breadcrumb'
import {mapState} from 'vuex'
import { open } from '../../../../core/utils'
export default {
    name: 'NodeList',
    components: {
        Breadcrumb
    },
    data() {
        const columns = [
            {
                title: this.$t('nodeMgmt.rank'),
                dataIndex: 'rank',
                key:'rank'
            },
            {
                title: this.$t('nodeMgmt.name'),
                dataIndex: 'name',
                key: 'name',
                scopedSlots: {customRender: 'name'}
            },
            {
                // title: this.$t('nodeMgmt.nodeProportion'),
                dataIndex: 'nodeProportion',
                key: 'nodeProportion',
                slots: {title: 'nodeProportionTitle'}
            },
            {
                title: this.$t('nodeMgmt.currentStake'),
                dataIndex: 'currentStake',
                key: 'currentStake'
            },
            {
                title: this.$t('nodeMgmt.process'),
                dataIndex: 'process',
                key: 'process'
            },
            {
                title: '',
                key: 'action',
                scopedSlots: {customRender:'action'}
            }
        ]
        return {
            columns,
            intervalId:'',
            pagination: {
                current:1,
                pageSize:10,
                total:30
            },
            requesting: false
        }
    },
    mounted(){
        this.requesting = true;
        const net = localStorage.getItem('net')
        this.fetchList()
        // if(net === 'TEST_NET') {
        //     this.$store.dispatch('fetchAllSortedNodeList').then(res => {
        //         this.pagination.total = res.length;
        //         this.fetchList()
        //     })
        // } else {
        //     this.fetchList()
        // }
        
        this.$store.dispatch('fetchBlockCountdown')
        this.intervalId = setInterval(()=>{
            // this.$store.dispatch('fetchNodeList')
            this.$store.dispatch('fetchBlockCountdown')
        }, 6000)  
    },
    beforeDestroy(){
        clearInterval(this.intervalId);
    },
    computed:{
        ...mapState({
            node_list: state => state.NodeAuthorization.node_list,
            countdown: state => state.NodeAuthorization.countdown
        })
    },
    methods: {
        handleRouteBack() {
            this.$router.go(-1);
        },
        handleAuthorizeLogin(record, item){
            console.log(record)
            this.$store.commit('UPDATE_STAKE_AUTHORIZATION_WALLET', {stakeWallet:''})            
            this.$store.commit('UPDATE_CURRENT_NODE', {current_node: record})
            this.$router.push({name: 'AuthorizeLogin'})
        },
        handleNodeDetail(record, item) {
            console.log(record);
            open(record.detailUrl)
        },
        handleTableChange(pagination) {
            console.log(pagination)
            this.pagination = pagination;
            this.fetchList()
        },
        fetchList() {
            this.requesting = true;
            this.$store.dispatch('fetchNodeListNew', {
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.current - 1
            }).then(res => {
                this.requesting = false;
                this.pagination.total = res;
            })
        },
        showProportionTip() {
            const h = this.$createElement
            const title = this.$t('nodeMgmt.proportionNextRound')
            const content = this.$t('nodeMgmt.proportionNextRoundTip')
            const faqLink = this.$t('nodeMgmt.authorizationFAQ')
            this.$info({
                title: title,
                content: h('div',{}, [
                h('p', {
                    style: {
                        margin:0
                    }
                },content),
                h('a', {
                    attrs: {
                        name: 'FAQ'
                    },
                    style: {
                        color: '#40a9ff',
                        textDecoration: 'underline'
                    },
                    on: {
                        click: () => {
                            const url = 'https://medium.com/ontologynetwork/owallet-stake-authorization-faq-4a4bce224122'
                            open(url);
                        }
                    }
                }, faqLink),
                ]),
                onOk() {},
            });
        },
        handleFAQLink(e) {
            var e = e || window.event;
            var target = e.target || ev.srcElement;
            console.log(target)
            alert('helo')
        },
        toStakeHistory() {
            this.$router.push({name: 'StakeHistory'})
        },
        toQuestion() {
            const lang = localStorage.getItem("user_lang");
            let url = "";
            if (lang === "zh") {
                url = "https://medium.com/ontology-cn/owallet%E8%8A%82%E7%82%B9%E8%B4%A8%E6%8A%BC%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98-efc3d7d84e3e";
            } else {
                url = "https://medium.com/ontologynetwork/owallet-stake-authorization-faq-4a4bce224122";
            }

            open(url)
        }
    }
}
</script>
