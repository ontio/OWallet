<template>
  <div class="negative-margin-top">
    <ul class="nav nav-pills wallets-nav-pills" id="pills-tab" role="tablist">
      <li class="nav-item" @click="setActiveTab(1)">
        <a class="nav-link" id="pills-common-tab" data-toggle="pill" href="#pills-common" role="tab"
          :class="activeTab == 1? 'active show' : ''"
           aria-controls="pills-common" aria-selected="false">{{ $t('wallets.common') }}</a>
      </li>
      <li class="nav-item" @click="setActiveTab(2)">
        <a class="nav-link" id="pills-shared-tab" data-toggle="pill" href="#pills-shared" role="tab"
          :class="activeTab == 2? 'active show' : ''"
           aria-controls="pills-shared" aria-selected="false">{{ $t('wallets.shared') }}</a>
      </li>
      <li class="nav-item" @click="setActiveTab(3)">
        <a class="nav-link" id="pills-ledger-tab" data-toggle="pill" href="#pills-ledger" role="tab"
          :class="activeTab == 3? 'active show' : ''"
           aria-controls="pills-ledger" aria-selected="false">{{ $t('wallets.ledger') }}</a>
      </li>
    </ul>

    <div class="tab-content" id="pills-tabContent">

      <!-- <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
        <div class="d-flex flex-wrap align-content-start center">
          <div class="normalWallet" v-for="w in normalWallet" :key="w.address">
            <json-wallet-details :wallet="w"></json-wallet-details>
          </div>

          <div class="normalWallet" v-for="w in sharedWallet" :key="w.address">
            <shared-wallet-details :wallet="w"></shared-wallet-details>
          </div>
          <div class="normalWallet" v-for="w in hardwareWallet" :key="w.address">
            <json-wallet-details :wallet="w"></json-wallet-details>
          </div>
        </div>
      </div> -->

      <div class="tab-pane fade" :class="activeTab == 1? 'active show' : ''" id="pills-common" role="tabpanel" aria-labelledby="pills-common-tab">
        <div class="d-flex flex-wrap align-content-start center">
          <div class="normalWallet" v-for="w in normalWallet" :key="w.address">
            <json-wallet-details :wallet="w"></json-wallet-details>
          </div>

          <div class="div-create-wallet" :class="[viewBtn?'div-create-wallet-bg-color':'']"
               v-on:mouseenter="viewAllBtn(true)" v-on:mouseleave="viewAllBtn(false)">
            <div class="div-create" v-show="viewBtn">
              <router-link class="btn btn-default btn-create" :to="{name: 'CreateJsonWallet'}">{{$t('wallets.createCommonWallet')}}</router-link>
            </div>
            <div class="div-join" v-show="viewBtn">
              <router-link class="btn btn-default btn-create" :to="{name: 'ImportJsonWallet'}">{{$t('wallets.importCommonWallet')}}</router-link>
            </div>
            <img class="img-wallet-create" v-show="!viewBtn" src="./../assets/create-wallet.png" alt="">
          </div>
        </div>
      </div>

      <div class="tab-pane fade" :class="activeTab == 2? 'active show' : ''" id="pills-shared" role="tabpanel" aria-labelledby="pills-shared-tab">
        <div class="d-flex flex-wrap align-content-start center">
          <div class="normalWallet" v-for="w in sharedWallet" :key="w.address">
            <shared-wallet-details :wallet="w"></shared-wallet-details>
          </div>

          <div class="div-create-wallet" :class="[viewBtn?'div-create-wallet-bg-color':'']"
               v-on:mouseenter="viewAllBtn(true)" v-on:mouseleave="viewAllBtn(false)">
            <div class="div-create" v-show="viewBtn">
              <router-link class="btn btn-default btn-create" :to="{name: 'CreateSharedWallet'}">{{$t('wallets.createSharedWallet')}}</router-link>
            </div>
            <div class="div-join" v-show="viewBtn">
              <router-link class="btn btn-default btn-create" :to="{name: 'ImportSharedWallet'}">{{$t('wallets.joinSharedWallet')}}</router-link>
            </div>
            <img class="img-wallet-create" v-show="!viewBtn" src="./../assets/create-wallet.png" alt="">
          </div>
        </div>
      </div>

      <div class="tab-pane fade" :class="activeTab == 3? 'active show' : ''" id="pills-ledger" role="tabpanel" aria-labelledby="pills-ledger-tab">
        <div class="d-flex flex-wrap align-content-start center">
          <div class="ledger-help-link" @click="toLedgerHelp">
             {{$t('wallets.ledgerHelpLink')}}
          </div>
          <div class="normalWallet" v-for="w in hardwareWallet" :key="w.address">
            <json-wallet-details :wallet="w"></json-wallet-details>
          </div>

          <div class="div-create-wallet" :class="[viewBtn?'div-create-wallet-bg-color':'']"
               v-on:mouseenter="viewAllBtn(true)" v-on:mouseleave="viewAllBtn(false)">
            <div class="div-join div-ledger-join" v-show="viewBtn">
              <router-link class="btn btn-default btn-create" :to="{name: 'ImportLedgerWallet'}">{{$t('wallets.importLedgerWallet')}}</router-link>
            </div>
            <img class="img-wallet-create" v-show="!viewBtn" src="./../assets/create-wallet.png" alt="">
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
  import { open } from '../core/utils'

  export default {
    name: 'Wallets',
    data() {
      const net = localStorage.getItem('net')
      const network = net === 'TEST_NET' ? this.$t('common.testNet') : this.$t('common.mainNet');
      const index = sessionStorage.getItem('Wallets_Tab') || 1;
      return {
        network: network,
        viewBtn: false,
        activeTab: index
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
      },
      setActiveTab(index) {
        sessionStorage.setItem('Wallets_Tab', index);
      },
      toLedgerHelp() {
        // Load a remote URL
        open('https://support.ledgerwallet.com/hc/en-us/articles/360007583514')
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
    color: #A5A7A9;
    font-size:18px;
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
    position: relative;
  }

  .normalWallet,
  .div-create-wallet {
    width: 24.63rem;
    height: 13.19rem;
    margin-right: 1.75rem;
    margin-left:1.75rem;
    margin-bottom: 2.75rem;
  }

  .div-create-wallet {
    border:1px solid #dddddd;
  }

  .normalWallet {
    background-color: #F5F7FB;
    padding: 0 1.25rem;
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
    padding: 0px;
    margin: 3.5rem auto 2rem;
    text-align: center;
  }

  .div-join {
    padding: 0px;
    margin: 2rem auto;
    text-align: center;
  }

  .div-ledger-join {
    padding-top: 3.5rem;
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
  .ledger-help-link {
    position: absolute;
    width: 100%;
    text-align: center;
    top: -5px;
    left: -5rem;
    cursor: pointer;
    color: #196BD8;
  }
  .ledger-help-link :hover {
    text-decoration: underline;
  }
</style>
