<template>
  <div>
    <ul class="nav nav-pills wallets-nav-pills" id="pills-tab" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab"
           aria-controls="pills-home" aria-selected="true">{{ $t('wallets.all') }}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="pills-common-tab" data-toggle="pill" href="#pills-common" role="tab"
           aria-controls="pills-common" aria-selected="false">{{ $t('wallets.common') }}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="pills-shared-tab" data-toggle="pill" href="#pills-shared" role="tab"
           aria-controls="pills-shared" aria-selected="false">{{ $t('wallets.shared') }}</a>
      </li>
      <!-- <li class="nav-item"> //暂时隐藏
        <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab"
           aria-controls="pills-profile" aria-selected="false">{{ $t('wallets.temp') }}</a>
      </li> -->
      <li class="nav-item">
        <a class="nav-link" id="pills-ledger-tab" data-toggle="pill" href="#pills-ledger" role="tab"
           aria-controls="pills-ledger" aria-selected="false">{{ $t('wallets.ledger') }}</a>
      </li>
    </ul>

    <div class="tab-content" id="pills-tabContent">

      <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
        <div class="d-flex flex-wrap align-content-start center">
          <div class="normalWallet" v-for="w in normalWallet" :key="w.address">
            <json-wallet-details :wallet="w"></json-wallet-details>
          </div>

          <div class="normalWallet" v-for="w in sharedWallet" :key="w.address">
            <shared-wallet-details :wallet="w"></shared-wallet-details>
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="pills-common" role="tabpanel" aria-labelledby="pills-common-tab">
        <div class="d-flex flex-wrap align-content-start center">
          <div class="normalWallet" v-for="w in normalWallet" :key="w.address">
            <json-wallet-details :wallet="w"></json-wallet-details>
          </div>

          <div class="div-create-wallet" :class="[viewBtn?'div-create-wallet-bg-color':'']"
               v-on:mouseenter="viewAllBtn(true)" v-on:mouseleave="viewAllBtn(false)">
            <div class="div-create" v-show="viewBtn">
              <router-link class="btn btn-default btn-create" to="CreateJsonWallet">{{$t('wallets.createCommonWallet')}}</router-link>
            </div>
            <div class="div-join" v-show="viewBtn">
              <router-link class="btn btn-default btn-create" to="ImportJsonWallet">{{$t('wallets.importCommonWallet')}}</router-link>
            </div>
            <img class="img-wallet-create" v-show="!viewBtn" src="./../assets/add.png" alt="">
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="pills-shared" role="tabpanel" aria-labelledby="pills-shared-tab">
        <div class="d-flex flex-wrap align-content-start center">
          <div class="normalWallet" v-for="w in sharedWallet" :key="w.address">
            <shared-wallet-details :wallet="w"></shared-wallet-details>
          </div>

          <div class="div-create-wallet" :class="[viewBtn?'div-create-wallet-bg-color':'']"
               v-on:mouseenter="viewAllBtn(true)" v-on:mouseleave="viewAllBtn(false)">
            <div class="div-create" v-show="viewBtn">
              <router-link class="btn btn-default btn-create" to="CreateSharedWallet">{{$t('wallets.createSharedWallet')}}</router-link>
            </div>
            <div class="div-join" v-show="viewBtn">
              <router-link class="btn btn-default btn-create" to="ImportSharedWallet">{{$t('wallets.joinSharedWallet')}}</router-link>
            </div>
            <img class="img-wallet-create" v-show="!viewBtn" src="./../assets/add.png" alt="">
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="pills-ledger" role="tabpanel" aria-labelledby="pills-ledger-tab">
          <div class="center">
            <h4 style="text-align:center;">{{$t('wallets.comingSoon')}}</h4>
          </div>
      </div>

      <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
        <div class="center">
          <div class="boxBtns">
            <router-link to="CreateMultiSignAddr">
              Create Multi Sign Address
            </router-link>
          </div>
          <div class="boxBtns">
            <router-link to="CreateMultiSignTx">
              Create Multi Sign Transaction
            </router-link>
          </div>
          <div class="boxBtns">
            <router-link to="SignMultiAddrTx">
              Sign Multi address Transaction
            </router-link>
          </div>
          <div class="boxBtns">
            <router-link to="SendTransaction">
              SendTransaction
            </router-link>
          </div>

          <div class="ledgerBtn" @click="ledgerLogin">
            <div class="ledgerBtnInner">
              <span class="ledgerBtnText1">Log in with</span>
              <span class="ledgerBtnText2">Ledger</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <set-path-modal></set-path-modal>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {mapState} from 'vuex'
  import JsonWalletDetails from './JsonWallet/View/Details'
  import SharedWalletDetails from './SharedWallet/View/Details'
  import SetPathModal from './Modals/SetPath'

  export default {
    name: 'Wallets',
    data() {
      const net = localStorage.getItem('net')
      const network = net === 'TEST_NET' ? this.$t('common.testNet') : this.$t('common.mainNet');

      return {
        network: network,
        viewBtn: false,
      }
    },
    computed: {
      ...mapState({
        normalWallet: state => state.Wallets.NormalWallet,
        sharedWallet: state => state.Wallets.SharedWallet,
        hardwareWallet: state => state.Wallets.HardwareWallet
      })
    },
    mounted() {
      this.$store.dispatch('fetchWalletsFromDb')
      this.isSetPath()
    },
    methods: {
      isSetPath() {
        if(localStorage.getItem('isSavePath') !== 'true') {
          $("#setPathModal").modal("show")
        }
      },
      ledgerLogin() {
        this.$router.push({name: 'LoginLedger'})
      },
      copyAddress(wallet) {
        this.$copyText(wallet.address)
      },
      viewAllBtn(bool) {
        this.viewBtn = bool
      }
    },
    components: {
      JsonWalletDetails,
      SharedWalletDetails,
      SetPathModal
    }
  }
</script>

<style>
  .nav-item > a {
    color: #DFE2E9;
  }

  .nav-item > a:hover {
    color: #196BD8;
  }

  .wallets-nav-pills .nav-link.active {
    color: #196BD8;
    background-color: transparent;
    border-radius: 0;
  }

  .wallets-nav-pills {
    line-height: 4rem;
    font-family: AvenirNext-Medium;
    font-size: 0.88rem;
    padding: 0 1.7rem;
  }

  .nav-link {
    padding: 0 1.7rem;
  }

  .nav-pills .show > .nav-link {
    color: #196BD8;
    background-color: transparent;
  }

  .center {
    padding: 1.88rem 3rem;
  }

  .normalWallet,
  .div-create-wallet {
    width: 21.63rem;
    height: 13.19rem;
    margin-right: 3.75rem;
    margin-bottom: 2.75rem;
  }

  .normalWallet {
    background-color: #F5F7FB;
    padding-left: 1.25rem;
    position: relative;
  }

  .normalWallet:hover {
    cursor: pointer;
  }

  .div-create-wallet {
    background-color: #F5F7FB;
    font-family: AvenirNext-Medium;
    position: relative;
  }

  .div-create-wallet-bg-color {
    background-color: #498FEF;
  }

  .img-wallet-create {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -30px;
    margin-top: -30px;
  }

  .div-create-wallet > div > a {
    font-size: 0.88rem;
  }

  .btn-create {
    width: 8.25rem;
    height: 2.13rem;
    color: white;
    border: white solid 1px;
    border-radius: 0;
  }

  .div-create {
    padding-top: 3rem;
    padding-left: 6.48rem;
  }

  .div-join {
    padding-top: 1.88rem;
    padding-left: 6.48rem;
  }

  /* TODO 以下样式可能需要删除：*/
  .boxBtns {
    width: 290px;
    height: 48px;
    margin-bottom: 16px;
    border-radius: 4px;
    background-color: #edf2f5;
    text-align: center;
    line-height: 48px;
  }

  .boxBtns a {
    font-size: 16px;
    color: #35bfdf;
  }

  .ledgerBtn {
    width: 210px;
    height: 75.2px;
    border-radius: 4px;
    background-color: #edf2f5;
    margin-left: 40px;
    position: relative;
    cursor: pointer;
  }

  .ledgerBtnInner {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    border: 0;
    margin: auto;
  }

  .ledgerBtnText1 {
    font-family: SourceSansPro;
    font-size: 14px;
    color: #35bfdf;
    display: block;
    margin-top: 12px;
  }

  .ledgerBtnText2 {
    font-family: SourceSansPro;
    font-size: 18px;
    font-weight: bold;
    color: #35bfdf;
  }
</style>
