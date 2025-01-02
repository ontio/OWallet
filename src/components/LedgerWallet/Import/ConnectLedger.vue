<template>
  <div class="div-ledger-info">
    <div class="div-ledger-info-tit">
      <strong>{{ $t("ledgerWallet.info") }}</strong>
    </div>

    <div class="font-bold" style="margin-bottom: 15px">
      {{ $t("ledgerWallet.connectApp") }}
    </div>

    <div class="ledger-status">
      <p class="font-medium-black">{{ $t("ledgerWallet.status") }}:</p>
      <p v-if="ledgerStatus">{{ ledgerStatus }}</p>

    </div>

    <div class="basic-pk-btns">
      <div class="btn-container">
        <a-button type="default" @click="cancel" class="btn-cancel">{{
          $t("importJsonWallet.cancel")
          }}</a-button>
        <a-button type="primary" @click="connect" class="btn-next"
          :disabled="!ledgerStatus || !publicKey">{{ $t("importLedgerWallet.next") }}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeviceInfo, getPublicKey } from "../../../core/ontLedger";
import { mapState } from "vuex";

export default {
  data() {
    return {
      isLedgerConnected: false,
      isOpenApp: false,
    };
  },
  computed: {
    ...mapState({
      ledgerStatus: (state) => state.LedgerConnector.ledgerStatus,
      publicKey: (state) => state.LedgerConnector.publicKey,
    }),
  },
  methods: {
    connect() {
      this.$emit("next");
    },
    cancel() {
      this.$router.push({ name: "Wallets" });
    },
  },
  async mounted() {
    await this.$store.dispatch("getLedgerStatus");
  },
  beforeDestroy() {
    this.$store.dispatch("stopGetLedgerStatus");
  },
  emit: ["next"],
};
</script>

<style scoped>
.div-ledger-info {
  border: 1px solid #dfe2e9;
  margin-top: 15px;
  padding: 10px;
}

.div-ledger-info-tit {
  border-bottom: 1px solid #dfe2e9;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.basic-pk-btns {
  position: fixed;
  bottom: 0;
  width: calc(100% - 4rem);
  height: 85px;
  left: 4rem;
  background: #ffffff;
  box-shadow: 0 -1px 6px 0 #f2f2f2;
  z-index: 1000;
}
</style>
