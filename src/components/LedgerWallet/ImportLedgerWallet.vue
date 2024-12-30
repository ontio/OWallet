<template>
  <div>
    <breadcrumb
      :current="$t('importLedgerWallet.import')"
      v-on:backEvent="back"
    ></breadcrumb>
    <div class="shared-container">
      <div class="steps-content">
        <ConnectLedger v-if="step===1" @next="step=2"></ConnectLedger>
        <basic-info v-if="step===2"></basic-info>
      </div>
    </div>
  </div>
</template>

<script>
import en from "../../lang/en";
import zh from "../../lang/zh";
import BasicInfo from "./Import/BasicInfo";
import Breadcrumb from "../Breadcrumb";
import { mapState } from "vuex";
import ConnectLedger from "./Import/ConnectLedger";

export default {
  name: "ImportLedgerWallet",
  data() {
    // const langType = localStorage.getItem('user_lang') || 'en';
    // const lang = langType === 'en' ? en : zh;
    return {
      // lang: lang,
      // steps: [{
      //   title: lang.importJsonWallet.basicInfo,
      //   content: 'First-content',
      // }]
      step: 1,
    };
  },
  components: {
    BasicInfo,
    Breadcrumb,
    ConnectLedger,
  },
  methods: {
    back() {
      this.$router.push({ name: "Wallets" });
    },
  },
};
</script>
