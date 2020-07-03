<style scoped>
.content-container {
    display: flex;
  }

  .left-half {
    flex-basis: 55%;
    padding-right: 20px;
  }

  .right-half {
    flex-basis: 50%;
    padding-left: 40px;
    border-left: 1px solid #dddddd;

  }
  .label {
      font-size:16px;
  }

  .refresh-icon {
    color: #000000;
    font-size: 16px;
    cursor: pointer;
    margin-left: 20px;
  }

  .switch-wallet {
      margin-left: 20px;
      cursor: pointer;
      color: #000000;
      font-size: 16px;
  }

  .new-stake {
      margin:15px 0;
      border-radius:0;
  }

  .in-authorization {
      margin:15px 0 0 0;
  }
  .authorize-tip {
      font-size:16px;
      margin-bottom: 15px;
  }
  .tip-font {
      font-size: 12px;
  }
  .cancel-btn {
      margin: 15px 0;
      border-radius: 0;
  }
  .redeem-item {
      width:100%;
  }
  .redeem-item span:first-child {
      width:150px;
      display: inline-block;
  }
  .redeem-item button {
      margin-left: 20px;
  }
  .redeem-ont {
      margin: 15px 0;
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
  .cancel-stake-input {
      width:200px;
  }
</style>
<template>
    <div>
        <breadcrumb :current="$t('nodeMgmt.stakeAuthorization')" v-on:backEvent="handleRouteBack"></breadcrumb>
        <div class="content-container">
            <div class="left-half">
                <div>
                    <span class="font-medium-black label">{{$t('nodeMgmt.nodeName')}}: </span>
                    <span class="font-medium">{{current_node.name}}</span>
                </div>
                <div>
                    <span class="label font-medium-black">{{$t('nodeMgmt.walletAddress')}}: </span>
                    <span class="font-medium">{{stakeWallet.address}}</span>
                    <a-tooltip placement="top" :title="$t('nodeMgmt.switchWallet')">
                        <span class="switch-wallet" @click="switchWallet"><a-icon type="sync" /></span>
                    </a-tooltip>
                    
                </div>
                <a-button type="primary" class="btn-next new-stake" @click="newStakeAuthorization">{{$t('nodeMgmt.newStakeAuthorization')}}</a-button>
                <div class="in-authorization">
                    <span class="label font-medium-black">{{$t('nodeMgmt.inAuthorization')}}: </span>
                    <span class="font-medium">{{authorizationInfo.inAuthorization}} ONT</span>
                    <a-tooltip placement="top" :title="$t('nodeMgmt.refresh')">
                        <span class="common-icon refresh-icon" @click="handleRefresh"></span>
                    </a-tooltip>
                </div>
                <div>
                    <span>{{$t('nodeMgmt.getProfitPart')}}:</span>
                    <span>{{authorizationInfo.receiveProfitPortion}} ONT</span>
                </div>
                <div>
                    <span>{{$t('nodeMgmt.newStakePart')}}:</span>
                    <span>{{authorizationInfo.newStakePortion}} ONT</span>
                </div>
                <div class="authorize-tip">
                    <a-icon type="info-circle" />
                    <span class="font-regular tip-font">{{$t('nodeMgmt.authorizeTip')}}</span>
                </div>
                <a-button type="default" class="cancel-btn" @click="cancelAuthorization">{{$t('nodeMgmt.cancelAuthorization')}}</a-button>
                <div class="redeem-ont">
                    <p class="redeem-item">
                        <span class="font-medium-black label">
                            <a-tooltip placement="right" :title="$t('nodeMgmt.lockedONT')">
                                <a-icon type="info-circle-o" />
                            </a-tooltip>
                            {{$t('nodeMgmt.locked')}}: 
                        </span>
                        <span class="font-medium">{{authorizationInfo.locked}} ONT</span>
                    </p>
                    <p class="redeem-item">
                        <span class="font-medium-black label">
                            {{$t('nodeMgmt.claimable')}}: 
                        </span>
                        <span class="font-medium">{{authorizationInfo.claimable}} ONT</span>
                        <a-button type="primary" class="redeem-btn" @click="redeemOnt">{{$t('nodeMgmt.redeem')}}</a-button>
                    </p>
                    <p class="redeem-item">
                        <span class="font-medium-black label">
                            <a-tooltip placement="right" :title="$t('nodeMgmt.unboundONG')">
                                <a-icon type="info-circle-o" />
                            </a-tooltip>
                            {{$t('nodeMgmt.unboundOng')}}: 
                        </span>
                        <span class="font-medium">{{unboundOng}} ONG</span>
                        <!-- <a-button type="primary" class="redeem-btn" @click="redeemOng">{{$t('nodeMgmt.redeem')}}</a-button> -->
                    </p>
                </div>
            </div>
            <div class="right-half">
                <p class="font-medium-black label">{{$t('nodeMgmt.rewards')}}</p>
                <p>
                    <span class="font-medium-black label">
                        <a-tooltip placement="right" :title="$t('nodeMgmt.profitONG')">
                                <a-icon type="info-circle-o" />
                            </a-tooltip>
                        {{$t('nodeMgmt.profit')}}: 
                    </span>
                    <span class="font-medium">{{splitFee.amount}} ONG</span>
                </p>
                <a-button type="primary" class="redeem-btn" @click="redeemRewards">{{$t('nodeMgmt.redeem')}}</a-button>

                <p class="authorize-tip">
                   <a-icon type="info-circle" />
                   <span class="font-regular tip-font">{{$t('nodeMgmt.rewardTip')}}</span>
                </p>
            </div>
        </div>
        <a-modal 
            :title="$t('nodeMgmt.cancelAuthorization')"
            :visible="cancelVisible"
            @ok="handleCancelAuthorizationOk"
            @cancel="handleCancelAuthorizationCancel">
            <div>
                <div>
                    <span class="font-medium-black label">{{$t('nodeMgmt.nodeName')}}: </span>
                    <span class="font-medium">{{current_node.name}}</span>
                </div>
                <div class="in-authorization">
                    <span class="label font-medium-black">{{$t('nodeMgmt.inAuthorization')}}: </span>
                    <span class="font-medium">{{authorizationInfo.inAuthorization}} ONT</span>
                </div>
                <div>
                    <span class="label font-medium-black">{{$t('nodeMgmt.unitToCancel')}}: </span>
                    <a-input class="input cancel-stake-input" :class="validCancelAmount? '': 'error-input'"
                    v-model="cancelAmount" @change="validateCancelAmount"></a-input> {{$t('nodeMgmt.cancelUnits')}}
                </div>
                <div>
                    <span class="label font-medium-black">{{$t('nodeMgmt.amountToCancel')}}: </span>
                    <span class="font-medium">{{cancelAmount}} ONT</span>
                </div>
            </div>
        </a-modal>
        <sign-send-tx :visible="signVisible" :tx="tx" :wallet="stakeWallet"
        v-on:signClose="handleCancel"
        v-on:txSent="handleTxSent"
        ></sign-send-tx>
    </div>
</template>
<script>
import Breadcrumb from '../../Breadcrumb'
import {mapState} from 'vuex'
import SignSendTx from '../../Common/SignSendTx'
import {GAS_PRICE, GAS_LIMIT} from '../../../../core/consts'
import {Crypto, GovernanceTxBuilder, utils} from 'ontology-ts-sdk'
import numeral from 'numeral'
import {varifyPositiveInt} from '../../../../core/utils.js'

export default {
    name:'AuthorizationMgmt',
    components: {
        Breadcrumb,
        SignSendTx
    },
    data() {
        return {
            intervalId:'',
            signVisible: false,
            // inAuthorization: 0,
            // locked: 0,
            // claimable:0,
            tx: '',
            cancelVisible: false,
            cancelAmount: 0,
            validCancelAmount: true
        }
    },
    mounted() {
        //fetch stake info
        // const pk = this.stakeDetail.publicKey

        this.refresh();
        this.intervalId = setInterval(()=>{
            this.refresh();            
        }, 10000)
    },
    beforeDestroy(){
        clearInterval(this.intervalId)
    },
    
    computed:{
        ...mapState({
            current_node: state => state.NodeAuthorization.current_node,
            stakeWallet: state => state.NodeStake.stakeWallet,
            splitFee: state => state.NodeAuthorization.splitFee,
            authorizationInfo: state => state.NodeAuthorization.authorizationInfo,
            peer_attrs: state => state.NodeAuthorization.peer_attrs,
            unboundOng: state => state.NodeAuthorization.peerUnboundOng
        }),
        inAuthorization: {
            get() {
                
            }
        }

    },
    methods: {
        refresh(){
            const address = this.stakeWallet.address;
            const pk = this.current_node.pk;
            this.$store.dispatch('fetchAuthorizationInfo', {pk, address})
            this.$store.dispatch('fetchSplitFee', address)
            this.$store.dispatch('fetchPeerAttributes', pk)
            this.$store.dispatch('fetchPeerUnboundOng', address)
        },
        handleRouteBack() {
            this.$router.go(-1);
        },
        newStakeAuthorization() {
            if(this.peer_attrs.maxAuthorize === 0) {
                this.$message.warning(this.$t('nodeMgmt.peerNotAllowAuthorize'))
                return;
            }
            this.$router.push({name: 'NewAuthorization'})
        },
        switchWallet() {
            this.$router.push({name: 'AuthorizeLogin'})
        },
        handleRefresh() {
            this.$store.dispatch('showLoadingModals')
            setTimeout(() => {
                this.$store.dispatch('hideLoadingModals')
            }, 100)
            const address = this.stakeWallet.address;
            const pk = this.current_node.pk;
            this.$store.dispatch('fetchAuthorizationInfo', {pk, address})
            this.$store.dispatch('fetchSplitFee', address)
            this.$store.dispatch('fetchPeerAttributes', pk)
        },
        handleCancel() {
            this.signVisible = false;
            this.tx = ''
            this.cancelAmount = 0;
        },
        handleTxSent() {
            this.signVisible = false;
            // this.tx = ''
            this.cancelAmount = 0;
            this.refresh();
            const address = this.stakeWallet.address;
            const pk = this.current_node.pk;
            const record = {
                indexKey : address + '-' + pk,
                stakeWalletAddress: address,
                nodePk: pk,
                nodeName: this.current_node.name,
            }
            const txHash = utils.reverseHex(this.tx.getHash());
            this.tx = '';
            // this.$store.dispatch('recordStakeHistory', {txHash, record})
        },
        validateCancelAmount() {
            if(!this.cancelAmount || !varifyPositiveInt(this.cancelAmount)) {
                this.validCancelAmount = false;
                return;
            }
            const inAuthorization = this.authorizationInfo.consensusPos + this.authorizationInfo.freezePos
                                    + this.authorizationInfo.newPos;
            if(Number(this.cancelAmount) > inAuthorization) {
                this.validCancelAmount = false;
                return;
            }
            this.validCancelAmount = true;
        },
        handleCancelAuthorizationOk() {
            if(!this.cancelAmount || !this.validCancelAmount) {
                this.$message.error(this.$t('nodeMgmt.invalidInput'))
                return;
            }
            this.cancelVisible = false;
            this.signVisible = true;
            const userAddr = new Crypto.Address(this.stakeWallet.address);
            const amount = Number(this.cancelAmount);
            const tx = GovernanceTxBuilder.makeUnauthorizeForPeerTx(
                userAddr,
                [this.current_node.pk],
                [parseInt(amount)],
                userAddr,
                GAS_PRICE,
                GAS_LIMIT
            )
            this.tx = tx;
            this.cancelAmount = 0;
        },
        handleCancelAuthorizationCancel() {
            this.cancelVisible = false;
        },
        redeemRewards() {
            if(!this.splitFee.amount) {
                this.$message.warning(this.$t('nodeMgmt.noRewards'))
                return;
            }
            const tx = GovernanceTxBuilder.makeWithdrawFeeTx(
                new Crypto.Address(this.stakeWallet.address),
                new Crypto.Address(this.stakeWallet.address),
                GAS_PRICE,
                GAS_LIMIT
            )
            this.signVisible = true;
            this.tx = tx;
        },
        cancelAuthorization() {
            this.cancelVisible = true
            this.tx = '';
        },
        redeemOnt() {
            if(!this.authorizationInfo.withdrawUnfreezePos) {
                this.$message.warning(this.$t('nodeMgmt.noClaimableOnt'))
                return;
            }
            const claimable = this.authorizationInfo.claimableVal
            const tx = GovernanceTxBuilder.makeWithdrawTx(
                new Crypto.Address(this.stakeWallet.address),
                [this.current_node.pk],
                [claimable],
                new Crypto.Address(this.stakeWallet.address),
                GAS_PRICE,
                GAS_LIMIT
            )
            this.signVisible = true;
            this.tx = tx;
        },
        redeemOng() {
            if(!this.unboundOng) {
                this.$message.warning(this.$t('nodeMgmt.noUnboundOng'));
                return;
            }
            const tx = GovernanceTxBuilder.makeWithdrawPeerUnboundOngTx(
                new Crypto.Address(this.stakeWallet.address),
                new Crypto.Address(this.stakeWallet.address),
                GAS_PRICE,
                GAS_LIMIT
            )
            this.signVisible = true;
            this.tx = tx;
        }
    }
}
</script>
