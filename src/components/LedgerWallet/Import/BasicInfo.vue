<template>
  <div class="container ledger-import-container">
    <div>
      <a-input class="input" :placeholder="$t('importLedgerWallet.label')" v-model="label"></a-input>

      <!-- <a-checkbox @change="onChangeNeo" :checked="neo" class="check-neo">{{ $t('importLedgerWallet.neoCompatible')
        }}</a-checkbox> -->
    </div>
    <div class="div-ledger-info">
      <div class="div-ledger-info-tit">
        <strong>{{ $t("ledgerWallet.info") }}</strong>
      </div>

      <div v-show="!isAdvancedMode">
        <a-spin :spinning="isLoading">
          <div class="font-bold" style="margin-bottom: 15px">
            {{ $t("ledgerWallet.selectAccount") }}
          </div>
          <!-- <div class="ledger-status">
            <span class="font-medium-black">{{$t('ledgerWallet.status')}}: </span>
           <span class="font-medium">{{ledgerStatus}} </span>
          </div> -->
          <div class="address-list">
            <a-row v-for="pk in publicKeyList" :key="pk.acct">
              <!-- <a-col :span="24"> -->
              <a-checkbox v-if="pk" :value="pk" @change="selectAddress" :checked="checkPkSelect(pk)">
                {{ `${pk.acct}. ${getAddressFromPubKey(pk.publicKey)}` }}
              </a-checkbox>
              <!-- </a-col> -->
            </a-row>
          </div>

          <div class="paging-line">
            <div class="prev paging-item" @click="prevPage" :style="{ 'opacity': page === 1 && '0.6' || '1' }">&lt;
            </div>
            <div class="page-number paging-item">{{ page }}</div>
            <div class="next paging-item" @click="nextPage">&gt;</div>
          </div>
        </a-spin>
      </div>
      <div v-show="isAdvancedMode">
        <div class="font-bold" style="margin-bottom: 15px">
          {{ $t('ledgerWallet.specifyPath') }}
        </div>

        <a-radio-group v-model="neo">
          <a-radio :style="radioStyle" :value="false">
            <span class="path">44'/1024'/0'/0/</span>
            <a-input-number :disabled="neo" size="small" style="width: 60px; margin-left: 10px" :step="1" :min="0"
              :precision="0" v-model="notNeoPathParam" placeholder="0" @change="advancedModeInputChange" />
          </a-radio>
          <a-radio :style="radioStyle" :value="true">
            <span class="path">44'/888'/0'/0/</span>
            <a-input-number :disabled="!neo" size="small" style="width: 60px; margin-left: 10px" :step="1" :min="0"
              :precision="0" v-model="neoPathParam" placeholder="0" @change="advancedModeInputChange" />
          </a-radio>
        </a-radio-group>

        <div><a-spin :spinning="advancedModeLoading" /></div>
        <div v-if="advancedModePublicKey">{{ getAddressFromPubKey(advancedModePublicKey.publicKey) }}</div>
      </div>
    </div>

    <div class="mode-line">
      <div class="mode-select">
        <span v-show="!isAdvancedMode" @click="isAdvancedMode = !isAdvancedMode">{{ $t('ledgerWallet.advancedMode')
          }}</span>
        <span v-show="isAdvancedMode" @click="isAdvancedMode = !isAdvancedMode">{{ $t('ledgerWallet.normalMode')
          }}</span>
      </div>
    </div>

    <div class="basic-pk-btns">
      <div class="btn-container">
        <a-button type="default" @click="cancel" class="btn-cancel">{{
          $t("importJsonWallet.cancel")
          }}</a-button>
        <a-button type="primary" @click="addWallet" class="btn-next" >{{
          $t("importLedgerWallet.next")
          }}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Wallet, Account, Crypto } from "ontology-ts-sdk";
import dbService from "../../../core/dbService";
import { WALLET_TYPE } from "../../../core/consts";
import { getDeviceInfo, getPublicKey } from "../../../core/ontLedger";
import _ from "lodash";

function toggleElement(array, element) {
  // console.log('toggleElement', array, element);


  const publicKeyArray = array.map(item => item.publicKey)
  // const index = array.indexOf(element);
  const index = publicKeyArray.indexOf(element.publicKey);
  if (index === -1) {
    array.push(element);
  } else {
    array.splice(index, 1);
  }
}

export default {
  name: "BasicInfo",
  created() {
    this.debouncedGetPkForAdvancedMode = _.debounce(this.getPkForAdvancedMode, 500);
  },
  mounted: async function () {
    // let that = this;
    // await that.getDevice()
    // this.intervalId = setInterval(async() => {
    //   await that.getDevice()
    // }, this.interval)
    await this.getPublicKeyList();
  },
  // beforeDestroy() {
  // clearInterval(this.intervalId)
  // },
  data() {
    return {
      intervalId: "",
      interval: 3000,
      label: "",
      ledgerStatus: "",
      neo: false,
      device: null,
      page: 1,
      pageSize: 5,
      selectPublicKeys: [],
      publicKeyList: [],
      isAdvancedMode: false,
      isLoading: false,
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      notNeoPathParam: "",
      neoPathParam: "",
      advancedModeLoading: false,
      advancedModePublicKey: null,
    };
  },
  computed: {
    addDisable() {
      if (!this.label) {
        return true;
      }
      if (this.isAdvancedMode === false) {
        return this.selectPublicKeys.length === 0 ? true : false;
      }
      else {
        return this.advancedModePublicKey === null ? true : false;
      }
    }
  },
  watch: {
    neo: function (val) {
      this.advancedModePublicKey = null;
      this.notNeoPathParam = ""
      this.neoPathParam = ""

    }
  },
  methods: {
    async addWallet() {
      if(this.addDisable){
        this.$message.warn(this.$t('ledgerWallet.pleaseSelectWallet'))
        return;
      }
      // if(!this.label) {
      //   this.$message.error(this.$t('ledgerWallet.labelEmpty'))
      //   return;
      // }
      // if (!this.publicKey) {
      //   this.$message.error(this.$t("ledgerWallet.deviceError"));
      //   return;
      // }
      // if (this.publicKey) {
      //   const body = {
      //     pk: this.publicKey,
      //     neo: this.neo,
      //   };
      //   this.$store.dispatch("createLedgerWalletWithPk", body).then((res) => {
      //     if (res) {
      //       this.saveToDb(res);
      //     }
      //   });
      // }


      console.log('this.advancedModePublicKey', this.advancedModePublicKey);
      // if (!this.isAdvancedMode && this.selectPublicKeys.length === 0) {
      //   this.$message.error('请选择地址')
      //   return
      // }
      // if (this.isAdvancedMode && (!this.advancedModePublicKey)) {
      //   this.$message.error('请选择地址')
      //   return
      // }

      let list = this.isAdvancedMode ? [this.advancedModePublicKey] : this.selectPublicKeys;
      list.sort((a, b) => a.acct - b.acct);

      // Check if it has been imported.
      dbService.find({ 'wallet.publicKey': { $in: list.map(item => item.publicKey) } }, (err, accounts) => {
        if (err) {
          console.log(err);
          return;
        }
        if (accounts && accounts.length > 0) {
          this.$message.warn(this.$t('ledgerWallet.alreadyImported'))
        }
      })

      list.forEach(async (pk) => {
        const body = {
          pk: pk.publicKey,
          neo: this.isAdvancedMode && this.neo,
          acct: pk.acct
        }
        const res = await this.$store.dispatch("createLedgerWalletWithPk", body)
        console.log('createLedgerWalletWithPk', res);

        if (res) {
          this.saveToDb(res);
        }
      })
      this.$router.push({ name: "Wallets" });
    },

    // getDevice() {
    //   getDeviceInfo().then(res => {
    //     console.log('device' ,res)
    //     this.device = res;
    //     this.getPublicKey()
    //   }).catch(err => {
    //     console.log(err)
    //     if (err === 'NOT_FOUND') {
    //       this.ledgerStatus = this.$t('common.ledgerNotOpen')
    //     } else if (err === 'NOT_SUPPORT') {
    //       this.ledgerStatus = this.$t('common.ledgerNotSupported')
    //     } else {
    //       this.ledgerStatus = this.$t('common.pluginDevice')
    //     }
    //   })
    // },
    // async getDevice() {
    //   const res = await getDeviceInfo();
    //   console.log('device', res)
    //   this.device = res;
    //   return res
    // },
    async getPublicKeyForLedger(acctNum) {
      // if(!this.device){
      //   throw new Error('device not found')
      // }

      // const acctNum = 0;
      // getPublicKey(acctNum, this.neo).then(res => {
      // console.log('pk info: ' + res);
      // this.publicKey = res
      // this.ledgerStatus = this.$t('common.readyToImport')
      // this.next();
      // }).catch(err => {
      // this.ledgerStatus = err.message
      // })
      console.log("acctNum", acctNum, this.neo);
      const pk = await getPublicKey(acctNum, this.isAdvancedMode ? this.neo : false);
      console.log("pk", pk);
      return pk;
    },
    async getPublicKeyList() {
      this.isLoading = true;
      const pkArr = [];
      try {
        for (let i = 0; i < this.pageSize; i++) {
          const acctNum = (this.page - 1) * this.pageSize + i;
          const pk = await this.getPublicKeyForLedger(
            acctNum
          );
          pkArr.push({
            publicKey: pk,
            acct: acctNum
          });
        }
        this.publicKeyList = pkArr;
        console.log("this.publicKeyList", this.publicKeyList);
        this.isLoading = false;
      } catch (e) {
        console.log(e);
        this.isLoading = false;
      }

    },
    checkPkSelect(pk) {
      // return this.selectPublicKeys.includes(pk);
      return this.selectPublicKeys.map(item => item.acct).includes(pk.acct)
    },

    saveToDb(account) {
      account.label = `${this.label}${account.neo ? '-Compatible NEO' : ''}-${account.acct}`;
      const that = this;
      const wallet = {
        type: WALLET_TYPE.HardwareWallet,
        address: account.address,
        wallet: account,
      };

      dbService.find({ address: account.address }, (err, accounts) => {
        if (err) {
          console.log(err);
          return;
        }
        if (accounts && accounts.length > 0) {
          // this.$message.warn(this.$t('ledgerWallet.alreadyImported'))
          // dbService.update(
          //   { address: account.address },
          //   { $set: { wallet: account } },
          //   {},
          //   (err, replaceDoc) => {
          //     if (err) {
          //       console.log(err);
          //       return;
          //     }
          //   }
          // );
        } else {
          dbService.insert(wallet, function (err, newDoc) {
            if (err) {
              console.log(err);
            }
          });
        }
      });

      sessionStorage.setItem("currentWallet", JSON.stringify(account));
      // that.$router.push({ name: "Dashboard" });
    },
    cancel() {
      this.$router.push({ name: "Wallets" });
    },
    // onChangeNeo() {
    // this.neo = !this.neo;
    // this.getPublicKey()
    // },
    selectAddress(e) {
      console.log('selectAddress', e);
      const pk = e.target.value;
      toggleElement(this.selectPublicKeys, pk);
      console.log('this.selectPublicKeys', this.selectPublicKeys);

    },
    getAddressFromPubKey(pk) {
      if (!pk) return "";
      return Crypto.Address.fromPubKey(new Crypto.PublicKey(pk)).toBase58();
    },
    prevPage() {
      if (this.page === 1) return;
      this.page--;
      this.publicKeyList = [];
      this.getPublicKeyList();
    },
    nextPage() {
      this.page++;
      this.publicKeyList = [];
      this.getPublicKeyList();
    },
    async getPkForAdvancedMode() {
      console.log('getPkForAdvancedMode');

      try {
        this.advancedModeLoading = true;
        const pk = await this.getPublicKeyForLedger(this.neo ? this.neoPathParam : this.notNeoPathParam)
        this.advancedModePublicKey = {
          publicKey: pk,
          acct: this.neo ? this.neoPathParam : this.notNeoPathParam
        }
        this.advancedModeLoading = false;
      } catch (error) {
        console.log(error);
        this.advancedModeLoading = false;
      }


    },
    advancedModeInputChange() {
      this.advancedModePublicKey = null;
      this.debouncedGetPkForAdvancedMode()
    }
  },
};
</script>

<style scoped>
.ledger-import-container {
  width: 36rem;
}

.div-ledger-info {
  border: 1px solid #dfe2e9;
  margin-top: 15px;
  padding: 10px;
}

.div-ledger-info-tit {
  border-bottom: 1px solid #dfe2e9;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.basic-pk-btns {
  position: fixed;
  bottom: 0;
  width: calc(100% - 4rem);
  height: 85px;
  left: 4rem;
  background: #ffffff;
  box-shadow: 0 -1px 6px 0 #f2f2f2;
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

.check-neo {
  margin-top: 10px;
  font-family: "AvenirNext-Medium";
  color: #000000;
  font-size: 13px;
}

.paging-line {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.paging-item {
  height: 26px;
  width: 26px;
  border: 1px solid #555252;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
}

.paging-item+.paging-item {
  margin-left: 10px;
}

.path {
  display: inline-block;
  width: 86px;
}

.mode-line {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.mode-line .mode-select {
  text-decoration: underline;
  cursor: pointer;
  color: #909090;
  font-size: 14px;
}
</style>
