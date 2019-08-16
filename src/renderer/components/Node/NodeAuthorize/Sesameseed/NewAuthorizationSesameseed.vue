<style scoped>
.content-container {
  width: 540px;
  margin: 20px auto;
}
.content-container div {
  margin-bottom: 15px;
}
.label {
  font-size: 16px;
}
.authorize-tip {
  font-size: 16px;
  padding-left: 15px;
}
.error-input {
  border-color: red !important;
}
.unit-input {
  width: 100px;
}
.btn-container {
  text-align: center;
}
</style>

<template>
  <div>
    <breadcrumb :current="$t('nodeMgmt.stakeAuthorization')" v-on:backEvent="handleRouteBack"></breadcrumb>
    <div class="content-container">
      <div>
        <span class="font-medium-black label">{{$t('nodeMgmt.nodeName')}}:</span>
        <span class="font-medium">{{current_node.name}}</span>
      </div>
      <div>
        <span class="font-medium-black label">{{$t('nodeMgmt.allowedStakeAmount')}}:</span>
        <span class="font-medium">{{current_node.maxAuthorizeStr}} ONT</span>
      </div>
      <div>
        <span class="font-medium-black label">{{$t('nodeMgmt.totalStakeAmount')}}:</span>
        <span class="font-medium">{{current_node.totalPosStr}} ONT</span>
      </div>
      <div>
        <span class="label font-medium-black">{{$t('nodeMgmt.walletAddress')}}:</span>
        <span class="font-medium">{{stakeWallet.address}}</span>
      </div>
      <div>
        <span class="font-medium-black label">{{$t('nodeMgmt.units')}}:</span>
        <a-input
          type="text"
          class="input unit-input"
          v-model="units"
          @change="handleChange"
          :class="validInput? '' : 'error-input'"
        ></a-input>
      </div>
      <p class="authorize-tip">
        <a-icon type="info-circle" />
        <span class="font-regular">{{$t('sesameseed.stakeAmountTip')}}</span>
      </p>
      <div>
        <span class="font-medium-black label">{{$t('nodeMgmt.stakeAmount')}}:</span>
        <span class="font-medium">{{amount}} ONT</span>
      </div>
    </div>
    <div class="footer-btns">
      <div class="btn-container">
        <a-button type="primary" class="btn-next" @click="submit">{{$t('nodeMgmt.submit')}}</a-button>
      </div>
    </div>

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
import { varifyPositiveInt } from "../../../../../core/utils.js";
import SignSendTx from "../../../Common/SignSendTx";
import { mapState } from "vuex";
import { GAS_LIMIT, GAS_PRICE } from "../../../../../core/consts";
import { Crypto, TransactionBuilder, utils } from "ontology-ts-sdk";
import { CONTRACT_HASH } from "./SesameseedVars";

export default {
  name: "NewAuthorizationSesameseed",
  components: {
    Breadcrumb,
    SignSendTx
  },
  data() {
    return {
      units: 1,
      amount: 1,
      validInput: true,
      signVisible: false,
      tx: ""
    };
  },
  computed: {
    ...mapState({
      current_node: state => state.NodeAuthorization.current_node,
      stakeWallet: state => state.NodeStake.stakeWallet,
      peer_attrs: state => state.NodeAuthorization.peer_attrs
    })
  },
  methods: {
    handleRouteBack() {
      this.$router.go(-1);
    },
    handleChange() {
      if (!this.units || !varifyPositiveInt(this.units)) {
        this.validInput = false;
        return;
      }
      this.amount = parseInt(this.units);
      if (
        this.units &&
        this.amount >
          this.current_node.maxAuthorize - this.current_node.totalPos
      ) {
        this.validInput = false;
        return;
      }

      this.validInput = true;
    },
    handleCancel() {
      this.signVisible = false;
      this.tx = "";
    },
    handleTxSent() {
      this.signVisible = false;
      // this.tx = ''
      this.$router.go(-1);
      //record stake history
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
    submit() {
      if (!this.validInput) {
        this.$message.error(this.$t("nodeMgmt.invalidInput"));
        return;
      }
      const userAddr = new Crypto.Address(this.stakeWallet.address);
      const tx = TransactionBuilder.makeTransactionsByJson({
        action: "invoke",
        params: {
          login: true,
          message: "Sesameseed Vote",
          invokeConfig: {
            contractHash: CONTRACT_HASH,
            functions: [
              {
                operation: "Vote",
                args: [
                  {
                    name: "from_acct",
                    value: "Address:" + this.stakeWallet.address
                  },
                  {
                    name: "amount",
                    value: this.amount
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
      this.signVisible = true;
    }
  }
};
</script>
