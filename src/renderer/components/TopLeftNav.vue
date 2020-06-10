<template>
  <div>
    <div class="left-nav text-center">
      <router-link class="logo-div" to="Home">
        <img class="logo-img" src="./../assets/logo.png" alt="">
      </router-link>

        <router-link :to="{name:'Wallets'}" active-class="nav-wallets-active">
          <a-tooltip placement="right" :title="$t('setting.wallets')">
              <div class="nav-wallets"></div>
          </a-tooltip>
        </router-link>

      <!-- <router-link :to="{name:'Identitys'}" active-class="nav-accounts-active">
        <a-tooltip placement="right" :title="$t('setting.ontid')">
              <div class="nav-accounts"></div>
          </a-tooltip>
      </router-link> -->

      <router-link :to="{name:'Setting'}" active-class="nav-setting-active">
        <a-tooltip placement="right" :title="$t('setting.settings')">
               <div class="setting-img"></div>
          </a-tooltip>
      </router-link>

      <router-link :to="{name:'NodeManagement'}" active-class="node-stake-active" >
        <a-tooltip placement="right" :title="$t('setting.nodeStake')">
               <div class="node-stake-icon"></div>
          </a-tooltip>
      </router-link>
      
      <router-link :to="{name:'Dapps'}" active-class="nav-dapps-active">
          <a-tooltip placement="right" :title="$t('dapps.dapps')">
              <div class="nav-dapps"></div>
          </a-tooltip>
        </router-link>

        <!-- <div class="setting-img" alt="" @click="toSetting"></div> -->
      
      <a-tooltip placement="right" :title="$t('setting.help')">
               <div class="nav-help" @click="toHelp"></div>
          </a-tooltip>

      <div class="nav-network">{{network}}</div>
    </div>
  </div>
</template>

<script>
import { open } from '../../core/utils'

export default {
  name: "TopLeftNav",
  computed: {
    network: {
      get() {
        const net = this.$store.state.Setting.network;
        return net === "TEST_NET" ? "TestNet" : "MainNet";
      }
    }
  },
  methods: {
    toHelp() {
      const lang = localStorage.getItem("user_lang");
      let url = "";
      if (lang === "zh") {
        url = "http://ontfans.io/article/41.html";
        // url = 'https://medium.com/ontologynetwork/owallet-faq-7f4f96784253'
      } else {
        // url = 'https://ontfans.io/?/article/39'
        url = "https://medium.com/ontologynetwork/owallet-faq-7f4f96784253";
      }

      open(url)
    }
  }
};
</script>

<style scoped>
.left-nav {
  width: 4rem;
  height: 100%;
  position: fixed;
  left: 0;
  background-color: #373a42;
  z-index: 1001;
}

.logo-img {
  height: 4rem;
  width: 4rem;
}

.logo-div {
  height: 4rem;
  width: 4rem;
  background-color: #373a42;
}

.setting-img,
.setting-btn {
  height: 1.5rem;
  width: 1.5rem;
}

.nav-setting-active div {
  background: url("../assets/selectsetting.png") center center;
}

.setting-img {
  background: url("../assets/settingunselect.png") center center;
  background-size: contain;
}

.setting-img:hover {
  background: url("../assets/selectsetting.png") center center;
}

.setting-img {
  cursor: pointer;
  position: fixed;
  bottom: 4rem;
  left: 1.25rem;
}

.temp-top {
  margin-top: 30px;
}

.nav-help {
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  bottom: 8rem;
  left: 1.25rem;
  background: url("../assets/helpunselected.png") center center;
  cursor: pointer;
}

.node-stake-icon {
  width: 24px;
  height: 24px;
  margin: 67px auto;
  background: url("../assets/node.png");
  background-size: cover;
  cursor: pointer;
}

.node-stake-active div {
  background: url("../assets/nodeSelect.png") center center;
}
.node-stake-icon:hover {
  background: url("../assets/nodeSelect.png") center center;
}

.nav-help:hover {
  background: url("../assets/helpselect.png");
}

.nav-network {
  position: absolute;
  bottom: 10px;
  left: 0;
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ffffff;
  width: 100%;
}

.nav-accounts {
  width: 24px;
  height: 24px;
  margin: 67px auto;
  background: url("../assets/accounts.png");
  background-size: cover;
  cursor: pointer;
}

.nav-accounts-active div {
  background: url("../assets/account-hover.png");
  background-size: cover;
}

.nav-accounts:hover {
  background: url("../assets/account-hover.png");
  background-size: cover;
}

.nav-wallets {
  width: 24px;
  height: 24px;
  margin: 67px auto;
  background: url("../assets/unselectwallet.png") center center;
  background-size: cover;
  cursor: pointer;
}

.nav-wallets-active div {
  background: url("../assets/selectwallet.png") center center;
}

.nav-wallets:hover {
  background: url("../assets/selectwallet.png") center center;
}

.nav-dapps {
  width: 24px;
  height: 24px;
  margin: 67px auto;
  background: url("../assets/dapps.png") center center;
  background-size: contain;
  cursor: pointer;
}

.nav-dapps-active div {
  background: url("../assets/dapps-hover.png") center center;
  background-size: contain;
}

.nav-dapps:hover {
  background: url("../assets/dapps-hover.png") center center;
  background-size: contain;
}
</style>
