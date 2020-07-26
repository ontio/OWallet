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
  font-size: 16px;
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
  margin: 15px 0;
  border-radius: 0;
}

.in-authorization {
  margin: 15px 0 0 0;
}
.authorize-tip {
  font-size: 16px;
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
  width: 100%;
}
.redeem-item span:first-child {
  width: 150px;
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
  background: #fbe45a;
  padding: 0;
  font-family: AvenirNext-Medium;
  font-size: 14px;
  color: #5e6369;
  border: none;
  margin-bottom: 15px;
}
.cancel-stake-input {
  width: 200px;
}
</style>
<template>
  <div>
    <breadcrumb :current="$t('nodeMgmt.stakeAuthorization')" v-on:backEvent="handleRouteBack"></breadcrumb>
    <div class="content-container">
      <div class="left-half">
        <div>
          <span class="font-medium-black label">{{$t('nodeMgmt.nodeName')}}:</span>
          <span class="font-medium">Sesameseed</span>
        </div>
        <div>
          <span class="label font-medium-black">{{$t('nodeMgmt.walletAddress')}}:</span>
          <span class="font-medium">{{stakeWallet.address}}</span>
          <a-tooltip placement="top" :title="$t('nodeMgmt.switchWallet')">
            <span class="switch-wallet" @click="switchWallet">
              <a-icon type="sync" />
            </span>
          </a-tooltip>
        </div>
        <a-button
          type="primary"
          class="btn-next new-stake"
          @click="newStakeAuthorization"
        >{{$t('nodeMgmt.newStakeAuthorization')}}</a-button>
        <div class="in-authorization">
          <span class="label font-medium-black">{{$t('nodeMgmt.inAuthorization')}}:</span>
          <span class="font-medium">{{ssInfo.votes}} ONT</span>
        </div>
        <div class="authorize-tip">
          <a-icon type="info-circle" />
          <span class="font-regular tip-font">{{$t('sesameseed.authorizeTip')}}</span>
        </div>
        <a-button
          type="default"
          class="cancel-btn"
          @click="cancelAuthorization"
        >{{$t('nodeMgmt.cancelAuthorization')}}</a-button>
        <div class="redeem-ont">
          <p>
            <span class="font-medium-black label">
              <a-tooltip placement="right" :title="$t('sesameseed.pendingWithdrawals')">
                <a-icon type="info-circle-o" />
              </a-tooltip>
              {{$t('sesameseed.pendingWithdrawals')}}:
            </span>
            <span class="font-medium">{{ssInfo.pendingWithdrawals}} ONT</span>
          </p>
        </div>
      </div>
      <!-- <div class="right-half">

      </div>-->
    </div>
    <a-modal
      :title="$t('nodeMgmt.cancelAuthorization')"
      :visible="cancelVisible"
      @ok="handleCancelAuthorizationOk"
      @cancel="handleCancelAuthorizationCancel"
    >
      <div>
        <div>
          <span class="font-medium-black label">{{$t('nodeMgmt.nodeName')}}:</span>
          <span class="font-medium">{{current_node.name}}</span>
        </div>
        <div class="in-authorization">
          <span class="label font-medium-black">{{$t('nodeMgmt.inAuthorization')}}:</span>
          <span class="font-medium">{{ssInfo.votes}} ONT</span>
        </div>
        <div>
          <span class="label font-medium-black">{{$t('nodeMgmt.unitToCancel')}}:</span>
          <a-input
            class="input cancel-stake-input"
            :class="validCancelAmount? '': 'error-input'"
            v-model="cancelAmount"
            @change="validateCancelAmount"
          ></a-input>
          {{$t('nodeMgmt.cancelUnits')}}
        </div>
        <div>
          <span class="label font-medium-black">{{$t('nodeMgmt.amountToCancel')}}:</span>
          <span class="font-medium">{{cancelAmount}} ONT</span>
        </div>
      </div>
    </a-modal>
    <sign-send-tx
      :visible="signVisible"
      :tx="tx"
      :wallet="stakeWallet"
      v-on:signClose="handleCancel"
      v-on:txSent="handleTxSent"
    ></sign-send-tx>
  </div>
</template>
<script>
import Breadcrumb from "../../../Breadcrumb";
import { mapState } from "vuex";
import SignSendTx from "../../../Common/SignSendTx";
import { GAS_PRICE, GAS_LIMIT } from "../../../../core/consts";
import { Crypto, TransactionBuilder, utils } from "ontology-ts-sdk";
import numeral from "numeral";
import { varifyPositiveInt } from "../../../../core/utils.js";
import { CONTRACT_HASH } from "./SesameseedVars";

export default {
  name: "AuthorizationMgmtSesameseed",
  components: {
    Breadcrumb,
    SignSendTx
  },
  data() {
    return {
      intervalId: "",
      signVisible: false,
      // inAuthorization: 0,
      // locked: 0,
      // claimable:0,
      tx: "",
      cancelVisible: false,
      cancelAmount: 0,
      validCancelAmount: true
    };
  },
  mounted() {
    //fetch stake info
    // const pk = this.stakeDetail.publicKey
    this.refresh();
    this.intervalId = setInterval(() => {
      this.refresh();
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },

  computed: {
    ...mapState({
      current_node: state => state.NodeAuthorization.current_node,
      stakeWallet: state => state.NodeStake.stakeWallet,
      splitFee: state => state.NodeAuthorization.splitFee,
      authorizationInfo: state => state.NodeAuthorization.authorizationInfo,
      peer_attrs: state => state.NodeAuthorization.peer_attrs,
      unboundOng: state => state.NodeAuthorization.peerUnboundOng,
      ssInfo: state => state.NodeAuthorizationSesameseed.sesameseed
    }),
  },
  methods: {
    refresh() {
      const address = this.stakeWallet.address;
      const pk = this.current_node.pk;
      this.$store.dispatch("fetchAuthorizationInfo", { pk, address });
      this.$store.dispatch("fetchSplitFee", address);
      this.$store.dispatch("fetchPeerAttributes", pk);
      this.$store.dispatch("fetchPeerUnboundOng", address);
      this.$store.dispatch("fetchSSPerInfo", address);
    },
    handleRouteBack() {
      this.$router.go(-1);
    },
    newStakeAuthorization() {
      this.$router.push({ name: "NewAuthorizationSesameseed" });
    },
    switchWallet() {
      this.$router.push({ name: "AuthorizeLoginSesameseed" });
    },
    handleRefresh() {
      this.$store.dispatch("showLoadingModals");
      setTimeout(() => {
        this.$store.dispatch("hideLoadingModals");
      }, 100);
      const address = this.stakeWallet.address;
      const pk = this.current_node.pk;
      this.$store.dispatch("fetchAuthorizationInfo", { pk, address });
      this.$store.dispatch("fetchSplitFee", address);
      this.$store.dispatch("fetchPeerAttributes", pk);
      this.$store.dispatch("fetchSSPerInfo", address);
    },
    handleCancel() {
      this.signVisible = false;
      this.tx = "";
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
        indexKey: address + "-" + pk,
        stakeWalletAddress: address,
        nodePk: pk,
        nodeName: this.current_node.name
      };
      const txHash = utils.reverseHex(this.tx.getHash());
      this.tx = "";
      // this.$store.dispatch('recordStakeHistory', {txHash, record})
    },
    validateCancelAmount() {
      if (!this.cancelAmount || !varifyPositiveInt(this.cancelAmount)) {
        this.validCancelAmount = false;
        return;
      }
      if (Number(this.cancelAmount) > this.ssInfo.votes) {
        this.validCancelAmount = false;
        return;
      }
      this.validCancelAmount = true;
    },
    handleCancelAuthorizationOk() {
      if (!this.cancelAmount || !this.validCancelAmount) {
        this.$message.error(this.$t("nodeMgmt.invalidInput"));
        return;
      }
      this.cancelVisible = false;
      this.signVisible = true;
      const userAddr = new Crypto.Address(this.stakeWallet.address);
      const amount = Number(this.cancelAmount);
      const tx = TransactionBuilder.makeTransactionsByJson({
        action: "invoke",
        params: {
          login: true,
          invokeConfig: {
            contractHash: CONTRACT_HASH,
            functions: [
              {
                operation: "Unvote",
                args: [
                  {
                    name: "from_acct",
                    value: "Address:" + this.stakeWallet.address
                  },
                  {
                    name: "amount",
                    value: amount
                  }
                ]
              }
            ],
            gasLimit: GAS_LIMIT,
            gasPrice: GAS_PRICE,
            payer: this.stakeWallet.address
          }
        }
      });
      this.tx = tx[0];
      this.cancelAmount = 0;
    },
    handleCancelAuthorizationCancel() {
      this.cancelVisible = false;
    },
    cancelAuthorization() {
      this.cancelVisible = true;
      this.tx = "";
    }
  }
};
</script>
