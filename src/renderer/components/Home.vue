
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
    margin-top: -4rem;
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
  .bg-container {
    position: relative;
  }
  .home-upgrade {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    text-align: center;
    border:1px solid #FBE45A;
    background:#FBE45A;
    font-family: AvenirNext-Regular;
  }
  .home-upgrade a {
    color: #196BD8;
  }
  .home-upgrade a:hover {
    color: rgb(50, 120, 211);
  }
</style>
<template>
  <div class="row row-home home-container">
    <div class="col-10 bg-container">
      <!-- <img class="img-home-page" src="./../assets/home/background@1.5x.png" alt=""> -->
      <div class="home-img"></div>
      <div class="home-upgrade" v-if="latest_url">
        <!-- <a-alert message="Warning" type="warning" showIcon /> -->
        {{$t('common.versionUpdate')}}
        <a @click="handleUpdate">{{$t('common.getLatestVersion')}}</a>
      </div>
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
        <p>Version: {{version}}</p>
        <p>Powered by Ontology</p>
      </div>
    </div>

    
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {TEST_NET, MAIN_NET} from '../../core/consts'
  import axios from 'axios';
  import pkg from '../../../package.json'
  const {BrowserWindow} = require('electron').remote;
  import { open } from '../../core/utils'
import {Modal} from 'ant-design-vue'
  export default {
    name: 'Home',
    data() {
      return {
        version: pkg.version,
        latest_url: ''
      }
    },
    mounted() {
      this.$store.dispatch('showLoadingModals');
      const url = 'https://api.github.com/repos/ontio/OWallet/releases/latest';
      const version = this.version;
      axios.get(url).then(res => {
        this.$store.dispatch('hideLoadingModals');
        if (res.data && res.data.tag_name !== version){
          console.log('not latest')
          this.latest_url = res.data.html_url
          Modal.confirm({
                centered: true,
                okText: this.$t('common.toUpdate'),
                cancelText: this.$t('common.cancel'),
                title: this.$t('dapps.notification'),
                content: this.$t('common.availableNewVersion'),
                onOk() {open(res.data.html_url)},
                onCancel(){}
            })
        }
      }).catch(err => {
        console.log(err);
        this.$store.dispatch('hideLoadingModals');
      })
    },
    methods: {
      handleUpdate() {
        const url = this.latest_url;
        open(url);
        // let win = new BrowserWindow({width: 800, height: 600, center: true});
        // win.on('closed', () => {
        //   win = null
        // })

        // // Load a remote URL
        // win.loadURL(url)
      }
    }
  }
</script>

