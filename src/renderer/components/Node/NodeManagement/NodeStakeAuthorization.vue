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
</style>
<template>
    <div class="content-container">
        <div class="font-medium-black header-text">{{$t('nodeMgmt.allowStakes')}}</div>
        <div class="stake-content">
            <a-radio-group @change="changeIfAuthorize" v-model="ifAuthorize" class="change-ifAuthorize-radio">
                <a-radio value="1" class="status-radio-item">{{$t('nodeMgmt.permit')}}</a-radio>
                <a-radio value="0" class="status-radio-item">{{$t('nodeMgmt.deny')}}</a-radio>
            </a-radio-group>
            <div class="content-row">
                <div class="content-column">
                    <span>{{$t('nodeMgmt.stakeAmount')}}</span>
                    <span>{{'1,00,000 ONT'}}</span>
                </div>
                <div class="content-column">
                    <span>{{$t('nodeMgmt.stakeLimit')}}</span>
                    <span>{{'1,000,000'}}</span>
                </div>
            </div>
            <div class="content-row">
                <div class="content-column">
                    <span>{{$t('nodeMgmt.userNumber')}}</span>
                    <span>{{'1,00,000'}}</span>
                </div>
                <div class="content-column">
                    <span>{{$t('nodeMgmt.userStake')}}</span>
                    <span>{{'1,000,000'}}</span>
                </div>
            </div>
            <div class="content-row">
                <div class="content-column">
                    <span>{{$t('nodeMgmt.rewardsPerMonth')}}</span>
                    <span>{{'1,00,000 ONT'}}</span>
                </div>
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
                :min="1"
                :max="20"
                class="reward-input"
                v-model="peerCost"
            /> %
             <span class="font-medium current-proportion"> ({{$t('nodeMgmt.current')}}: 40%) </span>
        </div>
        <div>
            <a-icon type="exclamation-circle-o" />
            <span>{{$t('nodeMgmt.rewardsProportionTip')}}</span>
        </div>
        <div class="footer-btns">
            <div class="btn-confirm">
                <p class="font-medium">{{$t('nodeMgmt.changesTakeEffect')}}</p>
                <a-button type="primary" class="btn-next" @click="confirm">{{$t('nodeMgmt.confirm')}}</a-button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    name: 'NodeStakeAuthorization',
    data(){
        return {
            ifAuthorize:1,
            peerCost:0
        }
    },
    mouted: {
        //fetch stake info
    },
    beforeDestroy(){

    },
    computed: {
        ...mapState({

        })
    },
    methods:{
        changeIfAuthorize(){

        },
        confirm() {

        }
    }
}
</script>
