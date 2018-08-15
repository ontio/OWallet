
<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  .row-home {
    margin-left: -5.13rem;
  }

  .row-home .col-10 {
    padding: 0;
  }

  .img-home-page {
    width: 100%;
    height: 100%;
  }

  .div-slogan {
    margin-top: 30vh;
    text-align:left;
  }

  .go-to-wallets {
    width: 10rem;
    height: 2.5rem;
    line-height: 1.8rem;
    background-color: #196BD8;
    font-family: AvenirNext-Medium;
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    border-radius: 0;
    margin-top: 15vh;
  }

  .div-footer-version {
    text-align: center;
    position: absolute;
    bottom:10px;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right:0;
  }
  .div-footer-version P {
    margin:0;
  }
  .home-img {
    width:100%;
    height:100%;
    background:url('../assets/home/background@1.5x.png') center center;
    background-size:cover;
  }
  .home-container {
    position:fixed;
    width:100%;
    height: 100%;
  }
  .home-slogan :first-child {
    font-family: AvenirNext-Medium;
    font-size: 16px;
    color: #000000;
    text-align: left;
    margin: 0;
  }
  .home-slogan :last-child {
    font-family: AvenirNext-Regular;
    margin: 0;
  }
</style>
<template>
  <div class="row row-home home-container">
    <div class="col-10">
      <!-- <img class="img-home-page" src="./../assets/home/background@1.5x.png" alt=""> -->
      <div class="home-img"></div>
    </div>
    <div class="col-2 text-center">
      <div class="div-slogan home-slogan">
          <p>OWallet</p>
          <p>A comprehensive Ontology desktop wallet.</p>
      </div>
      <div>
        <router-link class="btn btn-default go-to-wallets text-center" to="Wallets">
          <div>ENTER →</div>
        </router-link>
      </div>

      <div class="div-footer-version">
        <p>Version: 0.8.3</p>
        <p>Powered by Ontology</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {legacySignWithLedger} from '../../core/ontLedger'
  import {TEST_NET, MAIN_NET} from '../../core/consts'

  export default {
    name: 'Home',
    mounted() {
      this.$store.dispatch('fetchWalletsFromDb')
    }
  }
</script>

