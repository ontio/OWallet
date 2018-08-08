<template>
  <div class="container json-import-container">
    <ul class="nav nav-pills import-json-nav-pills" id="pills-tab" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="import-json-private-key-pills-tab" data-toggle="pill"
           href="#import-json-private-key-pills"
           role="tab"
           aria-controls="import-json-private-key-pills" aria-selected="true" @click="activeTab('pk')">{{ $t('createJsonWallet.privateKey') }}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="import-json-dat-pills-tab" data-toggle="pill" href="#import-json-dat-pills"
           role="tab"
           aria-controls="import-json-dat-pills" aria-selected="true" @click="activeTab('dat')">{{ $t('importJsonWallet.dat') }}</a>
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
        <a-input class="input input-wif"
                 v-validate="{required: true, length:64}" data-vv-as="private key" name="pk"
                 v-model="pk" :placeholder="$t('importJsonWallet.privateKey')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('pk')">{{ errors.first('pk') }}</span>
        <a-input type="password" class="input input-password"
                 v-validate="{required: true, min:6}" data-vv-as="password" name="pkPassword"
                 v-model="pkPassword" :placeholder="$t('importJsonWallet.password')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('pkPassword')">{{ errors.first('pkPassword') }}</span>
        <a-input type="password" class="input input-repassword"
                 v-validate="{required: true, min:6, is:pkPassword}" data-vv-as="password confirmation" name="pkRePassword"
                 v-model="pkRePassword" :placeholder="$t('createJsonWallet.rePassword')"></a-input>
        <span class="v-validate-span-errors"
              v-show="errors.has('pkRePassword')">{{ errors.first('pkRePassword') }}</span>
      </div>

      <div class="tab-pane fade" id="import-json-dat-pills" role="tabpanel"
           aria-labelledby="import-json-dat-pills-tab">
        <a-input class="input" :placeholder="$t('importJsonWallet.label')" v-model="datLabel" name="datLabel"
                 v-validate="{required: true}"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('datLabel')">{{ errors.first('datLabel') }}</span>
        <a class="upload-dat-file">{{ datPath }}
          <input type="file" @change="onFileChange" id="datFile">
        </a>

        <a-input type="password" class="input"
                 v-validate="{required: true}" data-vv-as="password" name="datPassword"
                 v-model="datPassword" :placeholder="$t('importJsonWallet.datImportPassword')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('datPassword')">{{ errors.first('datPassword') }}</span>
      </div>

      <div class="tab-pane fade" id="import-json-wif-pills" role="tabpanel"
           aria-labelledby="import-json-wif-pills-tab">
        <a-input class="input" :placeholder="$t('importJsonWallet.label')" v-model="wifLabel"></a-input>

        <a-input class="input input-wif"
                 v-validate="{required: true}" name="wif"
                 v-model="wif" :placeholder="$t('importJsonWallet.wif')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('wif')">{{ errors.first('wif') }}</span>

        <a-input type="password" class="input input-password"
                 v-validate="{required: true ,min:6}" data-vv-as="password" name="wifPassword"
                 v-model="wifPassword" :placeholder="$t('importJsonWallet.password')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('wifPassword')">{{ errors.first('wifPassword') }}</span>
        <a-input type="password" class="input input-repassword"
                 v-validate="{required: true ,min:6, is:wifPassword}" data-vv-as="password confirmation"
                 name="wifRePassword"
                 v-model="wifRePassword" :placeholder="$t('importJsonWallet.rePassword')"></a-input>
        <span class="v-validate-span-errors"
              v-show="errors.has('wifRePassword')">{{ errors.first('wifRePassword') }}</span>
      </div>

      <div class="tab-pane fade" id="import-json-mnemonic-pills" role="tabpanel"
           aria-labelledby="import-json-mnemonic-pills-tab">
        <a-input class="input" :placeholder="$t('importJsonWallet.label')" v-model="mnemonicLabel"></a-input>

        <textarea class="import-json-mnemonic" id="import-json-mnemonic" rows="6"
                  v-validate="{required: true} " data-vv-as="mnemonic" name="mnemonic"
                  :placeholder="$t('importJsonWallet.mnemonic')" v-model="mnemonic"></textarea>
        <span class="v-validate-span-errors" v-show="errors.has('mnemonic')">{{ errors.first('mnemonic') }}</span>

        <a-input type="password" class="input input-password"
                 v-validate="{required: true ,min:6}" data-vv-as="password" name="mnemonicPassword"
                 v-model="mnemonicPassword" :placeholder="$t('importJsonWallet.password')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('mnemonicPassword')">{{ errors.first('mnemonicPassword') }}</span>
        <a-input type="password" class="input input-repassword"
                 v-validate="{required: true ,min:6, is:mnemonicPassword}" data-vv-as="password confirmation"
                 name="mnemonicRePassword"
                 v-model="mnemonicRePassword" :placeholder="$t('importJsonWallet.rePassword')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('mnemonicRePassword')">{{ errors.first('mnemonicRePassword') }}</span>
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
  import {DEFAULT_SCRYPT} from '../../../../core/consts'
  import $ from 'jquery'

  export default {
    name: 'BasicInfo',
    data() {
      return {
        tabName: 'pk', // dat | pk | wif | mnemonic

        pk: '',
        pkLabel: '',
        pkPassword: '',
        pkRePassword: '',

        datPath: this.$t('importJsonWallet.datFile'),
        dat: '',
        datLabel: '',
        datPassword: '',

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
          this.$validator.validateAll({
            pk: this.pk,
            pkPassword: this.pkPassword,
            pkRePassword: this.pkRePassword
          }).then(result => {
            console.log(result)
            if (result) {
              this.$store.dispatch('showLoadingModals')
              this.importAccountForPK()
            }
          })
        } else if (this.tabName === 'dat') {
          this.$validator.validateAll({
            datPassword: this.datPassword,
            datLabel: this.datLabel
          }).then(result => {
            if (result) {
              this.$store.dispatch('showLoadingModals')
              this.importAccountForDat()
            }
          })
        } else if (this.tabName === 'wif') {
          this.$validator.validateAll({
            wif: this.wif,
            wifPassword: this.wifPassword,
            wifRePassword: this.wifRePassword
          }).then(result => {
            if (result) {
              this.$store.dispatch('showLoadingModals')
              this.importAccountForWif()
            }
          })
        } else {
          this.$validator.validateAll({
            mnemonic: this.mnemonic,
            mnemonicPassword: this.mnemonicPassword,
            mnemonicRePassword: this.mnemonicRePassword
          }).then(result => {
            if (result) {
              this.$store.dispatch('showLoadingModals')
              this.importAccountForMnemonic()
            }
          })
        }
      },
      importAccountForPK() {
        let body = {
          label: this.pkLabel,
          privateKey: new Crypto.PrivateKey(this.pk),
          password: this.pkPassword
        }
        this.$store.dispatch('createJsonWalletWithPrivateKey', body).then(res => {
          this.saveToDb(res)
        })
      },
      onFileChange() {
        // Custom upload button copywriting.
        let uploadFile = $("#datFile").val();
        $(".fileerrorTip").html("").hide();
        let arr = uploadFile.split('\\');
        let fileName = arr[arr.length - 1];
        this.datPath = this.$t('importJsonWallet.selectedDatFile') + fileName

        let files = document.getElementById("datFile").files
        this.dat = files[0]
      },
      importAccountForDat() {
        /**
         * 打开的文件：this.dat
         * 打开文件的密码： this.datPassword
         * 钱包名称：this.datLabel
         */
        FileHelper.readWalletFile(this.dat).then(res => {
          const wallet = JSON.parse(res)
          const account = wallet.accounts[0]
          const enc = new Crypto.PrivateKey(account.key);
          const address = new Crypto.Address(account.address)

          try {
            enc.decrypt(this.datPassword, address, account.salt, DEFAULT_SCRYPT)
          } catch (err) {
            console.log(err)
            this.$store.dispatch('hideLoadingModals')
            this.$message.error(this.$t('common.pwdErr'))
            return;
          }
          account.label = this.datLabel;
          this.saveToDb(account);
        })
      },
      importAccountForWif() {
        let privateKey;
        try {
          privateKey = Crypto.PrivateKey.deserializeWIF(this.wif);
        } catch (err) {
          this.$message.error(this.$t('basicInfo.errWif'))
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
        // 助记词导入
        const res = Ont.SDK.importAccountMnemonic(this.mnemonicLabel, this.mnemonic, this.mnemonicPassword);
        if (res.error === 0) {
          this.mnemonicAccount = JSON.parse(res.result)
          this.saveToDb(this.mnemonicAccount)
        } else if (res.error === 42002) {
          this.$message.error(this.$t('basicInfo.InvalidMnemonic'));
        }
      },
      saveToDb(account) {
        const that = this;
        const wallet = {
          type: 'CommonWallet',
          address: account.address,
          wallet: account
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
    width: 25%;
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

  .upload-dat-file {
    margin-top: 25px;
    position: relative;
    display: inline-block;
    background: #FBE45A;
    border: 1px solid #FBE45A;
    padding: 4px 12px;
    overflow: hidden;
    color: black !important;
    text-decoration: none;
    text-indent: 0;
    line-height: 1.5rem;
    height: 2.13rem;
  }

  .upload-dat-file input {
    background: #FBE45A;
    border: 1px solid #FBE45A;
    color: black !important;;
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    margin-top: 0;
    opacity: 0;
    line-height: 1.5rem;
    height: 2.13rem;
  }

  .upload-dat-file input:hover,
  .upload-dat-file:hover {
    background: #FBE45A;
    border-color: black;
    color: black !important;;
    text-decoration: none;
    cursor: pointer !important;;
  }

  .input-wif {
    margin-top: 30px;
  }

  .input-password {
    margin-top: 30px;
  }

  .input-repassword {
    margin-top: 6px;
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

