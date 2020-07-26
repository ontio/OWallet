<template>
  <div class="negative-margin-top">
    <ul class="nav nav-pills wallets-nav-pills" id="pills-tab" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab"
           aria-controls="pills-home" aria-selected="true">{{ $t('identitys.pageTit') }}</a>
      </li>
    </ul>

    <div class="tab-content" id="pills-tabContent">

      <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
        <div class="d-flex flex-wrap align-content-start center">
          <div class="normalWallet" v-for="w in allIdentitys" :key="w.address">
            <identity-view :identity="w"></identity-view>
          </div>

          <div class="div-create-wallet" :class="[viewBtn?'div-create-wallet-bg-color':'']"
               v-on:mouseenter="viewAllBtn(true)" v-on:mouseleave="viewAllBtn(false)">
            <div class="div-create" v-show="viewBtn">
              <router-link class="btn btn-default btn-create" :to="{name: 'CreateIdentity'}">{{$t('identitys.createIdentity')}}</router-link>
            </div>
            <div class="div-join" v-show="viewBtn">
              <router-link class="btn btn-default btn-create" :to="{name: 'ImportIdentity'}">{{$t('identitys.importIdentity')}}</router-link>
            </div>
            <img class="img-wallet-create" v-show="!viewBtn" src="./../assets/create-wallet.png" alt="">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import IdentityView from './Identitys/IdentityView'

	export default {
    name: "Identitys",
    components:{
      IdentityView
    },
    data() {
      const net = localStorage.getItem('net')
      const network = net === 'TEST_NET' ? this.$t('common.testNet') : this.$t('common.mainNet');

      return {
        network: network,
        viewBtn: false,
      }
    },
    mounted() {
      this.$store.dispatch('fetchIdentitiesFromDb')
    },
    computed: {
      ...mapState({
        allIdentitys : state => state.Identities.Identities
      })
    },
    methods: {
      copyAddress(wallet) {
        this.$copyText(wallet.address)
      },
      viewAllBtn(bool) {
        this.viewBtn = bool
      }
    }
	}
</script>

<style scoped>
  .nav-item > a {
    color: #A5A7A9;
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
</style>
