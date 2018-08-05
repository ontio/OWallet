<template>
  <div class="container json-import-container">
    <ul class="nav nav-pills import-json-nav-pills" id="pills-tab" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="import-json-private-key-pills-tab" data-toggle="pill" href="#import-json-private-key-pills"
           role="tab"
           aria-controls="import-json-private-key-pills" aria-selected="true" @click="activeTab('pk')">{{ $t('createJsonWallet.privateKey') }}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="import-json-wif-pills-tab" data-toggle="pill" href="#import-json-wif-pills"
           role="tab"
           aria-controls="import-json-wif-pills" aria-selected="true" @click="activeTab('wif')">{{ $t('createJsonWallet.wif') }}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="import-json-mnemonic-pills-tab" data-toggle="pill" href="#import-json-mnemonic-pills"
           role="tab"
           aria-controls="import-json-mnemonic-pills" aria-selected="false" @click="activeTab('mnemonic')">{{ $t('createJsonWallet.mnemonic') }}</a>
      </li>
    </ul>

    <div class="tab-content" id="pills-tabContent">
      <div class="tab-pane fade show active" id="import-json-private-key-pills" role="tabpanel"
           aria-labelledby="import-json-private-key-pills-tab">
        <a-input class="input" :placeholder="$t('importJsonWallet.label')" v-model="pkLabel"></a-input>
        <a-input class="input input-wif" :placeholder="$t('importJsonWallet.privateKey')" v-model="pk"></a-input>
        <a-input type="password" class="input input-password" :placeholder="$t('importJsonWallet.password')"
                 v-model="pkPassword"></a-input>
        <a-input type="password" class="input input-repassword" :placeholder="$t('importJsonWallet.rePassword')"
                 v-model="pkRePassword"></a-input>
      </div>

      <div class="tab-pane fade" id="import-json-wif-pills" role="tabpanel"
           aria-labelledby="import-json-wif-pills-tab">
        <a-input class="input" :placeholder="$t('importJsonWallet.label')" v-model="wifLabel"></a-input>
        <a-input class="input input-wif" :placeholder="$t('importJsonWallet.wif')" v-model="wif"></a-input>
        <a-input type="password" class="input input-password" :placeholder="$t('importJsonWallet.password')"
                 v-model="wifPassword"></a-input>
        <a-input type="password" class="input input-repassword" :placeholder="$t('importJsonWallet.rePassword')"
                 v-model="wifRePassword"></a-input>
      </div>

      <div class="tab-pane fade" id="import-json-mnemonic-pills" role="tabpanel"
           aria-labelledby="import-json-mnemonic-pills-tab">
        <a-input class="input" :placeholder="$t('importJsonWallet.label')" v-model="mnemonicLabel"></a-input>
        <textarea class="import-json-mnemonic" name="import-json-mnemonic" id="import-json-mnemonic" rows="6"
                  :placeholder="$t('importJsonWallet.mnemonic')" v-model="mnemonic"></textarea>
        <a-input type="password" class="input input-password" :placeholder="$t('importJsonWallet.password')"
                 v-model="mnemonicPassword"></a-input>
        <a-input type="password" class="input input-repassword" :placeholder="$t('importJsonWallet.rePassword')"
                 v-model="mnemonicRePassword"></a-input>
      </div>
    </div>

    <div class="basic-pk-btns">
      <div class="btn-container">
        <a-button type="default" @click="cancel" class="btn-cancel">{{$t('importJsonWallet.cancel')}}</a-button>
        <a-button type="primary" @click="next" class="btn-next">{{$t('importJsonWallet.next')}}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {Wallet, Account, Crypto} from "ontology-ts-sdk"
  import FileHelper from "../../../../core/fileHelper"
  import dbService from '../../../../core/dbService'

  export default {
    name: 'BasicInfo',
    data() {
      return {
        tabName: 'pk', // pk | wif | mnemonic

        pk: '',
        pkLabel: '',
        pkPassword: '',
        pkRePassword: '',

        wif: '',
        wifLabel: '',
        wifPassword: '',
        wifRePassword: '',

        mnemonic: '',
        mnemonicLabel: '',
        mnemonicPassword: '',
        mnemonicRePassword: '',
        mnemonicAccount: ''
      }
    },
    methods: {
      activeTab(tabName) {
        this.tabName = tabName
      },
      next() {
        if (this.tabName === 'pk') {
          this.importAccountForPK()
        } else if (this.tabName === 'wif') {
          this.importAccountForWif()
        } else {
          this.importAccountForMnemonic()
        }
      },
      importAccountForPK() {
        if (!this.pk.trim() || this.pk.length !== 64) {
          alert("Please enter the valid private key.");
          return;
        }

        if (
          !this.pkPassword.trim() ||
          !this.pkRePassword.trim() ||
          this.pkPassword !== this.pkRePassword
        ) {
          alert("Please enter the same password twice.");
          return;
        }

        let body = {
          label: this.pkLabel,
          privateKey: new Crypto.PrivateKey(this.pk),
          password: this.pkPassword
        }
        this.$store.dispatch('createJsonWalletWithPrivateKey', body).then(res => {
          this.saveToDb(res)
        })
      },
      importAccountForWif() {
        if (!this.wif.trim()) {
          alert("Please enter the WIF.");
          return;
        }

        if (
          !this.wifPassword.trim() ||
          !this.wifRePassword.trim() ||
          this.wifPassword !== this.wifRePassword
        ) {
          alert("Please enter the same password twice.");
          return;
        }

        let privateKey;
        try {
          privateKey = Crypto.PrivateKey.deserializeWIF(this.wif);
        } catch (err) {
          alert("Please input the valid WIF.");
          return;
        }

        let body = {
          label: this.wifLabel,
          privateKey: privateKey,
          password: this.wifPassword
        }
        this.$store.dispatch('createJsonWalletWithPrivateKey', body).then(res => {
          this.saveToDb(res)
        })
      },
      importAccountForMnemonic() {
        if (!this.mnemonic.trim()) {
          alert("Please enter the WIF.");
          return;
        }

        if (
          !this.mnemonicPassword.trim() ||
          !this.mnemonicRePassword.trim() ||
          this.mnemonicPassword !== this.mnemonicRePassword
        ) {
          alert("Please enter the same password twice.");
          return;
        }

        // 助记词导入
        const res = Ont.SDK.importAccountMnemonic(this.mnemonicLabel, this.mnemonic, this.mnemonicPassword);
        if (res.error === 0) {
          this.mnemonicAccount = JSON.parse(res.result)
          this.saveToDb(this.mnemonicAccount)
        } else if (res.error === 42002) {
          this.$message.error('Invalid mnemonic.');
        }
      },
      saveToDb(account) {
        const that = this;
        const wallet = {
          type: 'CommonWallet',
          address: account.address,
          wallet:account
        }
        dbService.insert(wallet, function (err, newDoc) {
          if (err) {
            console.log(err)
            that.$message.warning('The wallet already exists in local.')
            return;
          }
          // console.log(newDoc)
          that.$store.commit('INIT_JSON_WALLET')
          that.$message.success('Import wallet succeessfully!')
          that.$router.push({name: 'Wallets'})
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

  .import-json-nav-pills > li.nav-item {
    width: 33%;
    text-align: center;
    height: 2rem;
    margin-bottom: 30px;
    font-family: AvenirNext-Medium;
    font-size: 14px;
  }

  .import-json-nav-pills > li.nav-item > a {
    color: black;
  }

  .import-json-nav-pills .nav-link:hover {
    color: #196BD8;
  }

  .import-json-nav-pills .nav-link.active {
    color: #196BD8;
    background-color: transparent;
    border-radius: 0;
    border-bottom: #196BD8 solid 1px;
  }

  .input-wif {
    margin-top: 30px;
  }

  .input-password {
    margin-top: 30px;
  }

  .input-repassword {
    margin-top: 10px;
  }

  .import-json-mnemonic {
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

  .btn-container {
    width: 540px;
    margin: 20px auto;
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

