<style scoped>
.json-import-container {
  width: 48rem;
  padding-bottom: 100px;
}

.import-json-nav-pills>li.nav-item {
  width: 25%;
  text-align: center;
  height: 2rem;
  margin-bottom: 30px;
  font-family: AvenirNext-Medium;
  font-size: 14px;
}

.import-json-nav-pills>li.nav-item>a {
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
  color: black !important;
  ;
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
  color: black !important;
  ;
  text-decoration: none;
  cursor: pointer !important;
  ;
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

.nav-item a {
  font-size: 14px !important;
}

.tip {
  font-size: 14px;
}
</style>
<template>
  <div class="container json-import-container">
    <ul class="nav nav-pills import-json-nav-pills" id="pills-tab" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="import-json-wif-pills-tab" data-toggle="pill" href="#import-json-wif-pills"
          role="tab" aria-controls="import-json-wif-pills" aria-selected="true" @click="activeTab('wif')">{{
            $t('createJsonWallet.priavteKeywif') }}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="import-json-dat-pills-tab" data-toggle="pill" href="#import-json-dat-pills" role="tab"
          aria-controls="import-json-dat-pills" aria-selected="true" @click="activeTab('dat')">{{
            $t('createJsonWallet.keystoreDat') }}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="import-json-mnemonic-pills-tab" data-toggle="pill" href="#import-json-mnemonic-pills"
          role="tab" aria-controls="import-json-mnemonic-pills" aria-selected="false" @click="activeTab('mnemonic')">{{
            $t('createJsonWallet.mnemonic') }}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="import-json-private-key-pills-tab" data-toggle="pill"
          href="#import-json-private-key-pills" role="tab" aria-controls="import-json-private-key-pills"
          aria-selected="true" @click="activeTab('pk')">{{ $t('createJsonWallet.privateKey64Hex') }}</a>
      </li>
    </ul>

    <div class="tab-content" id="pills-tabContent">
      <div class="tab-pane fade show active" id="import-json-wif-pills" role="tabpanel"
        aria-labelledby="import-json-wif-pills-tab">
        <a-input class="input" :placeholder="$t('importJsonWallet.label')" v-validate="{ required: true }"
          name="wifLabel" :data-vv-as="$t('FormField.label')" v-model="wifLabel"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('wifLabel')">{{ errors.first('wifLabel') }}</span>

        <a-input class="input input-wif" v-validate="{ required: true }" name="wif" v-model="wif"
          :placeholder="$t('importJsonWallet.wifTip')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('wif')">{{ errors.first('wif') }}</span>

        <a-input type="password" class="input input-password" v-validate="{ required: true, min: 6 }"
          :data-vv-as="$t('FormField.password')" name="wifPassword" v-model="wifPassword"
          :placeholder="$t('importJsonWallet.setPassword')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('wifPassword')">{{ errors.first('wifPassword') }}</span>
        <a-input type="password" class="input input-repassword" v-validate="{ required: true, min: 6, is: wifPassword }"
          :data-vv-as="$t('FormField.passwordConfirmation')" name="wifRePassword" v-model="wifRePassword"
          :placeholder="$t('importJsonWallet.rePassword')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('wifRePassword')">{{ errors.first('wifRePassword')
          }}</span>
      </div>
      <div class="tab-pane fade" id="import-json-private-key-pills" role="tabpanel"
        aria-labelledby="import-json-private-key-pills-tab">
        <a-input class="input" :placeholder="$t('importJsonWallet.label')" v-model="pkLabel"></a-input>
        <a-input class="input input-wif" v-validate="{ required: true, length: 64 }"
          :data-vv-as="$t('FormField.privateKey')" name="pk" v-model="pk"
          :placeholder="$t('importJsonWallet.privateKeyTip')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('pk')">{{ errors.first('pk') }}</span>
        <a-input type="password" class="input input-password" v-validate="{ required: true, min: 6 }"
          :data-vv-as="$t('FormField.password')" name="pkPassword" v-model="pkPassword"
          :placeholder="$t('importJsonWallet.setPassword')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('pkPassword')">{{ errors.first('pkPassword') }}</span>
        <a-input type="password" class="input input-repassword" v-validate="{ required: true, min: 6, is: pkPassword }"
          :data-vv-as="$t('FormField.passwordConfirmation')" name="pkRePassword" v-model="pkRePassword"
          :placeholder="$t('createJsonWallet.rePassword')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('pkRePassword')">{{ errors.first('pkRePassword')
          }}</span>
      </div>

      <div class="tab-pane fade" id="import-json-dat-pills" role="tabpanel" aria-labelledby="import-json-dat-pills-tab">

        <a class="upload-dat-file">{{ datPath }}
          <input type="file" @change="onFileChange" id="datFile">
        </a>

        <!-- <p>
          <a-icon type="info-circle-o" class="redeem-info-icon" />
          <span class="tip">{{$t('importJsonWallet.importFirstDefault')}}</span>
        </p> -->

        <div v-show="datWallet?.accounts?.length > 0">
          <div v-for="(account, index) in datWallet.accounts" :key="account.address" style="margin-top: 20px;">
            <a-space direction="vertical" style="width: 100%">
              <span>Address: {{ account.address }}</span>
              <a-input class="input" :placeholder="$t('importJsonWallet.label')"
                @change="(e) => datLabelChange(e, index)" name="datLabel"></a-input>
              <a-input type="password" class="input" name="datPassword" @change="(e) => datPasswordChange(e, index)"
                :placeholder="$t('importJsonWallet.datImportPassword')"></a-input>
            </a-space>
          </div>

        </div>

      </div>

      <div class="tab-pane fade" id="import-json-mnemonic-pills" role="tabpanel"
        aria-labelledby="import-json-mnemonic-pills-tab">
        <a-input class="input" :placeholder="$t('importJsonWallet.label')" v-model="mnemonicLabel"></a-input>

        <textarea class="import-json-mnemonic" id="import-json-mnemonic" rows="6" v-validate="{ required: true }"
          :data-vv-as="$t('FormField.mnemonic')" name="mnemonic" :placeholder="$t('importJsonWallet.mnemonic')"
          v-model="mnemonic"></textarea>
        <span class="v-validate-span-errors" v-show="errors.has('mnemonic')">{{ errors.first('mnemonic') }}</span>

        <a-input type="password" class="input input-password" v-validate="{ required: true, min: 6 }"
          :data-vv-as="$t('FormField.password')" name="mnemonicPassword" v-model="mnemonicPassword"
          :placeholder="$t('importJsonWallet.setPassword')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('mnemonicPassword')">{{ errors.first('mnemonicPassword')
          }}</span>
        <a-input type="password" class="input input-repassword"
          v-validate="{ required: true, min: 6, is: mnemonicPassword }"
          :data-vv-as="$t('FormField.passwordConfirmation')" name="mnemonicRePassword" v-model="mnemonicRePassword"
          :placeholder="$t('importJsonWallet.rePassword')"></a-input>
        <span class="v-validate-span-errors" v-show="errors.has('mnemonicRePassword')">{{
          errors.first('mnemonicRePassword') }}</span>
      </div>
    </div>
    <a-modal :title="$t('importJsonWallet.confirmImport')" :visible="confirmModal" @ok="handleConfirmOk"
      @cancel="handleConfirmCancel">
      <div>
        <p class="font-medium">
          {{ $t('importJsonWallet.confirmImportExist') }}
        </p>
      </div>
    </a-modal>

    <div class="basic-pk-btns">
      <div class="btn-container">
        <a-button type="default" @click="cancel" class="btn-cancel">{{ $t('importJsonWallet.cancel') }}</a-button>
        <a-button type="primary" @click="next" class="btn-next">{{ $t('importJsonWallet.next') }}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Wallet, Account, Crypto } from "ontology-ts-sdk"
import FileHelper from "../../../core/fileHelper"
import dbService from '../../../core/dbService'
import { DEFAULT_SCRYPT } from '../../../core/consts'
// import $ from 'jquery'
import { isHexString, convertScryptParams } from '../../../core/utils'

export default {
  name: 'BasicInfo',
  data() {
    return {
      tabName: 'wif', // dat | pk | wif | mnemonic

      pk: '',
      pkLabel: '',
      pkPassword: '',
      pkRePassword: '',

      datPath: this.$t('importJsonWallet.datFile'),
      dat: '',
      datWallet: [],
      datLabel: [],
      datPassword: [],

      wif: '',
      wifLabel: '',
      wifPassword: '',
      wifRePassword: '',

      mnemonic: '',
      mnemonicLabel: '',
      mnemonicPassword: '',
      mnemonicRePassword: '',
      mnemonicAccount: '',
      confirmModal: false,
      updatingWallet: ''
    }
  },

  beforeDestroy() {
    console.log('clear')
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
        // this.$validator.validateAll({
        //   datPassword: this.datPassword,
        //   datLabel: this.datLabel
        // }).then(result => {
        if (!this.dat) {
          this.$message.error(this.$t('importJsonWallet.invalidDatFile'))
          return;
        }
        // if (result) {
        this.$store.dispatch('showLoadingModals')
        this.importAccountForDat()
        // }
        // })
      } else if (this.tabName === 'wif') {
        this.$validator.validateAll({
          wifLabel: this.wifLabel,
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
      if (!isHexString(this.pk)) {
        this.$message.error(this.$t('importJsonWallet.invalidPrivateKey'))
        this.$store.dispatch('hideLoadingModals')
        return;
      }
      this.$store.dispatch('createJsonWalletWithPrivateKey', body).then(res => {
        this.saveToDb(res)
      })
    },
    onFileChange() {
      // Custom upload button copywriting.
      // let uploadFile = $("#datFile").val();
      // $(".fileerrorTip").html("").hide();
      let uploadFile = document.getElementById("datFile").value;
      let arr = uploadFile.split('\\');
      let fileName = arr[arr.length - 1];
      let files = document.getElementById("datFile").files
      this.dat = files[0]
      console.log('this.dat', this.dat);
      if (!this.dat) {
        return
      }
      this.datPath = this.$t('importJsonWallet.selectedDatFile') + fileName

      FileHelper.readWalletFile(this.dat).then(res => {
        console.log('res', res);
        let wallet;
        try {
          wallet = JSON.parse(res)
          console.log('wallet', wallet);
          if (!wallet.scrypt || !wallet.accounts || wallet.accounts.length < 1) {
            throw new Error();
          }

          let accounts = [];
          for (const acct of wallet.accounts) {
            if (acct && acct.key && acct.address && acct.salt) {
              accounts.push(acct)
            }
          }
          wallet.accounts = accounts
          if (wallet.accounts.length < 1) {
            throw new Error();
          }
          this.datWallet = wallet


        } catch (err) {
          console.log(err)
          this.$store.dispatch('hideLoadingModals')
          this.$message.error(this.$t('importJsonWallet.invalidDatFile'))
          return;
        }


      })

    },

    datLabelChange(e, index) {
      this.datLabel[index] = e.target.value
    },
    datPasswordChange(e, index) {
      this.datPassword[index] = e.target.value
    },

    importAccountForDat() {
      let successAmount = 0;
      console.log('this.datWallet', this.datWallet);

      this.datWallet.accounts.forEach((account, index) => {
        if (!this.datPassword[index]) {
          return
        }
        if (!this.datLabel[index]) {
          return
        }

        try {
          const enc = new Crypto.PrivateKey(account.key);
          const address = new Crypto.Address(account.address)
          let scrypt = convertScryptParams(this.datWallet.scrypt)
          let pri;
          pri = enc.decrypt(this.datPassword[index], address, account.salt, scrypt)
          account.label = this.datLabel[index];
          //Fix: 使导入的wallet的scrypt参数保持一致，都使用 n = 16384
          if (this.datWallet.scrypt && this.datWallet.scrypt.n !== 16384) {
            account = Account.create(pri, this.datPassword[index], this.datLabel[index], DEFAULT_SCRYPT)
            account = account.toJsonObj();
          }
          this.saveToDb(account);
        } catch (err) {
          console.log(err)
          return;
        }
        successAmount++


      });
      this.$store.dispatch('hideLoadingModals')
      this.$message.success(`A total of ${this.datWallet.accounts.length - successAmount} addresses failed to import.`)

    },
    importAccountForWif() {
      let privateKey;
      try {
        privateKey = Crypto.PrivateKey.deserializeWIF(this.wif);
      } catch (err) {
        this.$message.error(this.$t('basicInfo.errWif'))
        this.$store.dispatch('hideLoadingModals')
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
      let account
      try {
        account = Account.importWithMnemonic(this.mnemonicLabel, this.mnemonic, this.mnemonicPassword, DEFAULT_SCRYPT)
      } catch (err) {
        this.$store.dispatch('hideLoadingModals')
        this.$message.error(this.$t('basicInfo.InvalidMnemonic'))
      }
      this.mnemonicAccount = account.toJsonObj()
      this.saveToDb(this.mnemonicAccount)
    },
    saveToDb(account) {
      account.isDefault = true;
      const that = this;
      const wallet = {
        type: 'CommonWallet',
        address: account.address,
        wallet: account
      }
      dbService.insert(wallet, function (err, newDoc) {
        if (err) {
          console.log(err)
          // that.$message.warning('The wallet already exists in local.')
          that.$store.dispatch('hideLoadingModals')
          that.confirmModal = true;
          that.updatingWallet = wallet;
          return;
        }
        // console.log(newDoc)
        that.$message.success(that.$t('importJsonWallet.success'))
        that.$router.push({ name: 'Wallets' })
      })
    },
    cancel() {
      this.$router.push({ name: 'Wallets' })
    },
    handleConfirmOk() {
      if (this.updatingWallet) {
        dbService.update({ address: this.updatingWallet.address }, { $set: { wallet: this.updatingWallet.wallet } }, {},
          (err, numReplaced) => {
            if (err) {
              this.$store.dispatch('hideLoadingModals')
              this.$message.error(this.$t('importJsonWallet.saveDbFailed'))
              return;
            }
            this.$message.success(this.$t('importJsonWallet.success'))
            this.$router.push({ name: 'Wallets' })
          })
      }
    },
    handleConfirmCancel() {
      this.confirmModal = false;
    }
  }
}
</script>
