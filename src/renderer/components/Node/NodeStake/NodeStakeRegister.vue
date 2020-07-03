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
  /* padding-left: 50px;
    padding-right: 50px; */
}
.step-item-container div {
  width: 30%;
  text-align: center;
}
.btn-stake {
  text-align: center;
  margin: 0 auto;
}
.btn-stake p {
  font-size: 12px;
  margin-bottom: 10px;
  margin-top: 5px;
}
</style>
<template>
    <div >
        <breadcrumb  :current="$t('nodeStake.nodeStake')" v-on:backEvent="handleRouteBack"></breadcrumb>
        <div class="nodeStake-container">

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
                <a-input class="input" v-model="stakeQuantity"></a-input>
            </div>
        </div>
        <div class="footer-btns">
            <div class="btn-stake">
                <p class="font-medium"><a-icon type="info-circle-o" /> {{$t('nodeStake.feeTip')}}</p>
                <a-button type="primary" class="btn-next" @click="handleStake">{{$t('nodeStake.stake')}}</a-button>
            </div>
            
        </div>
        <a-modal 
        :title="$t('nodeStake.signWithOntid')"
        :visible="ontidPassModal"
        @ok="handleOntidSignOK"
        @cancel="handleOntidSignCancel">
          <div>
              <p>{{$t('nodeStake.enterOntidPass')}}</p>
              <a-input class="input" v-model="ontidPassword" :plaecholder="$t('nodeStake.password')" type="password"></a-input>
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
import { GAS_PRICE, GAS_LIMIT, TEST_NET, MAIN_NET, ONT_PASS_NODE, ONT_PASS_NODE_PRD, ONT_PASS_URL, DEFAULT_SCRYPT } from "../../../../core/consts";
import { Crypto, TransactionBuilder, RestClient, utils, GovernanceTxBuilder, TxSignature } from "ontology-ts-sdk";
import axios from 'axios'
import {legacySignWithLedger} from '../../../../core/ontLedger'

export default {
  name: "NodeStakeRegister",
  components: {
    Breadcrumb
  },
  beforeDestroy(){
    this.$store.dispatch('stopGetLedgerStatus')
  },
  data() {
    const net = localStorage.getItem('net');
    return {
      localOntid: [],
      stakeQuantity: 0,
      ontidPassModal: false,
      walletPassModal: false,
      walletModalHandled: false,
      ontidPassword: "",
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
  },
  computed: {
    ...mapState({
      stakeIdentity: state => state.NodeStake.stakeIdentity,
      stakeWallet: state => state.NodeStake.stakeWallet,
      detail: state => state.NodeStake.detail,
      ledgerStatus: state => state.LedgerConnector.ledgerStatus,
        ledgerPk : state => state.LedgerConnector.publicKey,
        ledgerWallet: state => state.LedgerConnector.ledgerWallet
    })
  },
  methods: {
    handleRouteBack() {
      this.$router.go(-1);
    },
    handleStake() {
      if (!this.stakeQuantity) {
        this.$message.error(this.$t("nodeStake.stakeQuantityEmpty"));
        return;
      }
      const ontid = this.detail.ontid;
      const peerPubkey = this.detail.publickey;
      const keyNo = 1;
      const userAddr = new Crypto.Address(this.detail.stakewalletaddress);
      const initPos = parseInt(this.stakeQuantity);
      const payer = userAddr;
      const tx = GovernanceTxBuilder.makeRegisterCandidateTx(
        ontid,
        peerPubkey,
        keyNo,
        userAddr,
        initPos,
        payer,
        GAS_PRICE,
        GAS_LIMIT
      );
      this.tx = tx;
      this.ontidPassModal = true;
    },
    handleOntidSignOK() {
      if(!this.ontidPassword) {
        this.$message.error(this.$t('nodeStake.passwordEmpty'))
        return;
      }
      if (this.ontidPassword) {
        const enc = new Crypto.PrivateKey(this.stakeIdentity.controls[0].key);
        let pri;
        try {
          pri = enc.decrypt(
            this.ontidPassword,
            new Crypto.Address(this.stakeIdentity.controls[0].address),
            this.stakeIdentity.controls[0].salt
          );// ontid use 4096 as n
        } catch (err) {
          console.log(err);
          this.$message.error(this.$t("common.pwdErr"));
          return;
        }
        TransactionBuilder.signTransaction(this.tx, pri);
        this.ontidPassModal = false;
        this.walletPassModal = true;
      }
    },
    handleOntidSignCancel() {
      this.ontidPassModal = false;
    },
    handleWalletSignOK(){
      if(this.walletModalHandled) {
        return;
      }
      this.walletModalHandled = true;
      if(this.stakeWallet.key && !this.walletPassword) { //common wallet
        this.$message.error(this.$t('nodeStake.passwordEmpty'))
        return;
      }
      if(this.stakeWallet.key) {
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
          this.$message.error(this.$t("common.pwdErr"));
          this.walletModalHandled = false;
          return;
        }
        TransactionBuilder.addSign(this.tx, pri);
        this.delegateSendTx(this.tx);
      } else { //ledger sign
        if(this.ledgerWallet.address) {
            this.$store.dispatch('showLoadingModals')
            const tx = this.tx;
            const pk = new Crypto.PublicKey(this.ledgerWallet.publicKey);
            const txSig = new TxSignature();
            txSig.M = 1;
            txSig.pubKeys = [pk];
            tx.payer = new Crypto.Address(this.ledgerWallet.address);
            const txData = tx.serializeUnsignedData();
            legacySignWithLedger(txData).then(res => {
            // console.log('txSigned: ' + res);
            const sign = '01' + res; //ECDSAwithSHA256
            txSig.sigData = [sign]
            tx.sigs.push(txSig);
            this.delegateSendTx(tx);
            }, err => {
                this.walletModalHandled = false;
                this.$store.dispatch('hideLoadingModals')
                alert(err.message)
            }) 
        } else {
            this.$message.warning(this.$t('ledgerWallet.connectApp'))
        }

      }
    },
    handleWalletSignCancel() {
      this.walletPassModal = false;
    },
    delegateSendTx(tx){
      const body = {
        ontid: this.stakeIdentity.ontid,
        publickey: this.detail.publickey,
        stakewalletaddress: this.stakeWallet.address,
        transactionhash: utils.reverseHex(tx.getHash()),
        transactionbodyhash: tx.serialize()
      }
      const net = localStorage.getItem('net')
      const ontPassNode = net === 'TEST_NET' ? ONT_PASS_NODE : ONT_PASS_NODE_PRD
      this.$store.dispatch('showLoadingModals')
      axios.post(ontPassNode + ONT_PASS_URL.DelegateSendTx, body).then(res => {
        this.$store.dispatch('hideLoadingModals')
        this.walletModalHandled = false;
        const params = {
          ontid: this.stakeIdentity.ontid,
          stakewalletaddress: this.stakeWallet.address,
          stakequantity: this.stakeQuantity
        }
        axios.post(ontPassNode + ONT_PASS_URL.SetStakeInfo, params).then(res => {
          this.$router.push({name: 'NodeStakeInfo'})
        })
      }).catch(err => {
        this.$store.dispatch('hideLoadingModals')
        this.walletModalHandled = false;
        console.log(err)
        this.$message.error(this.$t('nodeStake.txFailed'))
        this.walletPassModal = false;
      })
    }

  }
}
</script>
