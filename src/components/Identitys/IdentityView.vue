<template>
  <div class="common-detail-container">
    <div >
      <div class="div-shared-wallet-sign">
        <span>{{ $t('identitys.identity')}}</span>
      </div>
      <div class="div-wallet-name">{{identity.label}}</div>
      <!--<img class="img-wallet-edit" src="./../assets/edit.png" alt="">-->
      <div class="div-wallet-address">
        <div>{{$t('identitys.ontid')}} :</div>
        {{identity.ontid}}
      </div>
    </div>
    <div v-show="addressCopied" class="copied-label">Copied</div>
    <img class="img-wallet-copy" src="../../assets/copy.png" @click="copyAddress(identity)" alt="">
    <div class="common-topRight-btns">
      <a-dropdown >
        <a-menu slot="overlay" >
          <a-menu-item key="1" >
            <span @click="handleExportIdentity()">{{$t('common.exportIdentity')}}</span>
          </a-menu-item>
          <a-menu-item key="2">
            <span  @click="deleteIdentity()">{{$t('common.deleteIdentity')}}</span>
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
                {{option==='EXPORT_ONTID' ? $t('wallets.exportOntid') : '' }}
                 {{identity.ontid}}</p>
              <div >
                <p>{{$t('common.enterIdentityPassword')}}</p>
                <a-input class="input" v-model="password" :plaecholder="$t('common.password')" type="password"></a-input>
              </div>
          </div>
    </a-modal>

    <a-modal
        :title="$t('common.exportIdentity')"
        v-model="showIdentityKeystore"
        @ok="handleShowKeystoreOk"
        >
        <div class="identity-keystore">
          <p class="font-medium">{{keystore}}</p>
        </div>
    </a-modal>
  </div>
</template>

<script>
  import {Wallet, Account, Crypto, Identity} from 'ontology-ts-sdk';
  import dbService from '../../core/dbService'
  import { formatScryptParams } from '../../core/utils'
	export default {
    name: "IdentityView",
    props: ['identity'],
    data() {
      return {
        addressCopied: false,
        modalTitle: this.$t('common.authentication'),
        passModal: false,
        password: '',
        showIdentityKeystore: false,
        keystore: '',
        option: ''
      }
    },
    methods: {
      copyAddress(identity) {
        this.$copyText(identity.ontid)
        this.addressCopied = true
        this.$nextTick(function () {
          setInterval(this.addressCopiedDisabled, 3000);
        })
      },
      addressCopiedDisabled() {
        this.addressCopied = false
      },
      handleExportIdentity() {
        this.passModal = true;
        this.option = 'EXPORT_ONTID'
      },
      deleteIdentity() {
        this.passModal = true;
        this.option = 'DELETE_ONTID'
      },
      handleCancel() {
        this.passModal = false;
        this.password = '';
      },
      handleValidatePassword() {
        if(!this.password ) {
          this.$message.error(this.$t('common.enterIdentityPassword'))
          return;
        }
        this.$store.dispatch('showLoadingModals')
        const controlData = this.identity.controls[0];
        const enc = new Crypto.PrivateKey(controlData.key)
        let pri;
        const scrypt = this.identity.scrypt ||
        {
            n : 4096,
            p : 8,
            r : 8,
            dkLen : 64
        }
        const params = formatScryptParams(scrypt);
        try {
          pri = enc.decrypt(this.password, new Crypto.Address(controlData.address), controlData.salt, params)
        } catch (err) {
          console.log(err);
          this.$store.dispatch('hideLoadingModals')
          this.$message.error(this.$t('common.pwdErr'))
          return;
        }
        if(this.option === 'DELETE_ONTID') {
          this.handleDelete();
        } else if (this.option === 'EXPORT_ONTID') {
          this.passModal = false;
          this.showIdentityKeystore = true;
          const keystore = {
            type : 'I',
            label : this.identity.label,
            algorithm : 'ECDSA',
            scrypt,
            key : this.identity.controls[0].key,
            salt: this.identity.controls[0].salt,
            address: this.identity.controls[0].address,
            parameters : {
                curve : 'secp256r1'
            }
          };
            this.keystore = JSON.stringify(keystore);
          this.$store.dispatch('hideLoadingModals')
        }
        this.password = '';
        pri.key = '';
      },
      handleDelete() {
        // remove from db
        const that = this;
        const type = 'Identity'
        const commitType = 'DELETE_IDENTITY';
        dbService.remove({type:type, address: this.identity.ontid}, {}, function(err, numRemoved) {
          if(err) {
            that.$store.dispatch('hideLoadingModals')
            that.$message.error(that.$t('wallets.deleteIdentityFailed'));
            return;
          }
           // remove from store
          that.$store.commit(commitType, {ontid: that.identity.ontid})
          that.$store.dispatch('hideLoadingModals')
          that.$message.success(that.$t('wallets.deleteIdentitySuccess'))
          that.passModal = false;
        })
      },

      handleShowKeystoreOk() {
        this.keystore = '';
        this.showIdentityKeystore = false;
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
  }

  .img-wallet-edit {
    position: absolute;
    top: 4.13rem;
    right: 1.41rem;
  }

  .div-wallet-address {
    font-family: AvenirNext-Regular;
    font-size: 13px;
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
    position:absolute;
    top:10px;
    right:10px;
  }
</style>
