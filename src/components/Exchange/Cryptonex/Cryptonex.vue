<style scoped>
.cryptonex-container {
  position: relative;
  padding-bottom: 75%;
  height: 0;
  overflow: hidden;
}
.cryptonex-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
<template>
    <div>
      <breadcrumb  :current="$t('exchange.exchange')" v-on:backEvent="handleRouteBack"></breadcrumb>
   </div>
</template>

<script>
import Breadcrumb from "../../Breadcrumb";
const cryptonexURL = "https://wallet.cryptonex.org/member/sign-in";
const { BrowserWindow } = require("electron").remote;

export default {
  name: "Cryptonex",
  mounted() {
    this.loadPage()
  },
  data() {
    return {};
  },
  components: {
    Breadcrumb
  },
  methods: {
    handleRouteBack() {
      this.$router.push({ name: "Exchange" });
    },
    loadPage() {
      let win = new BrowserWindow({ width: 1024, height: 768, center: true });
      win.on("closed", () => {
        win = null;
        this.$router.push({ name: "Exchange" });
      });
      win.loadURL(cryptonexURL);
    }
  }
};
</script>