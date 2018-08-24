<style scoped>
.nodeStake-container {
  width: 540px;
  margin: 20px auto;
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
</style>
<template>
    <div >
        <!-- <breadcrumb  :current="$t('nodeStake.nodeStake')" v-on:backEvent="handleRouteBack"></breadcrumb> -->
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

            <div class="detail-item">
                <p class="font-medium-black" for="">{{$t('nodeStake.ontid')}}</p>
                <p>{{detail.ontid}}</p>
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
                <p>{{detail.stakequantity}}</p>
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
import { Crypto, TransactionBuilder, utils } from "ontology-ts-sdk";
import {legacySignWithLedger} from '../../../../core/ontLedger'

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
  components: {
    Breadcrumb
  },
  data() {
    return {
      localOntid: [],
      intervalId: "",
      interval: 5000,
      refundClicked: false,
    //   detail: {
    //     ontid: "did:ont:AKbC3ZaSBQ1GuNKsbcqWxi3uL2oyf9F8vK",
    //     stakewalletaddress: "AazEvfQPcQ2GEFFPLF1ZLwQ7K5jDn81hve",
    //     publickey:
    //       "035384561673e76c7e3003e705e4aa7aee67714c8b68d62dd1fb3221f48c5d3da0",
    //     contract: "testcontractname",
    //     commitmentquantity: 100000,
    //     stakequantity: 10,
    //     transactionhash:
    //       "364a945fc0e0fbbb05b09ededbbf4b22e1357653c924341cc210906cbd5305e0",
    //     status: 3
    //   },
      walletPassModal: false,
      walletPassword: "",
      tx: ""
    };
  },
  mounted() {
    //fetch node stake details
    if(!this.stakeWallet.key) {//common wallet
      this.$store.dispatch('getLedgerStatus')
    }
    this.$store.dispatch("fetchStakeDetail", this.stakeIdentity.ontid);
    const intervalId = setInterval(() => {
      this.$store.dispatch("fetchStakeDetail", this.stakeIdentity.ontid);
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
      ledgerStatus: state => state.LedgerConnector.ledgerStatus,
      ledgerPk : state => state.LedgerConnector.publicKey,
      ledgerWallet: state => state.LedgerConnector.ledgerWallet,
      detail: state => state.NodeStake.detail,
      // detail: state => state.NodeStake.detail
      status1: state => state.NodeStake.status1,
      status2: state => state.NodeStake.status2,
      status3: state => state.NodeStake.status3,
      current: state => state.NodeStake.current,
      statusTip: state => state.NodeStake.statusTip,
      btnText: state => state.NodeStake.btnText
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
        this.delegateSendTx(tx);
      } else {
        //ledger sign
        if (this.ledgerWallet.address) {
          this.$store.dispatch("showLoadingModals");
          const pk = new Ont.Crypto.PublicKey(this.ledgerWallet.publicKey);
          const txSig = new Ont.TxSignature();
          txSig.M = 1;
          txSig.pubKeys = [pk];
          tx.payer = new Crypto.Address(this.ledgerWallet.address);;
          const txData = tx.serializeUnsignedData();
          legacySignWithLedger(txData, this.publicKey).then(res => {
              // console.log('txSigned: ' + res);
              const sign = "01" + res; //ECDSAwithSHA256
              txSig.sigData = [sign];
              tx.sigs = [txSig];
              this.delegateSendTx(tx);
            },
            err => {
              this.sending = false;
              this.ledgerStatus = "";
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
        this.$store.dispatch("fetchStakeDetail", this.stakeIdentity.ontid);
      }).catch(err=>{
        this.$store.dispatch("hideLoadingModals");
        this.$message.error(this.$t('common.networkErr'))
      });
      setTimeout(() => {
        this.refundClicked = false;
      }, 5000)
    },
    handleRecall() {
      const userAddr = new Crypto.Address(this.stakeWallet.address);
      const peerPubkey = this.detail.publickey;
      const payer = userAddr;
      const tx = Ont.GovernanceTxBuilder.makeUnregisterCandidateTx(
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
        const userAddr = new Crypto.Address(this.stakeWallet.address);
        const peerPubkeys = [this.detail.publickey]
        const withdrawList = [this.detail.stakequantity]
        const payer = userAddr
        const tx = Ont.GovernanceTxBuilder.makeWithdrawTx(userAddr, peerPubkeys, withdrawList, payer, GAS_PRICE, GAS_LIMIT)
        this.tx = tx;
        this.walletPassModal = true;
    },
    handleQuitNode() {
        const userAddr = new Crypto.Address(this.stakeWallet.address);
        const peerPubkey = this.detail.publickey;
        const payer = userAddr;   
        const tx = Ont.GovernanceTxBuilder.makeQuitNodeTx(userAddr, peerPubkey, payer, GAS_PRICE, GAS_LIMIT)
        this.tx = tx;
        this.walletPassModal = true;
    },
    handleNewStake() {
      this.$router.push({ name: "NodeStakeRegister" });
    }
  }
};
</script>
