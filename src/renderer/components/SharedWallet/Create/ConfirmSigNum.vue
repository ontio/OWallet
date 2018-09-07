<template>
  <div class="basic-container">
    <p class="confirm-label wallet-label" style="margin-bottom:40px;">{{label}}</p>

    <p class="confirm-label font-bold">{{$t('createSharedWallet.copayers')}}({{copayers.length}})</p>
    <div class="confirm-pk-box">
      <div class="confirm-pk-item clearfix" v-for="(pk,index) in copayers" :key="pk.index">
        <span class="circle">{{index+1}}</span>
        <span class="copayer-name">{{pk.name}}</span>
        <span class="copayer-address">{{pk.address}}</span>
        <span class="copayer-publicKey">{{pk.publickey}}</span>
        
      </div>
    </div>
    <p class="confirm-label wallet-label">{{$t('createSharedWallet.requiredSigNum')}}</p>
    <div class="confirm-requireNum">
      <a-select v-model="requiredSigNum" :options="options" class="confirm-select">
      </a-select>
    </div>
    <div class="confirm-btns">
      <div class="confirm-btn-container">
        <a-button type="default" class="btn-cancel" @click="back">{{$t('createSharedWallet.back')}}</a-button>
        <a-button type="primary" class="btn-next" @click="next" :disabled="processing">{{$t('createSharedWallet.next')}}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {Crypto} from 'ontology-ts-sdk'

  export default {
    name: 'ConfirmSigNum',
    data() {
      return {
        processing: false
      }
    },
    computed: {
      ...mapState({
        label: state => state.CreateSharedWallet.label,
        copayers: state => state.CreateSharedWallet.copayers
      }),
      options: {
        get() {
          let options = []
          const length = this.$store.state.CreateSharedWallet.copayers.length;
          for (let i = 2; i <= length; i++) {
            options.push({value: i, label: i})
          }
          return options
        }
      },
      requiredSigNum: {
        get() {
          return this.$store.state.CreateSharedWallet.requiredSigNum
        },
        set(val) {
          this.$store.commit('UPDATE_REQUIRED_SIG_NUMBER', {requiredSigNum: val})
        }
      }
    },
    methods: {
      cancel() {
        this.$router.push({name: 'Wallets'})
      },
      back() {
        this.$store.commit('SUB_CREATE_SHARED_STEP')
      },
      next() {
        if (this.processing) {
          return;
        }
        this.processing = true;
        const pks = this.copayers.map((p) => new Crypto.PublicKey(p.publickey));
        const multiAddr = Crypto.Address.fromMultiPubKeys(this.requiredSigNum, pks);
        const sharedAddress = multiAddr.toBase58();
        const body = {
          "sharedWalletAddress": sharedAddress,
          "sharedWalletName": this.label,
          "totalNumber": pks.length,
          "requiredNumber": this.requiredSigNum,
          "coPayers": this.copayers
        }
        this.$store.dispatch('createSharedWallet', body).then(res => {
          this.processing = false;
          if (res === 0) {
            this.$message.success(this.$t('createSharedWallet.createSuccess'));
            this.$store.commit('CLEAR_CREATE_SHARED_STATE')
            this.$router.push({name: 'Wallets'})
          } else if (res === 61002) { //重复创建
            this.$message.error(this.$t('createSharedWallet.duplicateCreate'));
            this.$store.commit('CLEAR_CREATE_SHARED_STATE')
            this.$router.push({name: 'Wallets'})
          }
        }, err => {
          this.$message.success(this.$t('createSharedWallet.createFailed'))
          console.log(err)
        })
        // this.$store.commit('ADD_CURRENT_STEP')
      }
    }
  }
</script>

<style scoped>
  .confirm-label {
    margin-left: 172px;
    margin-bottom: 0;
  }

  .wallet-label {
    font-family: 'AvenirNext-Bold';
    color: #5E6369;
    font-size: 14px;
  }

  .confirm-pk-box {
    width: 540px;
    margin: 20px auto;
    margin-bottom: 40px;
  }

  .confirm-pk-item {
    margin-bottom: 20px;
  }

  .confirm-requireNum {
    width: 540px;
    margin: 12px auto;
  }

  .confirm-select {
    width: 100%;
  }

  .circle {
    display: inline-block;
    text-align: center;
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    background: #FBE45A;
    font-family: 'AvenirNext-Medium';
    font-size: 14px;
    color: #000000;
    vertical-align: middle;
    float: left;
  }

  .copayer-name {
    margin-left: 20px;
    font-family: 'AvenirNext-Medium';
    font-size: 14px;
    color: #000000;
    float: left;
    display: block;
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .copayer-address {
    font-family: 'AvenirNext-Medium';
    font-size: 14px;
    color: #5E6369;
    float: right;
  }
  .copayer-publicKey {
    float: right;
  }

  .confirm-btns {
    position: fixed;
    bottom: 0;
    width: calc(100% - 4rem);
    height: 85px;
    left: 4rem;
    background: #FFFFFF;
    box-shadow: 0 -1px 6px 0 #F2F2F2;
    z-index: 1000;
  }

  .confirm-btn-container {
    width: 540px;
    margin: 20px auto;
  }

  .confirm-btn-container :last-child {
    float: right;
  }
</style>
