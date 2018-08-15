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
                <p class="font-medium"><a-icon type="warning" /> {{$t('nodeStake.feeTip')}}</p>
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
    </div>
</template>

<script>
import Breadcrumb from "../Breadcrumb";
import { mapState } from "vuex";
import { GAS_PRICE, GAS_LIMIT } from "../../../core/consts";
import { Crypto, TransactionBuilder } from "ontology-ts-sdk";

export default {
  name: "NodeStakeView",
  components: {
    Breadcrumb
  },
  data() {
    const nodeStakeOntid = localStorage.getItem("nodeStakeOntid") || "";
    return {
      nodeStakeOntid,
      localOntid: [],
      stakeQuantity: 10,
      ontidPassModal: false,
      walletPassModal: false,
      ontidPassword: "",
      walletPassword: "",
      tx: "",
      detail: {
        ontid: "did:ont:AKbC3ZaSBQ1GuNKsbcqWxi3uL2oyf9F8vK",
        stakewalletaddress: "AazEvfQPcQ2GEFFPLF1ZLwQ7K5jDn81hve",
        publickey:
          "035384561673e76c7e3003e705e4aa7aee67714c8b68d62dd1fb3221f48c5d3da0",
        contract: "testcontractname",
        commitmentquantity: 100000,
        stakequantity: 10,
        transactionhash:
          "364a945fc0e0fbbb05b09ededbbf4b22e1357653c924341cc210906cbd5305e0",
        status: 3
      }
    };
  },
  mounted() {
    //fetch node stake details
    this.$store.dispatch("fetchStakeDetail", this.stakeIdentity.ontid);
  },
  computed: {
    ...mapState({
      stakeIdentity: state => state.NodeStake.stakeIdentity,
      stakeWallet: state => state.NodeStake.stakeWallet
      // detail: state => state.NodeStake.detail
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
      const tx = Ont.GovernanceTxBuilder.makeRegisterCandidateTx(
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
      if (this.ontidPassword) {
        const enc = new Crypto.PrivateKey(this.stakeIdentity.controls[0].key);
        let pri;
        try {
          pri = enc.decrypt(
            this.password,
            new Crypto.Address(this.currentWallet.address),
            this.currentWallet.salt,
            DEFAULT_SCRYPT
          );
        } catch (err) {
          this.sending = false;
          console.log(err);
          this.$message.error(this.$t("common.pwdErr"));
          return;
        }
        TransactionBuilder.signTransaction(tx, pri);
      }
    },
    handleOntidSignCancel() {}
  }
};
</script>
