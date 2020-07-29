<template>
  <div class="container json-import-container">
    <ul class="nav nav-pills import-identity-nav-pills" id="pills-tab" role="tablist">
      <li class="nav-item active">
        <a class="nav-link" id="import-identity-keystore-pills-tab" data-toggle="pill" href="#import-identity-keystore-pills"
           role="tab"
           aria-controls="import-identity-keystore-pills" aria-selected="false" @click="activeTab('keystore')">{{ $t('importIdentity.keystoreImport') }}</a>
      </li>
    </ul>

    <div class="tab-content" id="pills-tabContent">
      <div class="tab-pane fade show active" id="import-identity-keystore-pills" role="tabpanel"
           aria-labelledby="import-identity-keystore-pills-tab">

        <textarea class="import-identity-keystore" id="import-identity-keystore" rows="6"
                  v-validate="{required: true} " name="keystore"
                  :placeholder="$t('importIdentity.keystore')" v-model="keystore"></textarea>
        <span class="v-validate-span-errors" v-show="errors.has('keystore')">{{ errors.first('keystore') }}</span>

        <a-input type="password" class="input input-password"
                 v-validate="{required: true ,min:6}" :data-vv-as="$t('FormField.password')" name="keystorePassword"
                 v-model="keystorePassword" :placeholder="$t('importIdentity.ontidPassword')"></a-input>
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
  import {Wallet, Account, Crypto, Identity, OntidContract, RestClient, SDK} from "ontology-ts-sdk"
  import FileHelper from "../../../core/fileHelper"
  import dbService from '../../../core/dbService'
  import {DEFAULT_SCRYPT, TEST_NET, MAIN_NET} from '../../../core/consts'
  import $ from 'jquery'
import { getNodeUrl, getRestClient, formatScryptParams } from '../../../core/utils';

  export default {
    name: 'BasicInfo',
    data() {
      const net = localStorage.getItem('net');
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
      validateKeystore(keystore) {
        if(!keystore.key || !keystore.address || !keystore.salt) {
          return false;
        } else {
          return true;
        }
      },
      async importIdentityForKeystore() {
        console.log('keystore:[' + this.keystore + ']; keystorePassword:[' + this.keystorePassword + ']')
        //import identity
        let keystore;
        try {
          keystore = JSON.parse(this.keystore)
        } catch(err) {
          this.$store.dispatch('hideLoadingModals')
          this.$message.error(this.$t('importIdentity.invalidKeystore'))
          return;
        }
        if(!this.validateKeystore(keystore)) {
          this.$store.dispatch('hideLoadingModals')
          this.$message.error(this.$t('importIdentity.invalidKeystore'))
          return;
        }
        let identity = new Identity();
        try {
            const encryptedPrivateKeyObj = new Crypto.PrivateKey(keystore.key);
            const addr = new Crypto.Address(keystore.address);
            const label = keystore.label || 'Identity'
            const salt = keystore.salt
            //must call if use
            let password = SDK.transformPassword(this.keystorePassword)
            let params = keystore.scrypt ? formatScryptParams(keystore.scrypt) : null;
            identity = Identity.importIdentity(label, encryptedPrivateKeyObj, password, addr, salt, params);
            identity = identity.toJsonObj();
            //Fix: keystore里需要加上scrypt参数
            identity.scrypt = keystore.scrypt;
        } catch (err) {
            this.$message.error(this.$t('importIdentity.passError'))
            this.$store.dispatch('hideLoadingModals')
            return;
        }
        const tx = OntidContract.buildGetDDOTx(identity.ontid)
        const restClient = getRestClient()
        const res = await restClient.sendRawTransaction(tx.serialize(), true)
          if(res.Error === 0 && res.Result) {
            this.saveToDb(identity)
          } else {
            const restUrl = getNodeUrl()
            const doc = await OntidContract.getDocumentJson(identity.ontid, restUrl)
            const id = doc.publicKey.find(item => item.id.split('#')[0] === identity.ontid)
            debugger
            if(id) {
                this.saveToDb(identity)
            } else {
                this.$message.error(this.$t('importIdentity.ontidNotExist'))
                this.$store.dispatch('hideLoadingModals')
                return;
            }
          }
      },
      saveToDb(identity) {
        const that = this;
        const wallet = {
          type: 'Identity',
          address: identity.ontid,
          wallet: identity
        }
        dbService.insert(wallet, function (err, newDoc) {
          if (err) {
            console.log(err)
            that.$message.warning(that.$t('importIdentity.ontidExist'))
            that.$store.dispatch('hideLoadingModals')
            return;
          }

          that.$message.success(that.$t('importIdentity.importSuccess'))
          that.$router.push({name: 'Identitys'})
        })
      },
      cancel() {
        this.$router.push({name: 'Identitys'})
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

