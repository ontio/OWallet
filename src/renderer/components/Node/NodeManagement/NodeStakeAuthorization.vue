<style scoped>
.content-container {
    padding: 10px 10px;
}
.header-text {
    font-size:16px;
}

.stake-content {
    padding:10px;
    border:1px solid #dddddd;
    margin-top: 10px;
}
.change-ifAuthorize-radio {
    margin-bottom:15px;
}
.change-ifAuthorize-radio label {
    margin-right: 30px;
}
.status-radio-item {
    /* font-size:14px; */
    /* font-family: 'AvenirNext-Medium'; */
    color: #000000;
}
.content-row {
    display: flex;
    flex-direction: row;
    width:100%;
    margin-bottom:10px;
    padding-bottom:5px;
    border-bottom:1px solid #dddddd;
}
.content-row div:first-child {
    border-right: 1px solid #dddddd;
}
.content-column {
    flex-basis: 50%;
    padding: 5px 10px;
}
.content-column :first-child {
    font-size:14px;
    font-family: 'AvenirNext-Medium';
    color: #5E6369;
}
.content-column :last-child {
    float: right;
    font-family: 'AvenirNext-Medium';
    color: #000000;
    font-size: 0.88rem;
}
.rewardsTip {

}
.reward-slider {
    width:40%; 
    float: left;
    margin-right: 16px;
}
.reward-input {
    margin-top:5px;
    width:50px
}
.current-proportion {
    margin-left: 20px;
}
.rewardProportionTip {
    float: left;
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
}
.btn-confirm {
    margin:5px auto;
    text-align: center;
}
.btn-confirm p {
    margin-bottom: 5px;
}
.error-input {
    border-color:red !important;
}
.unit-input {
    width:100px;
    height:30px !important;
    margin-right: 20px;
}
.allowed-stake {
    margin:10px 15px; 
}
.redeem-btn {
    width: 100px;
    height: 36px;
    border-radius: 0;
    background: #FBE45A;
    padding: 0;
    font-family: AvenirNext-Medium;
    font-size: 14px;
    color: #5E6369;
    border: none;
    margin-bottom:15px;
  }
  .redeem-profit {
      margin-top: 20px;
  }
  .redeem-profit p {
      margin-bottom: 5px;
  }
  .label {
      font-size: 16px;
  }

</style>
<template>
    <div class="content-container">
        <div class="font-medium-black header-text">{{$t('nodeMgmt.allowStakes')}}</div>
        <div class="allowed-stake">
            <span class="font-medium">{{$t('nodeMgmt.allowedStakeUnits')}}: </span>
            <a-input class="input unit-input" :class="validUnit?'':'error-input' " v-model="unit" 
            @change="validateUnit"
            ></a-input>
            <span class="font-medium">{{$t('nodeMgmt.allowedStakeAmount')}}: </span>
            <span>{{unit*500}} ONT</span>
            <span class="font-medium" style="margin-left:20px;">({{$t('nodeMgmt.current')}} {{peer_attrs.maxAuthorizeStr}} ONT)</span>
            <p class="authorize-tip">
                <a-icon type="info-circle" /> 
                <span class="font-regular">{{$t('nodeMgmt.stakeAmountTip')}}</span>
            </p>
            <a-button type="primary" class="btn-next" @click="confirmChangeAuthorization">{{$t('nodeMgmt.confirm')}}</a-button>
        </div>
        <div class="stake-content">
            <div class="content-row">
                <div class="content-column">
                    <span>{{$t('nodeMgmt.yourStakeAmount')}}</span>
                    <span>{{current_peer.initPosStr}} ONT</span>
                </div>
                <div class="content-column">
                    <span>{{$t('nodeMgmt.stakeLimit')}}</span>
                    <span>{{maxStakeLimit}} ONT</span>
                </div>
            </div>
            <div class="content-row">
                <div class="content-column">
                    <span>{{$t('nodeMgmt.userStake')}}</span>
                    <span>{{current_peer.totalPosStr}} ONT</span>
                </div>
                <!-- <div class="content-column">
                    <span>{{$t('nodeMgmt.rewardsPerMonth')}}</span>
                    <span>{{'1,00,000 ONT'}}</span>
                </div> -->
            </div>
            
            <div class="rewardsTip">
                <a-icon type="exclamation-circle-o" />
                <span class="font-regular">{{$t('nodeMgmt.rewardsTip')}}</span>
            </div>
        </div>

        <div class="clearfix" style="margin-top:20px;">
            <span class="rewardProportionTip font-medium">{{$t('nodeMgmt.rewardProportion')}}</span>
            <a-slider :min="0" :max="100" v-model="peerCost" :step="1" class="reward-slider"/>
            <a-input-number
                :min="0"
                :max="100"
                class="reward-input"
                v-model="peerCost"
            /> %
             <span class="font-medium current-proportion"> ({{$t('nodeMgmt.current')}}: {{peer_attrs.oldPeerCost}}%) </span>
        </div>
        <div style="margin-bottom:10px;">
            <a-icon type="exclamation-circle-o" />
            <span>{{$t('nodeMgmt.rewardsProportionTip')}}</span>
        </div>
        <a-button type="primary" class="btn-next" @click="confirmChangeCost">{{$t('nodeMgmt.confirm')}}</a-button>
        <div style="margin-top:10px;">
            <a-icon type="exclamation-circle-o" />
            <span>{{$t('nodeMgmt.changesTakeEffect')}}</span>
        </div>

        <div class="redeem-profit">
            <p>
                <span class="font-medium-black label">{{$t('nodeMgmt.profit')}}: </span>
                <span class="font-medium">{{splitFee.amount}} ONG</span>
            </p>
                <a-button type="primary" class="redeem-btn" @click="redeemRewards">{{$t('nodeMgmt.redeem')}}</a-button>
        </div>
       
        <sign-send-tx :visible="signVisible" :tx="tx"  :wallet="stakeWallet"
        v-on:signClose="handleCancel"
        v-on:txSent="handleTxSent"
        ></sign-send-tx>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import {varifyPositiveInt} from '../../../../core/utils.js'
import {GAS_PRICE, GAS_LIMIT} from '../../../../core/consts'
import numeral from 'numeral'
import SignSendTx from '../../Common/SignSendTx'
import {Crypto} from 'ontology-ts-sdk'
export default {
    name: 'NodeStakeAuthorization',
    components: {
        SignSendTx
    },
    data(){
        return {
            peerCost:0,
            validUnit:true,
            unit:0,
            intervalId:0,
            signVisible: false,
            tx: ''
        }
    },
    mounted() {
        this.peerCost = this.peer_attrs.newPeerCost;
        //fetch stake info
        this.refresh()
        this.intervalId = setInterval(()=>{
            this.refresh()
        }, 5000)
    },
    beforeDestroy(){
        clearInterval(this.intervalId)
    },
    computed: {
        ...mapState({
            current_peer: state => state.NodeAuthorization.current_peer,
            peer_attrs: state => state.NodeAuthorization.peer_attrs,
            stakeIdentity: state => state.NodeStake.stakeIdentity,
            stakeWallet: state => state.NodeStake.stakeWallet,
            ledgerStatus: state => state.LedgerConnector.ledgerStatus,
            ledgerPk : state => state.LedgerConnector.publicKey,
            ledgerWallet: state => state.LedgerConnector.ledgerWallet,
            stakeDetail: state => state.NodeStake.detail,
            splitFee: state => state.NodeAuthorization.splitFee,
            posLimit: state => state.NodeAuthorization.posLimit
        }),
        maxStakeLimit: {
            get(){
                const initPos = this.$store.state.NodeAuthorization.current_peer.initPos;
                return numeral(this.posLimit * initPos).format('0,0');
            }
        }
    },
    methods:{
        confirmChangeAuthorization() {
            if(!this.validUnit) {
                this.$message.error(this.$t('nodeMgmt.invalidInput'))
                return;
            }
            if(parseInt(this.unit)*500 != this.peer_attrs.maxAuthorize) {
                const tx = Ont.GovernanceTxBuilder.makeChangeAuthorizationTx(
                    this.stakeDetail.publickey,
                    new Crypto.Address(this.stakeWallet.address),
                    parseInt(this.unit)*500,
                    new Crypto.Address(this.stakeWallet.address),
                    GAS_PRICE,
                    GAS_LIMIT
                )
                this.tx = tx;
                this.signVisible = true;
            } else {
                this.$message.warning(this.$t('nodeMgmt.noChange'))
            }
        },
        confirmChangeCost() {
            if(this.peerCost != this.peer_attrs.newPeerCost) {
                const tx = Ont.GovernanceTxBuilder.makeSetPeerCostTx(
                    this.stakeDetail.publickey,
                    new Crypto.Address(this.stakeWallet.address),
                    parseInt(this.peerCost),
                    new Crypto.Address(this.stakeWallet.address),
                    GAS_PRICE,
                    GAS_LIMIT
                )
                this.tx = tx;
                this.signVisible = true;
            } else {
                this.$message.warning(this.$t('nodeMgmt.noChange'))
            }
        },
        validateUnit(){
            if(this.unit && !varifyPositiveInt(this.unit)) {
                this.validUnit = false;
                return;
            }
            if(this.unit && parseInt(this.unit)*500 > this.current_peer.initPos * this.posLimit) {
                this.validUnit = false;
                this.$message.error(this.$t('nodeMgmt.notThanMax'))
                return;
            }
            this.validUnit = true;
        },
        handleCancel() {
            this.signVisible = false;
            this.tx = ''
        },
        handleTxSent() {
            this.signVisible = false;
            this.tx = ''
            this.unit = 0;
            this.refresh();
        },
        refresh(){
            const pk = this.stakeDetail.publickey
            const address = this.stakeWallet.address;
            this.$store.dispatch('fetchPeerItem', pk)
            this.$store.dispatch('fetchPeerAttributes', pk)
            this.$store.dispatch('fetchSplitFee', address)
            this.$store.dispatch('fetchPosLimit')
        },
        redeemRewards() {
            if(!this.splitFee.amount) {
                this.$message.warning(this.$t('nodeMgmt.noRewards'))
                return;
            }
            const tx = Ont.GovernanceTxBuilder.makeWithdrawFeeTx(
                new Crypto.Address(this.stakeWallet.address),
                new Crypto.Address(this.stakeWallet.address),
                GAS_PRICE,
                GAS_LIMIT
            )
            this.signVisible = true;
            this.tx = tx;
        },
    }
}
</script>
