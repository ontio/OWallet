<template>
  <div>
    <div class="left-nav text-center">
      <router-link class="logo-div" to="Home">
        <img class="logo-img" src="./../assets/logo.png" alt="">
      </router-link>

      <!-- <div class="nav-wallets" @click="goToWallet"></div> -->

      <router-link  to="wallets" active-class="nav-wallets-active">
        <div class="nav-wallets"></div>
      </router-link>

      <router-link  to="setting" active-class="nav-setting-active">
        <div class="setting-img"></div>
      </router-link>

        <!-- <div class="setting-img" alt="" @click="toSetting"></div> -->
      <div class="nav-help" ></div>

      <div class="nav-network">
        {{network}}
      </div>
    </div>
  </div>
</template>

<script>
	export default {
    name: "TopLeftNav",
    computed: {
      network: {
        get() {
          const net = this.$store.state.Setting.network
          return net === 'TEST_NET' ? 'TestNet' : 'MainNet'
        }
      }
    },
    methods: {
      goToWallet() {
        this.$router.push({name:'Wallets'})
      },
      toSetting() {
        this.$router.push({name:'Setting'})
      }
		}
	}
</script>

<style scoped>
  .left-nav {
    width: 4rem;
    height: 100%;
    position: fixed;
    left: 0;
    background-color: #373A42;
  }
  .logo-img{
    height: 4rem;
    width: 4rem;
  }
  .logo-div {
    height: 4rem;
    width: 4rem;
    background-color: #373A42;
  }

  .setting-img,
  .setting-btn {
    height: 1.5rem;
    width: 1.5rem;
  }

  .nav-setting-active div {
    background:url('../assets/selectsetting.png') center center;
  }

  .setting-img {
    background: url('../assets/settingunselect.png') center center;
    background-size:contain;
  }
  .setting-img:hover {
    background:url('../assets/selectsetting.png') center center;
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
    width:1.5rem;
    height: 1.5rem;
    position:absolute;
    bottom:8rem;
    left: 1.25rem;
    background:url('../assets/helpunselected.png') center center;
    cursor: pointer;
  }
  .nav-help:hover {
    background:url('../assets/helpselect.png')
  }
  .nav-network {
    position: absolute;
    bottom:10px;
    left: 0;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #FFFFFF;
    width:100%;
  }

  .nav-wallets {
    width:24px;
    height: 18px;
    margin: 67px auto;
    background: url('../assets/unselectwallet.png') center center;
    background-size:cover;
    cursor: pointer;
  }
  .nav-wallets-active div {
    background: url('../assets/selectwallet.png') center center;
  }
  .nav-wallets:hover {
    background:url('../assets/selectwallet.png') center center;
  }
</style>
