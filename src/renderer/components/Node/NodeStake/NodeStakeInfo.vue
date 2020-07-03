<style scoped>
.nodeStake-container {
  width: 540px;
  margin: 0px auto;
  padding-top:20px;
}
.detail-item {
  margin-bottom: 15px;
}
.detail-item p {
  margin-bottom: 5px;
}
.select-ontid {
  width: 100%;
}

.step-item-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom:15px;
  /* padding-left: 50px;
    padding-right: 50px; */
}

.step-item-container div {
  width: 30%;
  text-align: center;
  font-size:14px;

}
.stake-status-tip {
    text-align: center;
    font-size:12px;
    height:20px;
    margin:0;
}
.btn-stake {
    width:540px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.initPos-btns {
    margin:10px auto;
    width:640px;
}
.initPos-btns button {
    margin-right: 20px;
}
.add-initPos-btn {
    width: 180px;
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
  .add-pos-input {
    width:200px;
  }
</style>
<template>
    <div >
        <breadcrumb  v-if="!breadcrumb" :current="$t('nodeStake.nodeStake')" v-on:backEvent="handleRouteBack"></breadcrumb>
        <div class="nodeStake-container">
            <div>
                <a-steps progressDot :current="current">
                    <a-step ></a-step>
                    <a-step ></a-step>
                    <a-step ></a-step>                    
                </a-steps>
                <div class="step-item-container">
                    <div>
                        {{status1}}
                    </div>
                    <div>
                        {{status2}}
                    </div>
                    <div>
                        {{status3}}
                    </div>
                </div>
            </div>

            <!-- <div class="detail-item">
                <p class="font-medium-black" for="">{{$t('nodeStake.ontid')}}</p>
                <p>{{detail.ontid}}</p>
            </div> -->
            <div class="detail-item">
                <p class="font-medium-black" for="">{{$t('nodeStake.stakeWalletAddress')}}</p>
                <p>{{detail.stakewalletaddress}}</p>
            </div>
            <div class="detail-item">
                <p class="font-medium-black" for="">{{$t('nodeStake.nodePk')}}</p>
                <p>{{nodePublicKey}}</p>
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
                <p>{{current_peer.initPos}}</p>
            </div>
            <!-- 只有成为节点后可以操作初始质押部分 -->
            <div class="initPos-btns" v-if="detail.status === 8">
                    <a-button class="add-initPos-btn" @click="handleAddInitPos">{{$t('nodeMgmt.addInitPos')}}</a-button>
                    <a-button class="add-initPos-btn" @click="handleReduceInitPos"
                    v-if="current_peer.initPos> detail.commitmentquantity"
                    >{{$t('nodeMgmt.reduceInitPos')}}</a-button>    
                    <a-button class="add-initPos-btn" @click="()=>{this.redeemPosVisible = true;}">{{$t('nodeMgmt.redeemInitPos')}}</a-button>
            </div>
        </div>
        <div class="footer-btns">
            <p class="font-medium stake-status-tip" >
              <span v-if="statusTip"><a-icon type="info-circle-o"/> {{statusTip}}</span>
              </p>
            <div class="btn-stake">
                <a-button @click="handleBack" type="default" class="btn-cancel">{{$t('nodeStake.back')}}</a-button>
                <a-button @click="handleRecall" class="btn-next" v-if="detail.status ===2">{{$t('nodeStake.recall')}}</a-button>
                <a-button @click="handleRefund" class="btn-next" v-if="detail.status ===4 || detail.status ===3 || detail.status ===7 "
                :disabled="refundClicked">{{$t('nodeStake.refund')}}</a-button>
                <a-button @click="handleQuitNode" class="btn-next" v-if="detail.status ===8">{{$t('nodeStake.quitNode')}}</a-button>
                <a-button @click="handleNewStake" class="btn-next" v-if="detail.status ===6 || detail.status ===1">{{$t('nodeStake.newStake')}}</a-button>

            </div>
        </div>

        <a-modal 
            :title="$t('nodeMgmt.addInitPos')"
            :visible="addPosVisible"
            @ok="handleAddPosOk"
            @cancel="handleAddPosCancel">
            <div>
                <div>
                    <span class="label font-medium-black">{{$t('nodeMgmt.amountToAdd')}}: </span>
                    <a-input class="input add-pos-input" :class="validAddPos? '': 'error-input'"
                    v-model="addPos" @change="validateAddPos"></a-input> ONT
                </div>
            </div>
        </a-modal>

        <a-modal 
            :title="$t('nodeMgmt.reduceInitPos')"
            :visible="reducePosVisible"
            @ok="handleReducePosOk"
            @cancel="handleReducePosCancel">
            <div>
                <div>
                    <span class="label font-medium-black">{{$t('nodeMgmt.amountToReduce')}}: </span>
                    <a-input class="input add-pos-input" :class="validReducePos? '': 'error-input'"
                    v-model="reducePos" @change="validateReducePos"></a-input> ONT
                </div>
            </div>
        </a-modal>

        <a-modal
          :title="$t('nodeMgmt.redeemInitPos')"
          :visible="redeemPosVisible"
          :okText="$t('nodeMgmt.redeemInitPosOk')"
          @ok="handleRedeemPosOk"
          @cancel="handleRedeemPosCancel">
            <div>
              <p class="font-medium-black">{{$t('nodeMgmt.initPosInLock')}}: {{authorizationInfo.locked}} ONT</p>
              <p class="font-medium-black">{{$t('nodeMgmt.initPosRedeemable')}}: {{authorizationInfo.claimable}} ONT</p>
            </div>
        </a-modal>

        <a-modal 
        :title="$t('nodeStake.signWithWallet')"
        :visible="walletPassModal"
        @ok="handleWalletSignOK"
        @cancel="handleWalletSignCancel">
          <div v-if="stakeWallet.key">
              <p>{{$t('nodeStake.enterWalletPass')}}</p>
              <a-input class="input" v-model="walletPassword" :plaecholder="$t('nodeStake.password')" type="password"></a-input>
          </div>
          <div v-if="!stakeWallet.key">
            <div class="font-bold" style="margin-bottom: 10px;">{{$t('ledgerWallet.connectApp')}}</div>
                    <span class="font-medium-black">{{$t('ledgerWallet.status')}}: </span>
                    <span class="font-medium">{{ledgerStatus}} </span>
          </div>
        </a-modal>
    </div>
</template>

<script>
import Breadcrumb from "../../Breadcrumb";
import { mapState } from "vuex";
import { Crypto, TransactionBuilder, utils, TxSignature, GovernanceTxBuilder, RestClient } from "ontology-ts-sdk";
import {legacySignWithLedger} from '../../../../core/ontLedger'
import {varifyPositiveInt, getNodeUrl} from '../../../../core/utils.js'
import axios from "axios";
import {
  ONT_PASS_NODE,
  ONT_PASS_NODE_PRD,
  ONT_PASS_URL,
  GAS_PRICE,
  GAS_LIMIT,
  DEFAULT_SCRYPT
} from "../../../../core/consts";

export default {
  name: "NodeStakeInfo",
  props: ['showPosBtn','breadcrumb'],
  components: {
    Breadcrumb
  },
  data() {
    return {
      localOntid: [],
      intervalId: "",
      interval: 10000,
      refundClicked: false,
      walletPassModal: false,
      walletPassword: "",
      tx: "",

      addPosVisible: false,
      addPos: 0,
      validAddPos: true,
      reducePosVisible: false,
      reducePos: 0,
      validReducePos: true,
      isDelegateSendTx:true,

      redeemPosVisible: false,

    };
  },
  mounted() {
    //fetch node stake details
    if(!this.stakeWallet.key) {//common wallet
      this.$store.dispatch('getLedgerStatus')
    }
    const data = {
      address: this.stakeWallet.address,
      public_key: this.nodePublicKey
    }
    this.$store.dispatch("fetchStakeDetail", data);
    this.$store.dispatch('fetchPeerItem', this.nodePublicKey);
    this.$store.dispatch('fetchPosLimit')
    this.$store.dispatch('fetchAuthorizationInfo', 
      {pk: this.nodePublicKey, address: this.stakeWallet.address}
      )
    const intervalId = setInterval(() => {
      this.$store.dispatch("fetchStakeDetail", data);
      this.$store.dispatch('fetchPeerItem', this.nodePublicKey);
      this.$store.dispatch('fetchPosLimit')
      this.$store.dispatch('fetchAuthorizationInfo', 
      {pk: this.nodePublicKey, address: this.stakeWallet.address}
      )
    }, this.interval);
    this.intervalId = intervalId
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
    this.$store.dispatch('stopGetLedgerStatus')
  },
  computed: {
    ...mapState({
      stakeIdentity: state => state.NodeStake.stakeIdentity,
      stakeWallet: state => state.NodeStake.stakeWallet,
      nodePublicKey: state => state.NodeStake.nodePublicKey,
      ledgerStatus: state => state.LedgerConnector.ledgerStatus,
      ledgerPk : state => state.LedgerConnector.publicKey,
      ledgerWallet: state => state.LedgerConnector.ledgerWallet,
      detail: state => state.NodeStake.detail,
      current_peer: state => state.NodeAuthorization.current_peer,
      posLimit: state => state.NodeAuthorization.posLimit,
      // detail: state => state.NodeStake.detail
      status1: state => state.NodeStake.status1,
      status2: state => state.NodeStake.status2,
      status3: state => state.NodeStake.status3,
      current: state => state.NodeStake.current,
      statusTip: state => state.NodeStake.statusTip,
      btnText: state => state.NodeStake.btnText,
      authorizationInfo: state => state.NodeAuthorization.authorizationInfo
    })
  },
  methods: {
    handleRouteBack() {
      this.$router.go(-1);
    },
    handleBack() {
      this.$router.go(-1);
    },
    handleWalletSignCancel() {
      this.tx = "";
      this.walletPassModal = false;
      this.walletPassword = '';
    },
    handleWalletSignOK() {
      const tx = this.tx;
      if (this.stakeWallet.key && !this.walletPassword) {
        //common wallet
        this.$message.error(this.$t("nodeStake.passwordEmpty"));
        return;
      }
      this.refundClicked = true;
      if (this.stakeWallet.key) {
        this.$store.dispatch("showLoadingModals");
        const enc = new Crypto.PrivateKey(this.stakeWallet.key);
        let pri;
        try {
          pri = enc.decrypt(
            this.walletPassword,
            new Crypto.Address(this.stakeWallet.address),
            this.stakeWallet.salt,
            DEFAULT_SCRYPT
          );
        } catch (err) {
          console.log(err);
          this.refundClicked = false;
          this.$store.dispatch("hideLoadingModals");
          this.$message.error(this.$t("common.pwdErr"));
          return;
        }
        TransactionBuilder.signTransaction(tx, pri);
        if(this.isDelegateSendTx) {
          this.delegateSendTx(tx);
        } else {
          this.sendTx(tx);
        }
      } else {
        //ledger sign
        if (this.ledgerWallet.address) {
          this.$store.dispatch("showLoadingModals");
          const pk = new Crypto.PublicKey(this.ledgerWallet.publicKey);
          const txSig = new TxSignature();
          txSig.M = 1;
          txSig.pubKeys = [pk];
          tx.payer = new Crypto.Address(this.ledgerWallet.address);;
          const txData = tx.serializeUnsignedData();
          legacySignWithLedger(txData).then(res => {
              // console.log('txSigned: ' + res);
              const sign = "01" + res; //ECDSAwithSHA256
              txSig.sigData = [sign];
              tx.sigs = [txSig];
              if(this.isDelegateSendTx) {
                this.delegateSendTx(tx);
              } else {
                this.sendTx(tx);
              }
            },
            err => {
              this.sending = false;
              this.ledgerStatus = "";
              this.$store.dispatch('hideLoadingModals')
              alert(err.message);
            }
          );
        } else {
          this.refundClicked = false;
          this.$store.dispatch("hideLoadingModals");
          this.$message.warning(this.$t("ledgerWallet.connectApp"));
        }
      }
    },
    delegateSendTx(tx) {
      const body = {
        ontid: this.stakeIdentity.ontid,
        publickey: this.nodePublicKey,
        stakewalletaddress: this.stakeWallet.address,
        transactionhash: utils.reverseHex(tx.getHash()),
        transactionbodyhash: tx.serialize()
      };
      const net = localStorage.getItem("net");
      const ontPassNode =
        net === "TEST_NET" ? ONT_PASS_NODE : ONT_PASS_NODE_PRD;
      axios.post(ontPassNode + ONT_PASS_URL.DelegateSendTx, body).then(res => {
        this.walletPassModal = false;
        this.walletPassword = ''
        this.tx = ''
        this.$store.dispatch("hideLoadingModals");
        this.$store.dispatch("fetchStakeDetail", 
        { 
          address: this.stakeWallet.address, 
          public_key: this.nodePublicKey
        });
      }).catch(err=>{
        this.$store.dispatch("hideLoadingModals");
        this.$message.error(this.$t('common.networkErr'))
      });
      setTimeout(() => {
        this.refundClicked = false;
      }, 5000)
    },
    sendTx(tx){
        const url = getNodeUrl();
        const restClient = new RestClient(url);
        restClient.sendRawTransaction(tx.serialize()).then(res => {
        console.log(res)
        this.isDelegateSendTx = true;
        this.walletPassModal = false;
        this.walletPassword = '';
        this.$store.dispatch("hideLoadingModals");
        if (res.Error === 0) {
            this.$message.success(this.$t('common.transSentSuccess'))
        } else if (res.Error === -1) {
          if(res.Result.indexOf('balance insufficient') > -1 ) {
              this.$message.error(this.$t('common.balanceInsufficient'))
          } else if(res.Result.indexOf('cover gas cost') > -1) {
              this.$message.error(this.$t('common.ongNoEnough'))
          } else {
              this.$message.error(res.Result)
          }
          return;
        } else {
            this.$message.error(res.Result)
            return;
        }
        this.$emit('txSent')
        const title = this.$t('common.transSentSuccess')
        setTimeout(() => {
            this.$success({
                title: title,
                content: 'Transaction hash: ' + utils.reverseHex(tx.getHash())
            })
        }, 100)
        }).catch(err => {
                    console.log(err)
                    this.$message.error(this.$t('common.networkError'))
                })
    },
    handleRecall() {
      const userAddr = new Crypto.Address(this.stakeWallet.address);
      const peerPubkey = this.nodePublicKey;
      const payer = userAddr;
      const tx = GovernanceTxBuilder.makeUnregisterCandidateTx(
        userAddr,
        peerPubkey,
        payer,
        GAS_PRICE,
        GAS_LIMIT
      );
      this.tx = tx;
      this.walletPassModal = true;
    },

    handleRefund() {
        if(this.authorizationInfo && this.authorizationInfo.claimableVal === 0) {
          this.$message.warning(this.$t('nodeMgmt.noClaimbleToRefund'))
          return;
        }
        const userAddr = new Crypto.Address(this.stakeWallet.address);
        const peerPubkeys = [this.nodePublicKey]
        // const withdrawList = [this.detail.stakequantity]
        // Fix:节点质押部分可能会增加或减少，退款应该用initPos； 
        // Fix2: 退款都可以用可提取部分
        const withdrawList = [this.authorizationInfo.claimableVal]        
        const payer = userAddr
        const tx = GovernanceTxBuilder.makeWithdrawTx(userAddr, peerPubkeys, withdrawList, payer, GAS_PRICE, GAS_LIMIT)
        this.tx = tx;
        this.walletPassModal = true;
    },
    handleQuitNode() {
        //Fixme:退出节点前先把可提取初始质押提取出来。
        if(this.authorizationInfo && this.authorizationInfo.claimableVal > 0) {
          this.$message.warning(this.$t('nodeMgmt.hasClaimableInitPos'))
          return;
        }
        const userAddr = new Crypto.Address(this.stakeWallet.address);
        const peerPubkey = this.nodePublicKey;
        const payer = userAddr;   
        const tx = GovernanceTxBuilder.makeQuitNodeTx(userAddr, peerPubkey, payer, GAS_PRICE, GAS_LIMIT)
        this.tx = tx;
        this.walletPassModal = true;
    },
    handleNewStake() {
      // this.$router.push({ name: "NodeStakeRegister" });
      this.$router.push({name: 'NodeApply'})
    },
    handleAddInitPos() {
      this.addPosVisible = true;
    },
    handleReduceInitPos() {
      this.reducePosVisible = true;
    },
    validateAddPos() {
      if(this.addPos && !varifyPositiveInt(this.addPos)) {
        this.validAddPos = false;
        return;
      }
      this.validAddPos = true;
    },
    validateReducePos() {
      if(this.reducePos && !varifyPositiveInt(this.reducePos)) {
        this.validReducePos = false;
        return;
      }
      if(this.current_peer.totalPos === 0 && (this.current_peer.initPos - this.reducePos) <  this.detail.commitmentquantity) {
        this.validReducePos = false;
        this.$message.error(this.$t('nodeMgmt.notThanCommitment'))
        return;
      }
      if(this.current_peer.totalPos && (this.current_peer.initPos - this.reducePos)* this.posLimit < this.current_peer.totalPos ) {
        this.validaReducePos = false;
        this.$message.error(this.$t('nodeMgmt.notLessTotalPos'))        
        return;
      }
      this.validReducePos = true;
    },
    handleAddPosOk() {
      if(!this.validAddPos) {
        this.$message.error(this.$t('nodeMgmt.invalidInput'))
        return;
      }
      this.addPosVisible = false;
      const userAddr = new Crypto.Address(this.stakeWallet.address);      
      const tx = GovernanceTxBuilder.makeAddInitPosTx(
        this.nodePublicKey,
        userAddr,
        parseInt(this.addPos),
        userAddr,
        GAS_PRICE,
        GAS_LIMIT
      )
      this.tx = tx;
      this.walletPassModal = true;
      this.isDelegateSendTx = false;
    },
    handleAddPosCancel() {
      this.addPosVisible = false;
    },
    handleReducePosOk() {
      if(!this.validReducePos) {
        this.$message.error(this.$t('nodeMgmt.invalidInput'))
        return;
      }
      this.reducePosVisible = false;
      const userAddr = new Crypto.Address(this.stakeWallet.address);      
      const tx = GovernanceTxBuilder.makeReduceInitPosTx(
        this.nodePublicKey,
        userAddr,
        parseInt(this.reducePos),
        userAddr,
        GAS_PRICE,
        GAS_LIMIT
      )
      this.tx = tx;
      this.walletPassModal = true;
      this.isDelegateSendTx = false;
    },
    handleReducePosCancel() {
      this.reducePosVisible = false;
    },
    handleRedeemPosOk() {
      if(this.authorizationInfo && this.authorizationInfo.claimableVal === 0) {
        this.$message.warning(this.$t('nodeMgmt.noClaimbleInitPos'))
        return;
      }
      this.redeemPosVisible = false;
      const userAddr = new Crypto.Address(this.stakeWallet.address);
      const peerPubkeys = [this.nodePublicKey]
      const withdrawList = [this.authorizationInfo.claimableVal]        
      const payer = userAddr
      const tx = GovernanceTxBuilder.makeWithdrawTx(userAddr, peerPubkeys, withdrawList, payer, GAS_PRICE, GAS_LIMIT)
      this.tx = tx;
      this.walletPassModal = true;
      this.isDelegateSendTx = false;
    },
    handleRedeemPosCancel() {
      this.redeemPosVisible = false;
    }
  }
};
</script>
