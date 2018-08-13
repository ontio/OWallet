<template>
  <div class="container json-import-container">
    <ul class="nav nav-pills import-identity-nav-pills" id="pills-tab" role="tablist">
      <li class="nav-item active">
        <a class="nav-link" id="import-identity-keystore-pills-tab" data-toggle="pill" href="#import-identity-keystore-pills"
           role="tab"
           aria-controls="import-identity-keystore-pills" aria-selected="false" @click="activeTab('keystore')">{{ $t('importIdentity.keystore') }}</a>
      </li>
    </ul>

    <div class="tab-content" id="pills-tabContent">
      <div class="tab-pane fade show active" id="import-identity-keystore-pills" role="tabpanel"
           aria-labelledby="import-identity-keystore-pills-tab">
        <a-input class="input" :placeholder="$t('createIdentity.label')" v-model="keystoreLabel"></a-input>

        <textarea class="import-identity-keystore" id="import-identity-keystore" rows="6"
                  v-validate="{required: true} " data-vv-as="keystore" name="keystore"
                  :placeholder="$t('importIdentity.keystore')" v-model="keystore"></textarea>
        <span class="v-validate-span-errors" v-show="errors.has('keystore')">{{ errors.first('keystore') }}</span>

        <a-input type="password" class="input input-password"
                 v-validate="{required: true ,min:6}" data-vv-as="password" name="keystorePassword"
                 v-model="keystorePassword" :placeholder="$t('createIdentity.password')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('keystorePassword')">{{ errors.first('keystorePassword') }}</span>
      </div>
    </div>

    <div class="basic-pk-btns">
      <div class="btn-container">
        <a-button type="default" @click="cancel" class="btn-cancel">{{$t('createIdentity.cancel')}}</a-button>
        <a-button type="primary" @click="next" class="btn-next">{{$t('createIdentity.next')}}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {Wallet, Account, Crypto} from "ontology-ts-sdk"
  import FileHelper from "../../../../core/fileHelper"
  import dbService from '../../../../core/dbService'
  import {DEFAULT_SCRYPT} from '../../../../core/consts'
  import $ from 'jquery'

  export default {
    name: 'BasicInfo',
    data() {
      return {
        tabName: 'keystore', // keystore

        keystore: '',
        keystoreLabel: '',
        keystorePassword: ''
      }
    },
    methods: {
      activeTab(tabName) {
        this.tabName = tabName
      },
      next() {
        if (this.tabName === 'keystore') {
          this.$validator.validateAll({
            keystore: this.keystore,
            keystorePassword: this.keystorePassword
          }).then(result => {
            if (result) {
              this.$store.dispatch('showLoadingModals')
              this.importIdentityForKeystore()
            }
          })
        }
      },
      importIdentityForKeystore() {
        // TODO 需要填充的逻辑部分
        console.log('keystore:[' + this.keystore + ']; keystorePassword:[' + this.keystorePassword + ']')
        // let body = {
        //   label: this.keystoreLabel,
        //   privateKey: new Crypto.PrivateKey(this.keystore),
        //   password: this.keystorePassword
        // }
        // TODO 和创建Identity账户使用的同样的dispatch
        // this.$store.dispatch('createIdentityWithPrivateKey', body).then(res => {
        //   this.saveToDb(res) // TODO 后续逻辑也未完成改完
        // })
      },
      saveToDb(identity) {
        const that = this;
        const wallet = {
          type: 'CommonWallet',
          address: identity.address,
          wallet: identity
        }
        dbService.insert(wallet, function (err, newDoc) {
          if (err) {
            console.log(err)
            that.$message.warning('The identity already exists in local.')
            return;
          }

          that.$message.success('Import Identity succeessfully!')
          that.$router.push({name: 'Identitys'})
        })
      },
      cancel() {
        this.$router.push({name: 'Wallets'})
      }
    }
  }
</script>

<style>
  .json-import-container {
    width: 36rem;
  }

  .import-identity-nav-pills > li.nav-item {
    width: 100%;
    text-align: center;
    height: 2rem;
    margin-bottom: 30px;
    font-family: AvenirNext-Medium;
    font-size: 14px;
  }

  .import-identity-nav-pills > li.nav-item > a {
    color: black;
  }

  .import-identity-nav-pills .nav-link:hover {
    color: #196BD8;
  }

  .import-identity-nav-pills .nav-link.active {
    color: #196BD8;
    background-color: transparent;
    border-radius: 0;
    border-bottom: #196BD8 solid 1px;
  }

  .input-password {
    margin-top: 30px;
  }

  .import-identity-keystore {
    width: 100%;
    resize: none;
    margin-top: 30px;
    padding: 12px 20px;
    border: 1px solid #DFE2E9;
  }

  textarea::-webkit-input-placeholder {
    color: #C9CBCF;
    font-family: AvenirNext-Regular;
    font-size: 14px;
  }

  .basic-pk-btns {
    position: fixed;
    bottom: 0;
    width: calc(100% - 4rem);
    height: 85px;
    left: 4rem;
    background: #FFFFFF;
    box-shadow: 0 -1px 6px 0 #F2F2F2;
    z-index: 1000;
  }

  .basic-pk-btns button:first-child {
    float: left;
  }

  .basic-pk-btns :nth-child(2) {
    float: right;
  }

  .basic-pk-btns :nth-child(3) {
    float: right;
    margin-right: 20px;
  }

  .error-input {
    border-color: red;
  }
</style>

