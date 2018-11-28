<template>
  <div id="wrapper">
    <main>
      <div class="left-side">
        <router-link to="Wallets" class="backBtn">
          Back
        </router-link>
        <div class="doc">
          <div class="title">Login with Ledger</div>
          <p class="font-medium" >{{$t('ledgerWallet.connectApp')}}</p>
            <p>
                <span class="font-medium-black">{{$t('ledgerWallet.status')}}: </span> 
                <span class="font-medium">{{ledgerStatus}}</span>
            </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import {getDeviceInfo, getPublicKey} from '../../../core/ontLedger'
  const interval = 3000;
  export default {
    name: 'LoginLedger',
    mounted: function () {
      var that = this;
      this.getDevice()
      this.intervalId = setInterval(() => {
        that.getDevice()
      }, interval)
    },
    beforeDestroy: function () {
      clearInterval(this.intervalId);
    },
    data() {
      const currentWallet = JSON.parse(sessionStorage.getItem('currentWallet'));
      return {
        intervalId: 0,
        ledgerStatus: '',
        device: null,
        publicKey: '',
        currentWallet
      }
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link)
      },
      goBack() {
        this.$router.push({name: 'Wallets'})
      },
      getDevice() {
        getDeviceInfo().then(res => {
          console.log('device: ' + res)
          this.device = res;
          this.getPublicKey()
        }).catch(err => {
          console.log(err)
          if (err === 'NOT_FOUND') {
            this.ledgerStatus = this.$t('common.ledgerNotOpen')
          } else if (err === 'NOT_SUPPORT') {
            this.ledgerStatus = this.$t('common.ledgerNotSupported')
          } else {
            this.ledgerStatus = this.$t('common.pluginDevice')
          }
        })
      },
      getPublicKey() {
        const acctNum = 0;
        const neo = this.currentWallet.neo;
        getPublicKey(acctNum, neo).then(res => {
          console.log('pk info: ' + res);
          this.publicKey = res;
          this.ledgerStatus = this.$t('common.readyToLogin')
          this.login();
        }).catch(err => {
          this.ledgerStatus = err.message
        })
      },
      login() {
        if (!this.device || !this.publicKey) {
          console.log('no device.')
          return;
        }
        this.$store.dispatch('loginWithLedger', this.publicKey).then(res => {
          if (res) {
            this.$router.push({name: 'Dashboard'})
          } else {
            this.ledgerStatus = this.$t('common.invalidLedger')
          }
        });
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
  }

  #wrapper {
    /* background: radial-gradient(
      ellipse at top left,
      rgba(255, 255, 255, 1) 40%,
      rgba(229, 229, 229, .9) 100%
    ); */
    height: 100vh;
    padding: 60px 80px;
    /* width: 100vw; */
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div {
  }

  .left-side {
    display: flex;
    flex-direction: column;
    margin-top: 80px;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: 16px;
    cursor: pointer;
    outline: none;
    padding: 8px 20px;
    border-radius: 0;
    min-width: 120px;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .backBtn {
    font-size: 16px;
  }
</style>
