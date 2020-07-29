<template>
  <div class="common-detail-container">
    <div>
      <div class="div-shared-wallet-sign">
        <span>{{ isCommonWallet ? $t('common.normalWallet') : $t('common.hardwareWallet') }}</span>
        <p class="neo-compatile" v-if="!isCommonWallet && wallet.neo">{{$t('common.neoCompatible')}}</p>
      </div>
      <div class="div-wallet-name" @click="toWalletHome(wallet)">{{wallet.label}}</div>
      <!--<img class="img-wallet-edit" src="./../assets/edit.png" alt="">-->
      <div class="div-wallet-address">
        <div>{{$t('common.walletAddress')}}:</div>
        {{wallet.address}}
      </div>
    </div>
    <div v-show="addressCopied" class="copied-label">Copied</div>
    <img class="img-wallet-copy" src="../../../assets/copy.png" @click="copyAddress(wallet)" alt="">
    <div class="common-topRight-btns">
      <span class="common-delete-icon" @click="deleteWallet()" v-if="!isCommonWallet"></span>
      <a-dropdown v-if="isCommonWallet">
        <a-menu slot="overlay" >
          <a-menu-item key="1" @click="handleExportWallet()">
            <span >{{$t('common.exportDat')}}</span>
          </a-menu-item>
          <a-menu-item key="2" @click="handleExportWIF()">
            <span  >{{$t('common.exportWIF')}}</span>
          </a-menu-item>
          <a-menu-item key="3" @click="handleChangePassword()">
            <span  >{{$t('common.changePassword')}}</span>
          </a-menu-item>
          <a-menu-item key="4" @click="deleteWallet()">
            <span  >{{$t('common.deleteWallet')}}</span>
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          {{$t('common.more')}}<a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <a-modal
        :title="modalTitle"
        :visible="passModal"
        @ok="handleValidatePassword"
        @cancel="handleCancel">
          <div>
              <p class="font-medium">
                {{option==='TO_DELETE' ? $t('wallets.deleteingWallet') : '' }}
                {{option === 'TO_EXPORT' ? $t('wallets.exportingWallet') : ''}}
                {{option === 'EXPORT_WIF' ? $t('wallets.exportingWIF') : ''}}
                 {{wallet.address}}</p>
              <div v-if="isCommonWallet">
                <p>{{$t('common.enterWalletPassword')}}</p>
                <a-input class="input" v-model="password" :plaecholder="$t('common.password')" type="password"></a-input>
              </div>
          </div>
    </a-modal>

    <a-modal
        :title="$t('common.changePassword')"
        :visible="changePassModal"
        @ok="handleChangePassOk"
        @cancel="handleChangePassCancel">
          <div class="change-password-input">
            <div>
              <a-input type="password" class="input change-password"
               v-validate="{required: true ,min:6}" name="oldPassword" :data-vv-as="$t('FormField.oldPassword')"
               v-model="oldPassword" :placeholder="$t('wallets.oldPassword')"></a-input>
              <span class="v-validate-span-errors" v-show="errors.has('oldPassword')">{{ errors.first('oldPassword') }}</span>
            </div>

            <div>
              <a-input type="password" class="input change-password"
               v-validate="{required: true ,min:6}" name="newPassword" :data-vv-as="$t('FormField.newPassword')"
               v-model="newPassword" :placeholder="$t('wallets.newPassword')"></a-input>
              <span class="v-validate-span-errors" v-show="errors.has('newPassword')">{{ errors.first('newPassword') }}</span>
            </div>

            <div>
              <a-input type="password" class="input change-password"
                      v-validate="{required: true , min:6, is:newPassword}" :data-vv-as="$t('FormField.newPasswordConfirmation')" name="reNewPassword"
                      v-model="reNewPassword" :placeholder="$t('wallets.reNewPassword')"></a-input>
              <span class="v-validate-span-errors" v-show="errors.has('reNewPassword')">{{ errors.first('reNewPassword') }}</span>
            </div>

          </div>
    </a-modal>

    <a-modal
        :title="$t('common.changePassSuccess')"
        v-model="showChangePassTip"
        @ok="handleShowChangePassTipOk"
        >
        <div class="change-pass-success">
          <p class="font-medium"><a-icon type="warning" /> {{$t('common.changePassSuccessTip')}}</p>
          <a-button type="primary" @click="exportWallet(wallet)">{{$t('common.download')}}</a-button>
        </div>
    </a-modal>

  </div>
</template>

<script>
  import {Wallet, Account} from 'ontology-ts-sdk';
  import FileHelper from "../../../core/fileHelper"
  import {DEFAULT_SCRYPT} from '../../../core/consts'
  import {Crypto} from 'ontology-ts-sdk'
  import dbService from '../../../core/dbService'
	export default {
    name: "JsonWalletDetails",
    props: ['wallet'],
    data() {
      return {
        addressCopied: false,
        isCommonWallet: this.wallet.key ? true: false,
        passModal: false,
        password: '',
        option: '',
        oldPassword: '',
        newPassword: '',
        reNewPassword: '',
        changePassModal: false,
        showChangePassTip: false,
        modalTitle: this.wallet.key ? this.$t('common.authentication') : this.$t('common.confirmation')
      }
    },
    methods: {
      toWalletHome(wallet) {
        if(this.isCommonWallet) {
          sessionStorage.setItem('currentWallet', JSON.stringify(wallet))
          this.$router.push({name: 'Dashboard'})
        } else {
          sessionStorage.setItem('currentWallet', JSON.stringify(wallet))
          this.$router.push({name: 'LoginLedger'})
        }

      },
      copyAddress(wallet) {
        this.$copyText(wallet.address)
        this.addressCopied = true
        this.$nextTick(function () {
          setInterval(this.addressCopiedDisabled, 3000);
        })
      },
      addressCopiedDisabled() {
        this.addressCopied = false
      },

      exportWallet(commonWallet) {
        this.$store.dispatch('hideLoadingModals')
        console.log(commonWallet)
        let wallet = Wallet.create(commonWallet.label || "")
        console.log(wallet)
        wallet.scrypt.n = 16384;
        const account = Account.parseJsonObj(commonWallet)
        wallet.addAccount(account)
        FileHelper.downloadFile(wallet.toJsonObj(), commonWallet.label);
        this.showChangePassTip = false;
      },
      handleExportWallet() {
        this.passModal = true;
        this.option = 'TO_EXPORT'
      },
      deleteWallet() {
        this.passModal = true;
        this.option = 'TO_DELETE'
      },
      handleValidatePassword() {
        if(!this.isCommonWallet) {
          this.handleDelete();
          return;
        }
        if(!this.password && this.isCommonWallet) {
          this.$message.error(this.$t('common.enterWalletPassword'))
          return;
        }
        this.$store.dispatch('showLoadingModals')
        const enc = new Crypto.PrivateKey(this.wallet.key)
        let pri;
        try {
          pri = enc.decrypt(this.password, new Crypto.Address(this.wallet.address), this.wallet.salt, DEFAULT_SCRYPT)
        } catch (err) {
          console.log(err);
          this.$store.dispatch('hideLoadingModals')
          this.$message.error(this.$t('common.pwdErr'))
          return;
        }
        if(this.option === 'TO_DELETE') {
          this.handleDelete();
        } else if (this.option === 'TO_EXPORT') {
          this.passModal = false;
          this.exportWallet(this.wallet)
        } else if (this.option === 'EXPORT_WIF') {
          this.passModal = false;
          this.$store.dispatch('hideLoadingModals')
          const wif = pri.serializeWIF();
          this.$success({
            title: this.$t('wallets.exportedWIF'),
            content: wif
          });
        }
        this.password = '';
        pri.key = '';
      },
      handleDelete() {
        // remove from db
        const that = this;
        const type = this.isCommonWallet ? 'CommonWallet' : 'HardwareWallet'
        const commitType = this.isCommonWallet ? 'DELETE_COMMON_WALLET' : 'DELETE_HARDWARE_WALLET'
        dbService.remove({type:type, address: this.wallet.address}, {}, function(err, numRemoved) {
          if(err) {
            that.$store.dispatch('hideLoadingModals')
            that.$message.error(that.$t('wallets.deleteFailed'));
            return;
          }
           // remove from store
          that.$store.commit(commitType, {address: that.wallet.address})
          that.$store.dispatch('hideLoadingModals')
          that.$message.success(that.$t('wallets.deleteSucceess'))
          that.passModal = false;
        })
      },
      handleCancel() {
        this.passModal = false;
        this.password = '';
      },
      handleExportWIF() {
        this.passModal = true;
        this.option = 'EXPORT_WIF'
      },
      handleChangePassword() {
        this.changePassModal = true;
      },
      handleChangePassOk() {
        this.$validator.validateAll().then(result => {
          if(result) {
            this.$store.dispatch('showLoadingModals').then( () => {
            const enc = new Crypto.PrivateKey(this.wallet.key)
            let pri;
            try {
              pri = enc.decrypt(this.oldPassword, new Crypto.Address(this.wallet.address), this.wallet.salt, DEFAULT_SCRYPT)
            } catch (err) {
              console.log(err);
              this.$store.dispatch('hideLoadingModals')
              this.$message.error(this.$t('common.pwdErr'))
              return;
            }
            //save with new password
            const saltHex = Buffer.from(this.wallet.salt, 'base64').toString('hex');
            const address = new Crypto.Address(this.wallet.address)
            const newEnc = pri.encrypt(this.newPassword, address, saltHex, DEFAULT_SCRYPT);
            this.wallet.key = newEnc.key;
            dbService.update(
              {address: this.wallet.address},
              {$set: {wallet: this.wallet}}, {},
              (err, numReplaced) => {
                if(err) {
                  this.$store.dispatch('hideLoadingModals')
                  this.$message.error(this.$t('importJsonWallet.saveDbFailed'))
                  return;
                }
                this.$store.dispatch('hideLoadingModals')
                this.changePassModal = false;
                this.$message.success(this.$t('wallets.changePassSuccess'))
                this.oldPassword = '';
                this.newPassword = '';
                this.reNewPassword = ''
                this.showChangePassTip = true;
            })
            })

          }
        })
      },
      handleChangePassCancel() {
        this.changePassModal = false;
        this.oldPassword = '';
        this.newPassword = '';
        this.reNewPassword = ''
      },
      handleShowChangePassTipOk() {
        this.showChangePassTip = false;
      }
    }
  }
</script>

<style scoped>
  .common-detail-container {

  }
  .div-shared-wallet-sign {
    margin-top: 0.88rem;
    font-family: AvenirNext-Medium;
    font-size: 14px;
    color: #196BD8;
    cursor: default;
  }

  .div-wallet-name {
    margin-top: 1.75rem;
    font-family: AvenirNext-Medium;
    font-size: 18px;
    color: #515457;
    line-height: 24px;
    word-wrap: break-word;
    height:6rem;
    cursor: pointer;
  }

  .img-wallet-edit {
    position: absolute;
    top: 4.13rem;
    right: 1.41rem;
  }

  .div-wallet-address {
    font-family: AvenirNext-Regular;
    font-size: 14px;
    color: #B2B2B3;
    position:absolute;
    bottom:10px;
    cursor: default;
  }

  .img-wallet-copy {
    position: absolute;
    bottom:15px;
    right: 1.29rem;
  }

  .copied-label {
    position: absolute;
    top: 9rem;
    right: 2.69rem;
    background-color: #8a9098;
    border-radius: 2px;
    padding: 3px 4px;
    font-size: 10px;
    font-weight: 100;
    color: white;
  }
  .common-export-btn {
    height: 34px;
    width:78px;
    background:#5EA2FF;
    font-family: AvenirNext-Regular;
    font-size: 16px;
    color: #FFFFFF;
    border: 1px solid #FFFFFF;
    border-radius: 0;
    position: absolute;
    top: 0px;
    right: 20px;
  }
  .common-topRight-btns {
    position: absolute;
    top: 10px;
    right:20px;
    text-align: right;
  }
  .common-delete-icon {
    width:24px;
    height: 24px;
    display: inline-block;
    cursor: pointer;
    background:url('../../../assets/delete.png') center center;
    background-repeat:no-repeat;

  }
  .common-download-icon {
    width:24px;
    height: 24px;
    display: inline-block;
    cursor: pointer;
    background:url('../../../assets/download.png') center center no-repeat;
  }
  .change-password-input div{
    margin-bottom: 15px;
  }
  .change-password-input :last-child {
    margin:0;
  }
  .neo-compatile {
    font-size:12px;
    margin-top: 5px;
    margin-bottom:0;
    position:absolute;
    color: #515457;
  }
  .change-pass-success button {
    display: block;
    margin:0 auto;
  }
</style>
