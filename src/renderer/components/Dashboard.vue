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
    flex-basis: 50%;
  }

  .right-half {
    flex-basis: 50%;
    padding-left: 40px;
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
    padding-top: 12px;
    font-family: AvenirNext-Regular;
    font-size: 0.88rem;
    height: 4rem;
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

  .wallet-balance {
    font-size: 16px;
    color: #000000;
    font-family: 'AvenirNext-Bold';
    position: relative;
    margin-top: 48px;
  }

  .wallet-balance :first-child {
    float: left;
    margin-right: 20px;
  }

  .refresh-icon {
    display: inline-block;
    height: 24px;
    width: 24px;
    background: url('../assets/refresh.png') center center;
    background-size:cover;
    cursor: pointer;
  }

  .asset-ont {
    height: 2.56rem;
    line-height: 2.56rem;
    margin-top: 12px;
  }

  .asset-ong {
    height: 2.56rem;
    line-height: 2.56rem;
    margin-top: 12px;
  }

  .asset-label {
    font-family: AvenirNext-Medium;
    font-size: 0.88rem;
    color: #515457;
    float: left;
    margin-right: 12px;
  }

  .asset-amount {
    font-family: AvenirNext-Medium;
    font-size: 18px;
    color: #000000;
  }

  .asset-value {
    padding-left: 3rem;
    font-family: AvenirNext-Medium;
    font-size: 14px;
    color: #000000;
    margin-bottom: 20px;
  }

  .asset-btn {
    border-radius: 0;
    background: #196BD8;
    font-family: AvenirNext-Medium;
    font-size: 14px;
    color: #FFFFFF;
    width: 100px;
    height: 34px;
    margin-right: 40px;
    margin-bottom: 60px;
    border: none;
  }

  .arrow-up {
    width: 10px;
    height: 15px;
    background: url('../assets/sendArrow.png') center center;
    background-size: cover;
    display: inline-block;
    background-repeat: no-repeat;
    float: left;
    margin-top: 3px;
  }

  .arrow-down {
    width: 10px;
    height: 15px;
    background: url('../assets/sendArrow.png') center center;
    background-size: cover;
    display: inline-block;
    background-repeat: no-repeat;
    float: left;
    margin-top: 3px;
    transform: rotate(180deg)
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
  }

  .txList-header {
    padding-bottom: 5px;
    border-bottom: 1px solid #DFE2E9;
    position: relative;
  }

  .txList-header :first-child {
    font-family: AvenirNext-Bold;
    font-size: 14px;
    color: #000000;
    text-align: center;
  }

  .txList-header :last-child {
    width: 64px;
    height: 64px;
    display: block;
    float: right;
    background: url('../assets/transaction.png');
    background-size: contain;
    top: -20px;
    right: 0;
    position: absolute;
  }

  .pending-tx {
    margin-bottom: 50px;
    height: 30%;
    overflow: scroll;
  }

  .tx-item {
    float: left;
    margin: 5px 0;
    cursor: pointer;
  }

  .tx-item :first-child {
    width: 65%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: AvenirNext-Medium;
    font-size: 12px;
    color: #6F7781;
  }

  .tx-item :last-child {
    width: 30%;
    text-align: right;
    float: right;
    display: block;
    font-family: AvenirNext-Medium;
    font-size: 12px;
    color: #000000;
  }

  .wallet-pk {
    word-break: break-all;
  }

  .claim-ong-container {
    margin: 30px 0;
  }

  .claim-ong {
    float: left;
  }

  .claim-ong-item {
    margin-bottom: 10px;
    position: relative;
  }

  .claim-ong-item :first-child {
    font-family: AvenirNext-Medium;
    font-size: 12px;
    color: #515457;
    margin-right: 8px;
    width: 100px;
    display: block;
    float: left;
  }

  .claim-ong-item :nth-child(2) {
    font-family: AvenirNext-Medium;
    font-size: 12px;
    color: #000000;
    float: left;
  }

  .btn-redeem {
    float: left;
    margin-left: 30px;
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
  .copy-icon {
    width:18px;
    height:18px;
    display: inline-block;
    margin-left: 10px;
    background: url('../assets/copy.png') center center;
    background-size: cover;
    cursor: pointer;
    position: relative;
    top: 5px;
}
</style>
<template>
  <div class="home-container">
    <breadcrumb :current="currentWallet.label" v-on:backEvent="handleBack"></breadcrumb>

    <div class="content-container">
      <div class="left-half">
        <div class="wallet-info">
          <p>
            <span>{{$t('sharedWalletHome.address')}}: {{this.address}}</span>
            <span class="copy-icon" @click="copy(address)"></span>
          </p>
          <!-- <div>
            <span>{{$t('sharedWalletHome.publicKey')}}:</span>
            <span class="wallet-pk">{{this.publicKey}}</span>
          </div> -->
        </div>
        <div class="wallet-balance">
          <span>{{$t('sharedWalletHome.balance')}}</span>
          <span class="refresh-icon" @click="refresh"></span>
          <div class="wallet-type"></div>
        </div>
        <div>
          <div class="asset-ont">
            <span class="asset-label">ONT</span>
            <span class="asset-amount">{{balance.ont}}</span>
          </div>
          <!-- <div class="asset-value">${{balance.ontValue}}</div> -->

          <div class="asset-ong">
            <span class="asset-label">ONG</span>
            <span class="asset-amount">{{balance.ong}}</span>
          </div>
          <!-- <div class="asset-value">{{'$900'}}</div> -->
        </div>

        <div class="claim-ong-container clearfix">
          <div class="claim-ong">
            <div class="claim-ong-item clearfix">
              <span>{{$t('commonWalletHome.claimableOng')}}: </span>
              <span>{{unboundOng}}</span>

            </div>
            <div class="claim-ong-item clearfix">
              <span>{{$t('commonWalletHome.unboundOng')}}: </span>
              <span>{{waitBoundOng}}</span>
            </div>
          </div>
          <a-button type="default" class="btn-redeem" :disabled="unboundOng == 0"
          @click="redeemOng">{{$t('commonWalletHome.redeem')}}</a-button>
        </div>


        <div>
          <a-button class="asset-btn" type="primary" @click="sendAsset">
            <i class="arrow-up"></i>
            {{$t('sharedWalletHome.send')}}
          </a-button>
          <a-button class="asset-btn" type="primary" @click="commnReceive">
            <i class="arrow-down"></i>
            {{$t('sharedWalletHome.receive')}}
          </a-button>
        </div>


      </div>

      <div class="right-half">

        <div class="completed-tx">
          <div class="txList-header">
            <span>{{$t('sharedWalletHome.completedTx')}}</span>
            <span class="transfer-icon"></span>
          </div>
          <div v-for="(tx,index) in completedTx" :key="tx.txHash" class="tx-item" v-if="index<10"
               @click="showTxDetail(tx.txHash)">
            <span>{{tx.txHash}}</span>
            <span>{{tx.amount}} {{tx.asset}}</span>
          </div>
          <div class="check-more" v-if="completedTx.length > 6" @click="checkMoreTx">
            {{$t('sharedWalletHome.checkMore')}}>>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {legacySignWithLedger} from '../../core/ontLedger'
  import {TEST_NET, MAIN_NET, ONT_CONTRACT, ONT_PASS_NODE} from '../../core/consts'
  import {Crypto, OntAssetTxBuilder} from 'ontology-ts-sdk'
  import axios from 'axios';
  import Breadcrumb from './Breadcrumb'
import { BigNumber } from 'bignumber.js';

  export default {
    name: 'Dashboard',
    components: {
      Breadcrumb
    },
    data() {
      const publicKey = localStorage.getItem('publicKey');
      const address = localStorage.getItem('address');
      const currentWallet = JSON.parse(sessionStorage.getItem('currentWallet'));
      const net = localStorage.getItem('net');
      const network = net && net === 'TEST_NET' ? this.$t('common.testNet') : this.$t('common.mainNet');
      let url = '';

      if (net === 'TEST_NET') {
        url = TEST_NET + ':20334'
      } else {
        url = MAIN_NET + ':20334'
      }

      return {
        currentWallet,
        publicKey: publicKey,
        address: address,
        amount: 0,
        toAddress: '',
        balance: {ont: 0, ong: 0.0000, ontValue: 0},
        transactions: '',
        asset: 'ONT',
        network: network,
        nodeUrl: url,
        unboundOng: 0,
        waitBoundOng: 0,
        completedTx: [],
        intervalId: '',
        interval:2000,
      }
    },
    mounted: function () {
      this.refresh()
        let that = this;
        this.intervalId = setInterval(() => {
            that.getBalance();
            that.getTransactions();
        }, this.interval)
    },
    beforeDestroy(){
        clearInterval(this.intervalId)
    },
    methods: {
      handleBack() {
        this.$router.push({name: 'Wallets'})
      },
      goSetting() {
        this.$router.push({name: 'Setting'})
      },
      ledgerLogin() {
        this.$router.push({name: 'LoginLedger'})
      },
      setSavePath() {
        dialog.showOpenDialog({properties: ['openDirectory']}, (filePath) => {
          if (filePath === undefined) {
            alert('You did not set the path')
            return;
          }
          console.log(filePath);
          localStorage.setItem('savePath', filePath);
          return;
        })
      },
      toWalletHome(wallet) {
        localStorage.setItem('publicKey', wallet.publicKey);
        localStorage.setItem('address', wallet.address)
        this.$router.push({name: 'Home'})

      },
      toSharedWalletHome(wallet) {
        const walletObj = {
          address: wallet.sharedWalletAddress,
          coPayers: wallet.coPayers,
          requiredNumber: wallet.requiredNumber,
          totalNumber: wallet.totalNumber
        }
        // this.$store.commit('UPDATE_CURRENT_WALLET',{wallet: walletObj})
        sessionStorage.setItem('sharedWallet', JSON.stringify(walletObj))
        this.$router.push({name: 'SharedWalletHome'})
      },
      createSharedWallet() {
        this.$router.push({name: 'CreateSharedWallet'})
      },
      getTransactions() {
        const url = this.network === 'TestNet' ? 'https://polarisexplorer.ont.io' : 'https://explorer.ont.io';
        this.axios.get(url + '/api/v1/explorer/address/' + this.address + '/10/1').then(response => {
          if (response.status === 200 && response.data && response.data.Result) {
            const txlist = response.data.Result.TxnList;
            const completed = txlist.map(t => {
              const asset = t.TransferList[0].AssetName === 'ont' ? 'ONT' : 'ONG';
              let amount = asset === 'ONT' ? parseInt(t.TransferList[0].Amount) : Number(t.TransferList[0].Amount).toFixed(9);
              if (t.TransferList[0].FromAddress === this.address) {
                amount = '-' + amount;
              } else {
                amount = '+' + amount;
              }
              return {
                txHash: t.TxnHash,
                asset,
                amount: amount
              }
            });
            this.completedTx = completed;
          } else {
            console.log(response)
          }
        }).catch(err => {
          console.log(err);
          this.$message.error(this.$t('dashboard.getTransErr'))
        })
      },
      getUnclaimOng() {
        const restClient = new Ont.RestClient(this.nodeUrl);
        restClient.getAllowance('ong', new Crypto.Address(ONT_CONTRACT), new Crypto.Address(this.address)).then(res => {
          console.log(res.Result)
          this.unclaimOng = new BigNumber(res.Result).div(1e9);
        }).catch(err => {
          this.$message.error(this.$t('common.networkErr'))
        })
      },
      getBalance() {
        const urlNode = this.network === 'TestNet' ? 'https://polarisexplorer.ont.io' : 'https://explorer.ont.io';
        const url = `${urlNode}/api/v1/explorer/address/balance/${this.address}`
        axios.get(url).then(res => {
          if (res.data.Result) {
            for (let r of res.data.Result) {
              if (r.AssetName === 'ong') {
                this.balance.ong = r.Balance;
              }
              if (r.AssetName === 'waitboundong') {
                this.waitBoundOng = r.Balance;
              }
              if (r.AssetName === 'unboundong') {
                this.unboundOng = r.Balance;
              }
              if (r.AssetName === 'ont') {
                this.balance.ont = r.Balance;
              }
            }
            // this.getExchangeCurrency()
          }
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
      refresh() {
        this.$store.dispatch('showLoadingModals')
        setTimeout(() => {
            this.$store.dispatch('hideLoadingModals')
        }, 100)
        this.getBalance();
        this.getTransactions();

      },
      sendAsset() {
        this.$store.commit('CLEAR_CURRENT_TRANSFER');
        this.$store.commit('UPDATE_TRANSFER_BALANCE', {balance: this.balance})
        this.$router.push({name: 'CommonSendHome'})
      },
      commnReceive() {
        this.$router.push({path: '/commonWalletReceive/commonWallet'})
      },
      redeemOng() {
        
          const redeem = {
              claimableOng : this.unboundOng,
              balance: this.balance.ong
          }
        this.$store.commit('UPDATE_CURRENT_REDEEM', {redeem: redeem})
        if(this.currentWallet.key) {
            this.$router.push({path:'/commonWalletRedeem/commonWallet'})
        } else {
            this.$router.push({path: '/commonWalletRedeem/hardwareWallet'})            
        }
      },
      claimOng() {
        // makeWithdrawOngTx(addressObj, addressObj, value, new Address(payer), gasPrice, gasLimit)
        const from = new Crypto.Address(this.address);
        const to = from;
        const value = new BigNumber(this.unclaimOng).multipliedBy(1e9);
        const tx = OntAssetTxBuilder.makeWithdrawOngTx(from, to, value, from, '500', '20000');
        const pk = new Ont.Crypto.PublicKey(this.publicKey);
        const txSig = new Ont.TxSignature();
        txSig.M = 1;
        txSig.pubKeys = [pk];
        tx.payer = from;

        const txData = tx.serializeUnsignedData();
        legacySignWithLedger(txData, this.publicKey).then(res => {
          // console.log('txSigned: ' + res);
          const sign = '01' + res; //ECDSAwithSHA256
          txSig.sigData = [sign]
          tx.sigs = [txSig];
          const txSerialized = tx.serialize();
          // console.log('txSerialized: ' + txSerialized);

          //send tx
          restClient.sendRawTransaction(txSerialized).then(resp => {
            console.log('send tx resp: ' + JSON.stringify(resp));
            if (resp.Error === 0) {
              alert('Transaction has been sent successfully.')
            } else {
              alert('Transfer failed. ' + resp.Result)
            }
          })
        }, err => {
          alert(err.message)
        })
      },
      send() {
        if (!this.address || !this.toAddress || !this.amount) {
          return;
        }
        if (this.asset === 'ONT' && Number(this.amount) > this.balance.ont ||
          this.asset === 'ONG' && Number(this.amount) > this.balance.ong) {
          alert('Balance is not enough.')
          return;
        }
        const restClient = new Ont.RestClient(this.nodeUrl);
        const from = new Ont.Crypto.Address(this.address);
        const to = new Ont.Crypto.Address(this.toAddress);
        const amount = this.asset === 'ONT' ? this.amount : new BigNumber(this.amount).multipliedBy(1e9);
        const tx = Ont.OntAssetTxBuilder.makeTransferTx(this.asset, from, to, amount, '500', '20000');
        const pk = new Ont.Crypto.PublicKey(this.publicKey);
        const txSig = new Ont.TxSignature();
        txSig.M = 1;
        txSig.pubKeys = [pk];
        tx.payer = from;

        const txData = tx.serializeUnsignedData();
        legacySignWithLedger(txData, this.publicKey).then(res => {
          // console.log('txSigned: ' + res);
          const sign = '01' + res; //ECDSAwithSHA256
          txSig.sigData = [sign]
          tx.sigs = [txSig];
          const txSerialized = tx.serialize();
          // console.log('txSerialized: ' + txSerialized);

          //send tx
          restClient.sendRawTransaction(txSerialized).then(resp => {
            console.log('send tx resp: ' + JSON.stringify(resp));
            this.amount = 0;
            this.toAddress = '';
            if (resp.Error === 0) {
              alert('Transaction has been sent successfully.')
            } else {
              alert('Transfer failed. ' + resp.Result)
            }
          })
        }, err => {
          alert(err.message)
        })
        // console.log('send tx: ' + txData);
      },
      goBack() {
        this.$router.push({name: 'Wallets'})
      },
      showTransferBox() {

      },
      checkMoreTx() {
        let url = `https://explorer.ont.io/address/${this.address}/10/1`
        if (this.network === 'TestNet') {
          url += '/testnet'
        }
        window.location.href = url;
      },
      showTxDetail(txHash) {
        let url = `https://explorer.ont.io/transaction/${txHash}`
        if (this.network === 'TestNet') {
          url += '/testnet'
        }
        window.location.href = url;
      },
      copy(value) {
            this.$copyText(value);
            this.$message.success(this.$t('common.copied'))
      }
    }
  }
</script>
