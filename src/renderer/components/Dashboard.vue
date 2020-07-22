<style scoped>
  .header-header {
    height: 4rem;
    padding: 1.1rem 0;
    width: 100%;

  }

  .home-container {
    padding: 0 20px;
    height: 100%;
  }

  .content-container {
    display: flex;
  }

  .left-half {
    flex:1;
    padding-right: 67px;
  }

  .right-half {
    flex:1;
  }

  .asset {
    margin: 20px auto;
    display: flex;
    flex-direction: row;
    justify-content: space-around
  }

  .claim-btn {
    text-align: center;
  }

  .rule {
    text-align: center;
  }

  .owners-table {

  }

  .table-item {
    margin: 10px 0;
  }

  .table-item :first-child {
    width: 72px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
  }

  .table-item :last-child {
    float: right;
  }

  .wallet-info {
    position: relative;
    font-family: AvenirNext-Regular;
    font-size: 0.88rem;
  }

  .wallet-info p {
    margin-bottom: 4px;
  }

  .wallet-type {
    position: absolute;
    width: 4rem;
    height: 4rem;
    background: url('../assets/commonwallet.png') center center;
    background-size: cover;
    right: 0;
    top: -12px;
  }

  .copayer-header {
    padding-bottom: 5px;
    border-bottom: 1px solid #DFE2E9;
  }

  .copayer-header :last-child {
    float: right;
    font-family: AvenirNext-Bold;
    font-size: 14px;
    color: #6F7781;
  }

  .copayer-header :first-child {
    font-family: AvenirNext-Bold;
    font-size: 14px;
    color: #000000;
  }

  .check-more {
    font-family: AvenirNext-Medium;
    font-size: 12px;
    color: #227EEC;
    text-align: center;
    cursor: pointer;
    width:100%;
    float:left;
  }
  .check-more:hover {
    color:#619AE5;
  }

  .txList-header {
    padding-bottom: 5px;
    border-bottom: 1px solid #F4F4F6;
    position: relative;
    margin-bottom:10px;
  }

  .txList-header :first-child {
    font-family: AvenirNext-Bold;
    font-size: 14px;
    color: #000000;
    text-align: center;
  }

  /* .txList-header :last-child {
    width: 64px;
    height: 64px;
    display: block;
    float: right;
    background: url('../assets/transaction.png');
    background-size: contain;
    top: -20px;
    right: 0;
    position: absolute;
  } */

  .pending-tx {
    margin-bottom: 50px;
    height: 30%;
    overflow: scroll;
  }



  .wallet-pk {
    word-break: break-all;
  }



  .commonWallet-btn {
    width: 70px;
    height: 28px;
    border-radius: 0;
    background: #FBE45A;
    padding: 0;
    font-family: AvenirNext-Medium;
    font-size: 14px;
    color: #5E6369;
    border: none;
  }
  .btn-swap {
    margin-left: 30px;
  }


.nep5-label :first-child{
  display: block;
  height:16px;
}
.nep5-label :last-child {
  font-size: 12px;
}

.oep4-container  {
  display: flex;
  margin-bottom:30px;
  align-items:center;
}
.icon-add-oep4 {
  margin-left: 20px;
  font-size: 20px;
  cursor: pointer;
}
.left-footer {
  margin-top:20px;
}
</style>
<template>
  <div class="home-container">
    <breadcrumb :current="currentWallet.label" v-on:backEvent="handleBack"></breadcrumb>
    <div class="wallet-info">
      <p class="font-regular">
        {{$t('sharedWalletHome.address')}}: <span class="font-gray">{{address}}</span>
        <span class="common-icon copy-icon" @click="copy(address)"></span>
      </p>
    </div>
    <div class="content-container">

      <div class="left-half">
        <div class="wallet-balance">
          <div>
            <span>{{$t('sharedWalletHome.balance')}}</span>
            <span class="common-icon  refresh-icon" @click="refresh(true)"></span>
          </div>
          <span class="common-icon add-icon" @click="addOep4"></span>

        </div>
        <div class="asset-container">
          <div class="asset-item">
            <span class="asset-label">ONT</span>
            <span class="asset-amount">{{balance.ont}}</span>
          </div>
          <!-- <div class="asset-value">${{balance.ontValue}}</div> -->

          <div class="asset-item">
            <span class="asset-label">ONG</span>
            <span class="asset-amount">{{balance.ong}}</span>
          </div>

          <div class="asset-item" v-for="item of oep4s" :key="item.contract_hash">
            <span class="asset-label">{{item.symbol}}</span>
            <span class="asset-amount">{{item.balance}}</span>
          </div>

          <!-- <div class="asset-value">{{'$900'}}</div> -->
          <!-- <div class="asset-ong" v-if="currentWallet.key">
            <div class="asset-label nep5-label">
              <span>ONT</span>
              <span>(NEP-5)</span>
            </div>
            <span class="asset-amount">{{nep5Ont}}</span>
            <a-button type="default" class="commonWallet-btn btn-swap"
          @click="toSwap">{{$t('commonWalletHome.swap')}}</a-button>
          </div> -->

        </div>

        <div class="left-footer">
          <div class="claim-ong-container">
            <div class="claim-ong">
              <div class="claim-ong-item ">
                <span>{{$t('commonWalletHome.claimableOng')}}: </span>
                <span>{{balance.unboundOng}}</span>
              </div>
              <div class="claim-ong-item ">
                <span>{{$t('commonWalletHome.unboundOng')}}: </span>
                <span>{{balance.waitBoundOng}}</span>
              </div>
            </div>
            <div class="redeem-container">
              <a-button type="default" class="btn-redeem"
              @click="redeemOng">{{$t('commonWalletHome.redeem')}}</a-button>
              <redeem-info-icon></redeem-info-icon>
            </div>
          </div>

          <div>
            <a-button class="asset-btn" type="primary" @click="sendAsset">
              <i class="fa fa-paper-plane"></i>
              {{$t('sharedWalletHome.send')}}
            </a-button>
            <a-button class="asset-btn" type="primary" @click="commonReceive">
              <i class="fa fa-qrcode"></i>
              {{$t('sharedWalletHome.receive')}}
            </a-button>
          </div>
        </div>

      </div>

      <div class="right-half">

        <div class="completed-tx">
          <div class="txList-header">
            <span>{{$t('sharedWalletHome.completedTx')}}</span>
            <!-- <span class="transfer-icon"></span> -->
          </div>
          <div v-for="(tx,index) in completedTx" :key="tx.txHash+index" class="tx-item"
               @click="showTxDetail(tx.txHash)">
            <span>{{tx.txHash.substring(0, 40) + '...'}}</span>
            <span>{{tx.amount}} {{tx.asset}}</span>
          </div>
          <div class="check-more" v-if="completedTx.length > 6" @click="checkMoreTx">
            {{$t('sharedWalletHome.checkMore')}}
            <i class="fa fa-chevron-right icon-arrow"></i>
          </div>
        </div>

      </div>
    </div>

    <a-modal
        :title="$t('redeemInfo.info')"
        v-model="redeemInfoVisible"
        @ok="handleModalOk"
        >
          <p class="font-regular"><span class="font-medium"></span> {{$t('redeemInfo.noClaimableOng')}}</p>
      </a-modal>

    <oep4-selection :visible="showOep4Selection" @closeOep4Selection="closeOep4Selection" ></oep4-selection>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {TEST_NET, MAIN_NET, ONT_CONTRACT, ONT_PASS_NODE} from '../../core/consts'
  import {Crypto, OntAssetTxBuilder, RestClient, SDK} from 'ontology-ts-sdk'
  import axios from 'axios';
  import Breadcrumb from './Breadcrumb'
import { BigNumber } from 'bignumber.js';
import RedeemInfoIcon from './RedeemInfoIcon'
import Oep4Selection from './Common/Oep4Selection'
import { open, getRestClient, getTransactionListUrl, getBalanceUrl } from '../../core/utils'
const ONG_GOVERNANCE_CONTRACT = 'AFmseVrdL9f9oyCzZefL9tG6UbviEH9ugK'

  export default {
    name: 'Dashboard',
    components: {
      Breadcrumb,
      RedeemInfoIcon,
      Oep4Selection
    },
    data() {
      const currentWallet = JSON.parse(sessionStorage.getItem('currentWallet'));
      const net = localStorage.getItem('net');
      const network = net && net === 'TEST_NET' ? this.$t('common.testNet') : this.$t('common.mainNet');

      return {
        currentWallet,
        publicKey: currentWallet.publicKey,
        address: currentWallet.address,
        amount: 0,
        toAddress: '',
        transactions: '',
        asset: 'ONT',
        network: network,
        completedTx: [],
        intervalId: '',
        interval:15000,
        redeemInfoVisible: false,
        requestStart: false,
        showOep4Selection: false
      }
    },
    created() {
      this.$store.commit('CLEAR_NATIVE_BALANCE')
      this.$store.commit('CLEAR_OEP4S_BALANCES')
    },
    mounted: function () {
      //UPDATE_CURRENT_WALLET
      const wallet = {
            address: this.address,
            name: this.currentWallet.label
          }
      this.$store.commit('UPDATE_CURRENT_WALLET', {wallet})
      this.refresh(true)
      // this.$store.dispatch('queryBalanceForOep4', this.currentWallet.address)
      this.intervalId = setInterval(() => {
          this.refresh(false)
      }, this.interval)
    },
    computed: {
      ...mapState({
        nep5Ont : state => state.CurrentWallet.nep5Ont,
        balance: state => state.CurrentWallet.balance,
        oep4s: state => state.Tokens.oep4WithBalances
      })
    },
    beforeDestroy(){
        clearInterval(this.intervalId)
        this.$store.commit('UPDATE_NEP5_ONT', {nep5Ont:0})
    },
    methods: {
      handleBack() {
        this.$router.push({name: 'Wallets'})
      },
      async getTransactions() {
        const url = getTransactionListUrl(this.address);
        try {
          const res = await this.httpService(url)
          const txlist = res.result;
            const completed = []
            for(const t of txlist) {
              for(const tx of t.transfers) {
                const asset = tx.asset_name.toUpperCase()
                // if(tx.to_address === ONG_GOVERNANCE_CONTRACT && asset === 'ONG') {
                //   continue;
                // }
                let amount = asset === 'ONT' ? parseInt(tx.amount) : tx.amount;
                if (tx.from_address === this.address) {
                    amount = '-' + amount;
                } else {
                  amount = '+' + amount;
                }
                completed.push({
                  txHash: t.tx_hash,
                  asset,
                  amount: amount
                })
              }

            }
            this.completedTx = completed.slice(0,10);
            return completed; // fetch tx history succeed
        } catch(err) {
          console.log(err);
          this.$message.error(this.$t('dashboard.getTransErr'))
          return false; // fetch tx history failed
        }
        /* return this.axios.get(url + '/api/v1/explorer/address/' + this.address + '/10/1').then(response => {
          if (response.status === 200 && response.data && response.data.Result) {
            const txlist = response.data.Result.TxnList;
            const completed = []
            for(const t of txlist) {
              // if(t.TransferList.length === 1 && t.TransferList[0].ToAddress === ONG_GOVERNANCE_CONTRACT) {
              //   continue;
              // }
              for(const tx of t.TransferList) {
                const asset = tx.AssetName.toUpperCase()
                if(tx.ToAddress === ONG_GOVERNANCE_CONTRACT && asset === 'ONG' && Number(tx.Amount) == 0.01) {
                  continue;
                }
                let amount = asset === 'ONT' ? parseInt(tx.Amount) : tx.Amount;
                if (tx.FromAddress === this.address) {
                    amount = '-' + amount;
                } else {
                  amount = '+' + amount;
                }
                completed.push({
                  txHash: t.TxnHash,
                  asset,
                  amount: amount
                })
              }

            }
            this.completedTx = completed;
            return true; // fetch tx history succeed
          } else {
            console.log(response)
            return true;
          }
        }).catch(err => {
          console.log(err);
          this.$message.error(this.$t('dashboard.getTransErr'))
          return false; // fetch tx history failed
        }) */
      },
      getUnclaimOng() {
        const restClient = getRestClient();
        restClient.getAllowance('ong', new Crypto.Address(ONT_CONTRACT), new Crypto.Address(this.address)).then(res => {
          console.log(res.Result)
          this.unclaimOng = new BigNumber(res.Result).div(1e9);
        }).catch(err => {
          this.$message.error(this.$t('common.networkErr'))
        })
      },
      getBalance() {
        return this.$store.dispatch('getNativeBalance', {address: this.address}).then(res => {
          if(!res){
            this.$message.error(this.$t('dashboard.getBalanceErr'))
          }
          return res;
        })
      },
      getOep4Balances() {
        this.$store.dispatch('fetchTokenBalances', {address: this.address}).then(res => {
          if(!res) {
            this.$message.error(this.$t('dashboard.getBalanceErr'))
          }
          return res;
        })
      },
      getNep5Balance() {
        const NEO_TRAN = 100000000;
        SDK.getNeoBalance(this.currentWallet.address).then(res => {
          let nep5Ont = 0;
          if(res.result) {
            nep5Ont = res.result / NEO_TRAN
          }
          this.$store.commit('UPDATE_NEP5_ONT', {nep5Ont})
        })
      },
      getExchangeCurrency() {
        const currency = 'ont'
        const goaltype = 'USD'
        const amount = this.balance.ont;
        const url = `https://service.onto.app/S3/api/v1/onto/exchangerate/reckon/${currency}/${goaltype}/${amount}`;
        axios.get(url).then(res => {
          console.log(res)
          if (res.data.Result) {
            this.balance.ontValue = res.data.Result.Money
          }
        })
      },
      refresh(showLoading) {
        // this.$store.dispatch('showLoadingModals')
        // const that = this
        // setTimeout(() => {
        //     that.$store.dispatch('hideLoadingModals')
        // }, 500)
        if(showLoading) {
          this.$store.dispatch('showLoadingModals')
        }
        if(this.requestStart) {
          return;
        }
        this.requestStart = true;
        Promise.all([
          this.getBalance(),
          this.getTransactions(),
          this.getOep4Balances(),
        ]).then(res => {
          console.log(res)
          this.requestStart = false;
          this.$store.dispatch('hideLoadingModals')
        })

        // this.getNep5Balance();
      },
      sendAsset() {
        if(Number(this.balance.ong) < 0.05) {
          this.$message.warning(this.$t('common.ongNoEnough'))
          return;
        }
        this.$store.commit('CLEAR_CURRENT_TRANSFER');

        this.$router.push({name: 'CommonSendHome'})
      },
      commonReceive() {
        this.$router.push({path: '/commonWalletReceive/commonWallet'})
      },
      redeemOng() {
          if(this.balance.unboundOng == 0) {
            this.redeemInfoVisible = true;
            return;
          }
          const redeem = {
              claimableOng : this.balance.unboundOng,
              balance: this.balance.ong
          }
        this.$store.commit('UPDATE_CURRENT_REDEEM', {redeem: redeem})
        if(this.currentWallet.key) {
            this.$router.push({path:'/commonWalletRedeem/commonWallet'})
        } else {
            this.$router.push({path: '/commonWalletRedeem/hardwareWallet'})
        }
      },
      goBack() {
        this.$router.push({name: 'Wallets'})
      },
      checkMoreTx() {
        let url = `https://explorer.ont.io/address/${this.address}/10/1`
        if (this.network === 'TestNet') {
          url += '/testnet'
        }
        open(url)
      },
      showTxDetail(txHash) {
        let url = `https://explorer.ont.io/transaction/${txHash}`
        if (this.network === 'TestNet') {
          url += '/testnet'
        }
        open(url)
      },
      copy(value) {
            this.$copyText(value);
            this.$message.success(this.$t('common.copied'))
      },
      toSwap() {
        this.$router.push({name: 'CommonTokenSwap'})
      },
      handleModalOk() {
        this.redeemInfoVisible = false;
      },
      checkMoreOep4() {
        this.$router.push({name: 'Oep4Home'})
      },
      addOep4() {
        this.showOep4Selection = true;
      },
      closeOep4Selection() {
        this.showOep4Selection = false;
        this.$store.dispatch('showLoadingModals')
        this.$store.dispatch('fetchTokenBalances', {address: this.address})
      }
    }
  }
</script>
