<template>
  <div>
    <div class="basic-label">
      <a-input class="input" :placeholder="$t('createJsonWallet.label')" v-model="label"
          v-validate="{required: true}" name="label"
      ></a-input>
      <span class="v-validate-span-errors" v-show="errors.has('label')">{{ errors.first('label') }}</span>

      <a-input type="password" class="input input-password"
               v-validate="{required: true ,min:6}" name="password"
               v-model="password" :placeholder="$t('createJsonWallet.password')"></a-input>
      <span class="v-validate-span-errors" v-show="errors.has('password')">{{ errors.first('password') }}</span>

      <a-input type="password" class="input input-repassword"
               v-validate="{required: true , min:6, 'confirmed':password}" :data-vv-as="$t('FormField.passwordConfirmation')" name="rePassword"
               v-model="rePassword" :placeholder="$t('createJsonWallet.rePassword')"></a-input>
      <span class="v-validate-span-errors" v-show="errors.has('rePassword')">{{ errors.first('rePassword') }}</span>
    </div>

    <div class="basic-pk-btns">
      <div class="btn-container">
        <a-button type="default" @click="cancel" class="btn-cancel">{{$t('createJsonWallet.cancel')}}</a-button>
        <a-button type="primary" @click="next" class="btn-next">{{$t('createJsonWallet.next')}}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {Wallet, Account, Crypto} from "ontology-ts-sdk"
  import FileHelper from "../../../core/fileHelper"
  import dbService from '../../../core/dbService'

  export default {
    name: 'BasicInfo',
    data() {
      return {
        label: "",
        password: "",
        rePassword: "",
        createSuccess: false
      }
    },
    methods: {
      next() {
        this.$validator.validateAll().then(result => {
          if(result) {
            let privateKey = Crypto.PrivateKey.random()
            const wif = privateKey.serializeWIF();
            let body = {
              label: this.label,
              privateKey: privateKey,
              password: this.password,
              wif: wif
            }
            this.$store.dispatch('createJsonWalletWithPrivateKey', body).then(res => {
              // console.log(res)
            })

            this.$store.commit('ADD_CREATE_JSON_STEP')
          }
        })
      },
      cancel() {
        this.$router.push({name: 'Wallets'})
      }
    }
  }
</script>

<style>
  .basic-label {
    width: 540px;
    margin: 2px auto;
  }

  .input-password {
    margin-top: 30px;
  }

  .input-repassword {
    margin-top: 10px;
  }

  .copayer-label {
    margin-left: 172px;
    margin-top: 40px;
  }

  .basic-pks {
    width: 540px;
    margin: 0px auto;
  }

  .pk-item {
    margin-bottom: 15px;
  }

  .pk-item :first-child {
    width: 150px;
    margin-right: 20px;
    display: inline-block;
  }

  .pk-item :nth-child(2) {
    width: 318px;
  }

  .delete-icon {
    height: 34px;
    width: 34px;
    /* display: inline-block; */
    background: url('../../../assets/delete.png') center center;
    background-size: contain;
    float: right;
    margin-right: 10px;
    cursor: pointer;
  }

  .basic-pk-box {
    border: 1px solid #dddddd;
    width: 100%;
    height: 300px;
    padding: 10px;
    position: relative;
  }

  .basic-pk-add {
    border-top: 1px solid #dddddd;
    width: calc(100% - 20px);
    position: absolute;
    bottom: 10px;
    left: 10px;
    padding-top: 10px;
  }

  .basic-pk-item {
    width: 100%;
    float: left;
  }

  .basic-pk-item span {
    margin-right: 10px;
  }

  .basic-add-item {
    display: inline-block;
    width: 40%;
  }

  .basic-add-item input {
    width: 80%;
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

