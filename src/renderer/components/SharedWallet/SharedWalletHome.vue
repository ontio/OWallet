<style scoped>
.header-header {
  height: 4rem;
  padding: 1.1rem 0;
  width: 100%;
}
.home-container {
  padding: 0 20px;
  height: 100%;
}

.content-container {
  display: flex;
}

.left-half {
  flex: 1;
}

.right-half {
  flex: 1;
  padding-left: 67px;
}

.asset {
  margin: 20px auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.claim-btn {
  text-align: center;
}

.rule {
  text-align: center;
}

.owners-table {
}

.table-item {
  margin: 10px 0;
}
.table-item :first-child {
  width: 72px;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
}
.table-item :last-child {
  float: right;
}
.wallet-info {
  position: relative;
  padding-top: 12px;
  font-family: AvenirNext-Regular;
  font-size: 0.88rem;
  /* height: 4rem; */
}
.wallet-info p {
  margin-bottom: 4px;
}

.wallet-type {
  position: absolute;
  width: 3rem;
  height: 3rem;
  background: url("../../assets/sharedWallet.png") center center;
  background-size: cover;
  right: 0;
  top: -12px;
}

.copayer-header {
  padding-bottom: 5px;
  border-bottom: 1px solid #dfe2e9;
}
.copayer-header :last-child {
  float: right;
  font-family: AvenirNext-Bold;
  font-size: 14px;
  color: #6f7781;
}
.copayer-header :first-child {
  font-family: AvenirNext-Bold;
  font-size: 14px;
  color: #000000;
}
.check-more {
  font-family: AvenirNext-Medium;
  font-size: 12px;
  color: #227eec;
  text-align: center;
  cursor: pointer;
}
.txList-header {
  padding-bottom: 5px;
  border-bottom: 1px solid #dfe2e9;
  position: relative;
  margin-bottom: 10px;
}
.txList-header :first-child {
  font-family: AvenirNext-Bold;
  font-size: 14px;
  color: #000000;
  text-align: center;
}

/* .txList-header :last-child {
  width: 64px;
  height: 64px;
  display: block;
  float: right;
  background: url("../../assets/transaction.png");
  background-size: contain;
  top: -20px;
  right: 0;
  position: absolute;
} */
.pending-tx {
  margin-bottom: 50px;
}

.pending-tx-container {
  height: 150px;
  overflow-y: auto;
}
.pending-tx-container::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.pending-tx-container::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.pending-tx-container::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}


.commonWallet-btn {
  width: 70px;
  height: 28px;
  border-radius: 0;
  background: #fbe45a;
  padding: 0;
  font-family: AvenirNext-Medium;
  font-size: 14px;
  color: #5e6369;
  border: none;
}
.commonWallet-btn {
  width: 70px;
  height: 28px;
  border-radius: 0;
  background: #fbe45a;
  padding: 0;
  font-family: AvenirNext-Medium;
  font-size: 14px;
  color: #5e6369;
  border: none;
}
.btn-swap {
  margin-left: 30px;
}
.btn-redeem {
  float: left;
  margin-left: 30px;
}
.btn-dropdown {
  width: 120px;
  height: 34px;
  background: #f4f4f6;
  font-size: 14px;
  font-family: AvenirNext-Medium;
  font-weight: 500;
  color: rgba(25, 107, 216, 1);
  border-radius: 0;
  border: none;
}
.dropdown-item:hover {
  color: #196bd8;
}
.left-btn-container {
  display: flex;
  justify-content: space-between;
}
.left-btn-more {
    display:flex;
}
.vertical-line {
    width:2px;
    height:34px;
    background:#F4F4F6;
    margin-right:29px;
}
.icon-arow {
    font-size: 10px;
    margin-left:4px;
}

</style>
<template>
  <div class="home-container">
    <breadcrumb :current="sharedWallet.sharedWalletName" v-on:backEvent="handleBack"></breadcrumb>
    <div class="wallet-info">
      <p class="font-regular">
        {{$t('sharedWalletHome.walletAddress')}}: <span class="font-gray">{{this.sharedWallet.sharedWalletAddress}}</span>
        <span class="common-icon copy-icon" @click="copy()"></span>
      </p>
    </div>
    <div class="content-container">
      <div class="left-half">
        <div class="wallet-balance">
          <div>
            <span>{{$t('sharedWalletHome.balance')}}</span>
            <span class="common-icon  refresh-icon" @click="refresh(true)"></span>
          </div>
          <span class="common-icon add-icon" @click="addOep4"></span>
        </div>
        <div class="asset-container">
          <div class="asset-item">
            <span class="asset-label">ONT</span>
            <span class="asset-amount">{{balance.ont}}</span>
          </div>
          <!-- <div class="asset-value">${{balance.ontValue}}</div> -->

          <div class="asset-item">
            <span class="asset-label">ONG</span>
            <span class="asset-amount">{{balance.ong}}</span>
          </div>
          <!-- <div class="asset-value">{{'$900'}}</div> -->

          <div class="asset-item" v-for="item of oep4s" :key="item.contract_hash">
            <span class="asset-label">{{item.symbol}}</span>
            <span class="asset-amount">{{item.balance}}</span>
          </div>
        </div>

        <div class="left-footer">
          <div class="claim-ong-container">
            <div class="claim-ong">
              <div class="claim-ong-item">
                <span>{{$t('commonWalletHome.claimableOng')}}:</span>
                <span>{{balance.unboundOng}}</span>
              </div>
              <div class="claim-ong-item">
                <span>{{$t('commonWalletHome.unboundOng')}}:</span>
                <span>{{balance.waitBoundOng}}</span>
              </div>
            </div>
            <div class="redeem-container">
              <a-button
                type="default"
                class="btn-redeem"
                @click="redeemOng"
              >{{$t('commonWalletHome.redeem')}}</a-button>
              <redeem-info-icon></redeem-info-icon>
            </div>
          </div>

          <div v-if="hasLocalCopayer" class="left-btn-container">
            <div>
              <a-button class="asset-btn" type="primary" @click="showTransferBox">
                <i class="fa fa-paper-plane"></i>
                {{$t('sharedWalletHome.send')}}
              </a-button>
              <a-button class="asset-btn" type="primary" @click="showReceive">
                <i class="fa fa-qrcode"></i>
                {{$t('sharedWalletHome.receive')}}
              </a-button>
            </div>

            <div class="left-btn-more">
              <div class="vertical-line"></div>
              <a-dropdown placement="topCenter">
                <a-menu slot="overlay">
                  <a-menu-item key="1" v-if="showPax">
                    <span @click="showPaxMgmt()">{{$t('sharedWalletHome.paxMgmt')}}</span>
                  </a-menu-item>
                  <a-menu-item key="2" @click="showTxMgmt()">
                    <span>{{$t('sharedWalletHome.txMgmt')}}</span>
                  </a-menu-item>
                  <a-menu-item key="3" @click="toCopayerDetail()">
                    <span>{{$t('sharedWalletHome.copayers')}}</span>
                  </a-menu-item>
                </a-menu>
                <a-button class="btn-dropdown">
                  {{$t('common.more')}}
                  <!-- <a-icon type="down" /> -->
                  <i class="fa fa-chevron-down icon-arrow"></i>
                </a-button>
              </a-dropdown>
            </div>
          </div>
        </div>
      </div>

      <div class="right-half">
        <div class="pending-tx">
          <div class="txList-header">
            <span>{{$t('sharedWalletHome.pendingTx')}}</span>
            <!-- <span class="transfer-icon"></span> -->
          </div>
          <div class="pending-tx-container">
            <div
              v-for="tx in pendingTx"
              :key="tx.transactionidhash"
              class="tx-item pendingTx-item"
              @click="pendingTxDetail(tx)"
            >
              <span>{{tx.transactionidhash}}</span>
              <span>
                {{tx.receiveaddress === sharedWallet.sharedWalletAddress ? '+' : '-'}}
                {{tx.amount}} {{tx.assetName}}
              </span>
            </div>
          </div>
        </div>
        <div class="completed-tx">
          <div class="txList-header">
            <span>{{$t('sharedWalletHome.completedTx')}}</span>
            <span class="transfer-icon"></span>
          </div>

          <div
            v-for="(tx) in completedTx"
            :key="tx.txHash"
            class="tx-item"
            @click="showTxDetail(tx.txHash)"
          >
            <span>{{tx.txHash.substring(0,40)+'...'}}</span>
            <span>{{tx.amount}} {{tx.asset}}</span>
          </div>
          <div
            class="check-more"
            v-if="completedTx.length > 5"
            @click="checkMoreTx"
          >{{$t('sharedWalletHome.checkMore')}}
            <i class="fa fa-chevron-right icon-arrow"></i>
          </div>
        </div>
      </div>
    </div>
    <a-modal :title="$t('redeemInfo.info')" v-model="redeemInfoVisible" @ok="handleModalOk">
      <p class="font-regular">
        <span class="font-medium"></span>
        {{$t('redeemInfo.noClaimableOng')}}
      </p>
    </a-modal>

    <oep4-selection :visible="showOep4Selection" @closeOep4Selection="closeOep4Selection"></oep4-selection>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  TEST_NET,
  MAIN_NET,
  ONT_PASS_NODE,
  ONT_PASS_NODE_PRD,
  ONT_PASS_URL,
  PAX_SC_HASH
} from "../../../core/consts";
import dbService from "../../../core/dbService";
import axios from "axios";
import Breadcrumb from "../Breadcrumb";
import { BigNumber } from "bignumber.js";
import RedeemInfoIcon from "../RedeemInfoIcon";
import Oep4Selection from "./../Common/Oep4Selection";
import {
  open,
  getRestClient,
  getTransactionListUrl,
  getBalanceUrl
} from "../../../core/utils";
import { TransactionBuilder, Crypto, utils } from "ontology-ts-sdk";
const ONG_GOVERNANCE_CONTRACT = "AFmseVrdL9f9oyCzZefL9tG6UbviEH9ugK";
export default {
  name: "SharedWalletHome",
  data() {
    const net = localStorage.getItem("net");
    const network =
      net && net === "TEST_NET"
        ? this.$t("common.testNet")
        : this.$t("common.mainNet");
    const sharedWallet = JSON.parse(sessionStorage.getItem("sharedWallet"));
    return {
      amount: 0,
      toAddress: "",
      transactions: "",
      sharedWallet,
      pendingTx: [],
      completedTx: [],
      showTransfer: false,
      transferStep: 0,
      network,
      hasLocalCopayer: true,
      interval: 15000,
      intervalId: "",
      redeemInfoVisible: false,
      requestStart: false,
      showPax: false,
      showOep4Selection: false
    };
  },
  components: {
    Breadcrumb,
    RedeemInfoIcon,
    Oep4Selection
  },
  created() {
    const net = localStorage.getItem("net");
    const scriptHash = net === "TEST_NET" ? PAX_SC_HASH.TEST : PAX_SC_HASH.MAIN;
    const contractAddr = new Crypto.Address(utils.reverseHex(scriptHash));
    const method = "getManualSupplyController";
    const tx = TransactionBuilder.makeInvokeTransaction(
      method,
      [],
      contractAddr,
      "2500",
      "20000"
    );
    const restClient = getRestClient();
    restClient.sendRawTransaction(tx.serialize(), true).then(res => {
      console.log(res);
      if (res.Error === 0) {
        const controller = new Crypto.Address(res.Result.Result).toBase58();
        if (controller === this.sharedWallet.sharedWalletAddress) {
          this.showPax = true;
        }
      }
    });
  },
  mounted() {
    // UPDATE CURRENT WALLET
    const wallet = {
      address: this.sharedWallet.sharedWalletAddress,
      name: this.sharedWallet.sharedWalletName
    };
    this.$store.commit("UPDATE_CURRENT_WALLET", { wallet });

    this.refresh(true);
    this.ifHasLocalCopayer();
    let that = this;
    this.intervalId = setInterval(() => {
      this.refresh(false);
    }, this.interval);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  computed: {
    ...mapState({
      balance: state => state.CurrentWallet.balance,
      oep4s: state => state.Tokens.oep4WithBalances
    })
  },
  methods: {
    handleBack() {
      this.$router.push({ name: "Wallets" });
    },
    async getTransactions() {
      const url = getTransactionListUrl(this.sharedWallet.sharedWalletAddress);
      try {
        const res = await this.httpService(url);
        const txlist = res.result;
        const completed = [];
        for (const t of txlist) {
          for (const tx of t.transfers) {
            const asset = tx.asset_name.toUpperCase();
            if (
              tx.to_address === ONG_GOVERNANCE_CONTRACT &&
              asset === "ONG"
            ) {
              continue;
            }
            let amount = asset === "ONT" ? parseInt(tx.amount) : tx.amount;
            if (tx.from_address === this.sharedWallet.sharedWalletAddress) {
              amount = "-" + amount;
            } else {
              amount = "+" + amount;
            }
            completed.push({
              txHash: t.tx_hash,
              asset,
              amount: amount
            });
          }
        }
        this.completedTx = completed.slice(0, 6);
        return completed; // fetch tx history succeed
      } catch (err) {
        console.log(err);
        this.$message.error(this.$t("dashboard.getTransErr"));
        return false; // fetch tx history failed
      }
    },
    getBalance() {
      return this.$store
        .dispatch("getNativeBalance", {
          address: this.sharedWallet.sharedWalletAddress
        })
        .then(res => {
          if (!res) {
            this.$message.error(this.$t("dashboard.getBalanceErr"));
          }
          return res;
        });
    },
    getOep4Balances() {
      this.$store
        .dispatch("fetchTokenBalances", {
          address: this.sharedWallet.sharedWalletAddress
        })
        .then(res => {
          if (!res) {
            this.$message.error(this.$t("dashboard.getBalanceErr"));
          }
          return res;
        });
    },
    getExchangeCurrency() {
      const currency = "ont";
      const goaltype = "USD";
      const amount = this.balance.ont;
      const url = `https://service.onto.app/S3/api/v1/onto/exchangerate/reckon/${currency}/${goaltype}/${amount}`;
      axios.get(url).then(res => {
        console.log(res);
        if (res.data.Result) {
          this.balance.ontValue = res.data.Result.Money;
        }
      });
    },
    getPendingTx() {
      const sharedAddress = this.sharedWallet.sharedWalletAddress;
      // const assetName = 'ONT'
      const timeStamp = new Date().getTime();
      const net = localStorage.getItem("net");
      const ontPassNode =
        net === "TEST_NET" ? ONT_PASS_NODE : ONT_PASS_NODE_PRD;
      const url = ontPassNode + ONT_PASS_URL.QueryPendingTransfer;
      this.axios
        .get(url, {
          params: {
            sharedAddress,
            // assetName,
            beforeTimeStamp: timeStamp
          }
        })
        .then(res => {
          console.log(res);
          this.pendingTx = res.data.SigningSharedTransfers.map(p => {
            if (p.assetName.toLowerCase() === "ong") {
              p.amount = new BigNumber(p.amount).div(1e9).toFixed(9);
            }
            return p;
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error(this.$t("common.networkErr"));
        });
    },
    toCopayerDetail() {
      this.$router.push({ path: "/sharedWallet/copayers" });
    },
    refresh(showLoading) {
      if (showLoading) {
        this.$store.dispatch("showLoadingModals");
      }
      if (this.requestStart) {
        return;
      }
      this.requestStart = true;
      Promise.all([
        this.getTransactions(),
        this.getBalance(),
        this.getOep4Balances(),
        this.getPendingTx()
      ]).then(res => {
        this.requestStart = false;
        this.$store.dispatch("hideLoadingModals");
      });
    },
    back() {
      this.$router.push({ name: "Dashboard" });
    },
    showTransferBox() {
      if (Number(this.balance.ong) < 0.05) {
        this.$message.warning(this.$t("common.ongNoEnough"));
        return;
      }
      this.$store.commit("CLEAR_CURRENT_TRANSFER");

      this.$store.commit("UPDATE_TRANSFER_REDEEM_TYPE", { type: false });
      this.$router.push({ path: "/sharedWallet/sendTransfer" });
    },
    showReceive() {
      this.$router.push({ path: "/commonWalletReceive/sharedWallet" });
    },
    pendingTxDetail(tx) {
      //判断当前是否在上链中状态
      const requiredNumber = this.sharedWallet.requiredNumber;
      let signed = 0;
      for (let c of tx.coPayerSignDtos) {
        if (c.isSign) {
          signed++;
        }
      }
      if (requiredNumber <= signed) {
        this.$message.warning(this.$t("sharedWalletHome.txSendingTochain"));
        return;
      }
      this.$store.commit("UPDATE_PENDINGTX", { pendingTx: tx });
      if (tx.receiveaddress === tx.sendaddress && tx.assetName === "ONG") {
        this.$store.commit("UPDATE_TRANSFER_REDEEM_TYPE", { type: true });
      }
      this.$router.push("/sharedWallet/pendingTxHome");
    },
    ifHasLocalCopayer() {
      var that = this;
      const coPayers = this.sharedWallet.coPayers;
      const localCopayers = [];
      dbService.find(
        { $or: [{ type: "CommonWallet" }, { type: "HardwareWallet" }] },
        function(err, accounts) {
          if (err) {
            console.log(err);
            that.$message.error(err);
            return;
          }
          for (let cp of coPayers) {
            for (let ac of accounts) {
              if (cp.address === ac.address) {
                localCopayers.push(ac.wallet);
              }
            }
          }
          if (localCopayers.length > 0) {
            that.hasLocalCopayer = true;
          } else {
            that.hasLocalCopayer = false;
          }
        }
      );
    },
    checkMoreTx() {
      let url = `https://explorer.ont.io/address/${this.sharedWallet.sharedWalletAddress}/10/1`;
      if (this.network === "TestNet") {
        url += "/testnet";
      }
      open(url);
    },
    showTxDetail(txHash) {
      let url = `https://explorer.ont.io/transaction/${txHash}`;
      if (this.network === "TestNet") {
        url += "/testnet";
      }
      open(url);
    },
    copy() {
      this.$copyText(this.sharedWallet.sharedWalletAddress);
      this.$message.success(this.$t("common.copied"));
    },
    redeemOng() {
      if (this.balance.unboundOng == 0) {
        this.redeemInfoVisible = true;
        return;
      }
      if (Number(this.balance.ong) < 0.05) {
        this.$message.warning(this.$t("common.ongNoEnough"));
        return;
      }
      this.$store.commit("CLEAR_CURRENT_TRANSFER");
      this.$store.commit("UPDATE_TRANSFER_REDEEM_TYPE", { type: true });

      const redeem = {
        claimableOng: this.balance.unboundOng,
        balance: this.balance.ong
      };
      this.$store.commit("UPDATE_CURRENT_REDEEM", { redeem: redeem });
      this.$router.push({ path: "/sharedWallet/sendTransfer" });
    },
    handleModalOk() {
      this.redeemInfoVisible = false;
    },
    showPaxMgmt() {
      this.$router.push({ path: "/sharedWallet/paxMgmt" });
    },
    showTxMgmt() {
      this.$router.push({ path: "/sharedWallet/txMgmt" });
    },
    checkMoreOep4() {
      this.$router.push({ name: "Oep4Home" });
    },
    addOep4() {
      this.showOep4Selection = true;
    },
    closeOep4Selection() {
      this.showOep4Selection = false;
      this.$store.dispatch("showLoadingModals");
      this.$store.dispatch("fetchTokenBalances", {
        address: this.sharedWallet.sharedWalletAddress
      });
    }
  }
};
</script>


