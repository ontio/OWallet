<template>
  <div class="common-detail-container">
    <div @click="toWalletHome(wallet)">
      <div class="div-shared-wallet-sign">
        <span>{{ isCommonWallet ? $t('common.normalWallet') : $t('common.hardwareWallet') }}</span>
      </div>
      <div class="div-wallet-name">{{wallet.label}}</div>
      <!--<img class="img-wallet-edit" src="./../assets/edit.png" alt="">-->
      <div class="div-wallet-address">
        <div>{{$t('common.walletAddress')}}:</div>
        {{wallet.address}}
      </div>
    </div>
    <div v-show="addressCopied" class="copied-label">Copied</div>
    <img class="img-wallet-copy" src="../../../assets/copy.png" @click="copyAddress(wallet)" alt="">
    <!-- <a-button type="primary" class="common-export-btn" @click="exportWallet(wallet)" v-if="isCommonWallet"
    >{{$t('common.export')}}</a-button> -->
    <div class="common-topRight-btns">
      <span class="common-delete-icon" @click="deleteWallet()" ></span>
      <span class="common-download-icon" @click="handleExportWallet()" v-if="isCommonWallet"></span>      
    </div>

    <a-modal 
        :title="$t('common.authentication')"
        :visible="passModal"
        @ok="handleValidatePassword"
        @cancel="handleCancel">
          <div>
              <p class="font-medium">
                {{option==='TO_DELETE' ? $t('wallets.deleteingWallet') : $t('wallets.exportingWallet') }}
                 {{wallet.address}}</p>
              <div v-if="isCommonWallet">
                <p>{{$t('common.enterWalletPassword')}}</p>
                <a-input class="input" v-model="password" :plaecholder="$t('common.password')" type="password"></a-input>
              </div>   
              
          </div>
    </a-modal>
  </div>
</template>

<script>
  import {Wallet, Account} from 'ontology-ts-sdk';
  import FileHelper from "../../../../core/fileHelper"
  import {DEFAULT_SCRYPT} from '../../../../core/consts'
  import {Crypto} from 'ontology-ts-sdk'
  import dbService from '../../../../core/dbService'
	export default {
    name: "JsonWalletDetails",
    props: ['wallet'],
    data() {
      return {
        addressCopied: false,
        isCommonWallet: this.wallet.key ? true: false,
        passModal: false,
        password: '',
        option: ''
      }
    },
    methods: {
      toWalletHome(wallet) {
        if(this.isCommonWallet) {
          localStorage.setItem('publicKey', wallet.publicKey);
          localStorage.setItem('address', wallet.address)
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
        }
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
      }
    }
  }
</script>

<style scoped>
  .common-detail-container {
    position: relative;
  }
  .div-shared-wallet-sign {
    margin-top: 0.88rem;
    font-family: AvenirNext-Medium;
    font-size: 14px;
    color: #196BD8;
  }

  .div-wallet-name {
    margin-top: 1.75rem;
    font-family: AvenirNext-Medium;
    font-size: 18px;
    color: #515457;
    line-height: 24px;
  }

  .img-wallet-edit {
    position: absolute;
    top: 4.13rem;
    right: 1.41rem;
  }

  .div-wallet-address {
    margin-top: 4.25rem;
    font-family: AvenirNext-Regular;
    font-size: 14px;
    color: #B2B2B3;
  }

  .img-wallet-copy {
    position: absolute;
    top: 9rem;
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
    top: 0px;
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
    margin-left: 24px;
  }
</style>
