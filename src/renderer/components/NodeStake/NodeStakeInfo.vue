<style scoped>
.nodeStake-container {
    width: 540px;
    margin:20px auto;
}
.detail-item {
    margin-bottom:15px;
}
.detail-item p {
    margin-bottom:5px;
}
.select-ontid {
    width:100%;
}

.step-item-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    /* padding-left: 50px;
    padding-right: 50px; */
}
.step-item-container div {
    width:30%;
    text-align: center;
}

</style>
<template>
    <div >
        <breadcrumb  :current="$t('nodeStake.nodeStake')" v-on:backEvent="handleRouteBack"></breadcrumb>
        <div class="nodeStake-container">
            <div>
                <a-steps progressDot :current="1">
                    <a-step ></a-step>
                    <a-step ></a-step>
                    <a-step ></a-step>                    
                </a-steps>
                <div class="step-item-container">
                    <div>
                        Transfering
                    </div>
                    <div>
                        Audit
                    </div>
                    <div>
                        Stake
                    </div>
                </div>
            </div>

            <div class="detail-item">
                <p class="font-medium-black" for="">{{$t('nodeStake.ontid')}}</p>
                <a-select class="select-ontid"></a-select>
            </div>
            <div class="detail-item">
                <p class="font-medium-black" for="">{{$t('nodeStake.stakeWalletAddress')}}</p>
                <p>{{detail.stakewalletaddress}}</p>
            </div>
            <div class="detail-item">
                <p class="font-medium-black" for="">{{$t('nodeStake.nodePk')}}</p>
                <p>{{detail.publickey}}</p>
            </div>
            <div class="detail-item">
                <p class="font-medium-black" for="">{{$t('nodeStake.contract')}}</p>
                <p>{{detail.contract}}</p>
            </div>
            <div class="detail-item">
                <p class="font-medium-black" for="">{{$t('nodeStake.commitmentQuantity')}}</p>
                <p>{{detail.commitmentquantity}}</p>
            </div>
            <div class="detail-item">
                <p class="font-medium-black" for="">{{$t('nodeStake.stakeQuantity')}}</p>
                <a-input class="input" v-model="detail.stakequantity"></a-input>
            </div>
        </div>
        <div class="footer-btns">
            <div class="btn-stake" v-if="detail.status">
                <p>{{$t('nodeStake.feeTip')}}</p>
                <a-button>{{$t('nodeStake.stake')}}</a-button>
            </div>
            
        </div>
    </div>
</template>

<script>
import Breadcrumb from '../Breadcrumb'
import {mapState} from 'vuex'
export default {
    name: 'NodeStakeView',
    components:{
        Breadcrumb
    },
    data() {
        const nodeStakeOntid = localStorage.getItem('nodeStakeOntid') || ''
        return  {
            nodeStakeOntid,
            localOntid:[],
            detail: {
                "ontid": "did:ont:AKbC3ZaSBQ1GuNKsbcqWxi3uL2oyf9F8vK",
                "stakewalletaddress": "AazEvfQPcQ2GEFFPLF1ZLwQ7K5jDn81hve",
                "publickey": "035384561673e76c7e3003e705e4aa7aee67714c8b68d62dd1fb3221f48c5d3da0",
                "contract": "testcontractname",
                "commitmentquantity": 100000,
                "stakequantity": 10,
                "transactionhash": "364a945fc0e0fbbb05b09ededbbf4b22e1357653c924341cc210906cbd5305e0",
                "status": 3
            }
        }
    },
    mounted(){
        //fetch node stake details
        this.$store.dispatch('fetchStakeDetail', this.stakeIdentity.ontid)
    },
    computed: {
        ...mapState({
            stakeIdentity: state => state.NodeStake.stakeIdentity,
            stakeWallet: state => state.NodeStake.stakeWallet,
            // detail: state => state.NodeStake.detail
        })
    },
    methods: {
        handleRouteBack() {
            this.$router.go(-1)
        }
    }
}
</script>
