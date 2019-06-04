<style scoped>
.header-header {
    height:4rem;
    padding:1.1rem 0;
    width:100%;

}
.home-container {
    padding:0 20px;
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
    margin:20px auto;
    display: flex;
    flex-direction: row;
    justify-content: space-around
}
.claim-btn {
    text-align: center;
}

.rule {
    text-align:center;
}

.owners-table {

}

.table-item {
    margin:10px 0;
}
.table-item :first-child {
    width:72px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
}
.table-item :last-child {
    float:right;
}
.wallet-info {
    position: relative;
    padding-top:12px;
    font-family: AvenirNext-Regular;
    font-size:0.88rem;
    height:4rem;
}
.wallet-info p {
    margin-bottom:4px;
}

.wallet-type {
    position: absolute;
    width:3rem;
    height:3rem;
    background:url('../../assets/sharedWallet.png') center center;
    background-size:cover;
    right:0;
    top:-12px;
}
.wallet-balance {
    font-size:16px;
    color:#000000;
    font-family: 'AvenirNext-Bold';
    position: relative;
}
.wallet-balance :first-child {
    float: left;
    margin-right:20px;
}
.refresh-icon {
    display: inline-block;
    height:24px;
    width:24px;
    background: url('../../assets/refresh.png') center center;
    background-size:cover;
    cursor: pointer;
}
.asset-ont {
    height:2.56rem;
    line-height: 2.56rem;
    margin-top:12px;
}
.asset-ong {
    height:2.56rem;
    line-height: 2.56rem;
    margin-top:12px;
}
.asset-label {
    font-family: AvenirNext-Medium;
    font-size:0.88rem;
    color:#515457;
    float:left;
    margin-right: 12px;
}
.asset-amount {
    font-family: AvenirNext-Medium;
    font-size:18px;
    color:#000000;
}
.asset-value {
    padding-left: 3rem;
    font-family: AvenirNext-Medium;
    font-size:14px;
    color:#000000;
    margin-bottom: 20px;
}

.asset-btn {
    border-radius:0;
    background:#196BD8;
    font-family: AvenirNext-Medium;
    font-size: 14px;
    color: #FFFFFF;
    min-width:100px;
    height:34px;
    margin-right: 40px;
    margin-bottom:30px;
    /* margin-top: 30px; */
}
.arrow-up {
    width:10px;
    height:15px;
    background: url('../../assets/sendArrow.png') center center;
    background-size:cover;
    display: inline-block;
    background-repeat: no-repeat;
    float: left;
    margin-top:3px;
}
.arrow-down {
    width:10px;
    height:15px;
    background: url('../../assets/sendArrow.png') center center;
    background-size:cover;
    display: inline-block;
    background-repeat: no-repeat;
    float: left;
    margin-top:3px;
    transform: rotate(180deg)
}
.copayer-header {
    padding-bottom:5px;
    border-bottom: 1px solid #DFE2E9;
}
.copayer-header :last-child {
    float:right;
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
    width:64px;
    height:64px;
    display: block;
    float: right;
    background: url('../../assets/transaction.png');
    background-size:contain;
    top:-20px;
    right: 0;
    position: absolute;
}
.pending-tx {
    margin-bottom: 50px;
}
.tx-item {
    float: left;
    margin: 5px 0;
    cursor: pointer;
}
.pendingTx-item {
    cursor: pointer;
}
.tx-item :first-child {
    width:65%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: AvenirNext-Medium;
    font-size: 12px;
    color:#6F7781;
}
.tx-item :last-child {
    width:30%;
    text-align:right;
    float: right;
    display: block;
    font-family: AvenirNext-Medium;
    font-size: 12px;
    color: #000000;
}
.pending-tx-container {
    height:150px;
    overflow-y: auto;
}
 .pending-tx-container::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
}
.pending-tx-container::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
}
.pending-tx-container::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}
.copy-icon {
    width:18px;
    height:18px;
    display: inline-block;
    margin-left: 10px;
    background: url('../../assets/copy.png') center center;
    background-size: cover;
    cursor: pointer;
    position: relative;
    top: 5px;
}
.claim-ong-container {
    margin-bottom:20px;
  }
.oep4-container {
    margin-bottom:20px;
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
  .btn-redeem {
    float: left;
    margin-left: 30px;
  }
</style>
<template>
    <div class="home-container">
        <breadcrumb :current="sharedWallet.sharedWalletName" v-on:backEvent="handleBack"></breadcrumb>

        <div class="content-container">
            <div class="left-half">
                <div class="wallet-info">
                    <p>
                        <span>{{$t('sharedWalletHome.walletAddress')}}: {{this.sharedWallet.sharedWalletAddress}}</span>
                        <span class="copy-icon" @click="copy()"></span>
                    </p>

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
                        <span>{{balance.unboundOng}}</span>

                        </div>
                        <div class="claim-ong-item clearfix">
                        <span>{{$t('commonWalletHome.unboundOng')}}: </span>
                        <span>{{balance.waitBoundOng}}</span>
                        </div>
                    </div>
                    <a-button type="default" class="commonWallet-btn btn-redeem"
                    @click="redeemOng">{{$t('commonWalletHome.redeem')}}</a-button>
                    <redeem-info-icon></redeem-info-icon>
                </div>

                <!-- <div class="oep4-container">
                    <span class="asset-label">OEP-4 Tokens</span>
                    <a-button type="default" 
                    @click="checkMoreOep4">{{$t('commonWalletHome.go')}}</a-button>
                </div> -->


                <div v-if="hasLocalCopayer">
                    <a-button class="asset-btn" type="primary"  @click="showTransferBox">
                        <i class="arrow-up"></i>
                        {{$t('sharedWalletHome.send')}}</a-button>
                    <a-button class="asset-btn" type="primary" @click="showReceive">
                        <i class="arrow-down"></i>
                        {{$t('sharedWalletHome.receive')}}</a-button>
                </div>

                <div>
                    <!-- hide pax -->
                    <a-button class="asset-btn" type="primary" @click="showPaxMgmt">
                        {{$t('sharedWalletHome.paxMgmt')}}</a-button>
                    <a-button class="asset-btn" type="primary" @click="showTxMgmt">
                        {{$t('sharedWalletHome.txMgmt')}}</a-button>
                </div>


                <!-- <div class="claim-btn">
                    <a-button>{{$t('sharedWalletHome.claim')}} {{0.22}} ONG</a-button>
                </div> -->
                <div class="copayer-header">
                    <span>{{$t('sharedWalletHome.copayers')}}</span>
                    <span>{{$t('sharedWalletHome.rule')}} {{sharedWallet.requiredNumber}}-of-{{sharedWallet.totalNumber}}</span>
                </div>

                <div class="owners-table">
                    <div class="table-item" v-for="(item,index) in sharedWallet.coPayers" :key="item.address" v-if="index<2">
                        <span>{{item.name}}</span>
                        <span>{{item.address}}</span>
                    </div>
                    <div class="check-more" @click="toCopayerDetail">
                        {{$t('sharedWalletHome.checkMore')}}>>
                    </div>
                </div>



        </div>

        <div class="right-half">
            <div class="pending-tx">
                <div class="txList-header">
                    <span >{{$t('sharedWalletHome.pendingTx')}}</span>
                    <span class="transfer-icon"></span>
                </div>
                <div class="pending-tx-container">
                    <div v-for="tx in pendingTx" :key="tx.transactionidhash" class="tx-item pendingTx-item" @click="pendingTxDetail(tx)">
                    <span>{{tx.transactionidhash}}</span>
                    <span> {{tx.receiveaddress === sharedWallet.sharedWalletAddress ? '+' : '-'}}
                        {{tx.amount}} {{tx.assetName}}</span>
                </div>
                </div>

            </div>
            <div class="completed-tx">
                <div class="txList-header">
                    <span>{{$t('sharedWalletHome.completedTx')}}</span>
                    <span class="transfer-icon"></span>
                </div>

                <div v-for="(tx,index) in completedTx" :key="tx.txHash" class="tx-item" v-if="index<6" @click="showTxDetail(tx.txHash)">
                    <span>{{tx.txHash}}</span>
                    <span>{{tx.amount}} {{tx.asset}}</span>
                </div>
                <div class="check-more" v-if="completedTx.length > 6" @click="checkMoreTx">
                    {{$t('sharedWalletHome.checkMore')}}>>
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
    </div>
</template>

<script>
import {mapState} from 'vuex'
import { TEST_NET, MAIN_NET, ONT_PASS_NODE, ONT_PASS_NODE_PRD,ONT_PASS_URL } from '../../../core/consts'
import dbService from '../../../core/dbService'
import axios from 'axios'
import Breadcrumb from '../Breadcrumb'
import { BigNumber } from 'bignumber.js';
import RedeemInfoIcon from '../RedeemInfoIcon'

const {BrowserWindow} = require('electron').remote;

export default {
    name:'SharedWalletHome',
    data() {
        const net = localStorage.getItem('net');
        const network = net && net === 'TEST_NET' ? this.$t('common.testNet') : this.$t('common.mainNet');
        let url = ''
        if (net === 'TEST_NET') {
            url = TEST_NET + ':20334'
        } else {
            url = MAIN_NET + ':20334'
        }
        const sharedWallet = JSON.parse(sessionStorage.getItem('sharedWallet'));
        return {
            amount: 0,
            toAddress: '',
            transactions: '',
            nodeUrl:url,
            sharedWallet,
            pendingTx:[],
            completedTx:[],
            showTransfer: false,
            transferStep: 0,
            network,
            nodeUrl: url,
            hasLocalCopayer:true,
            interval: 15000,
            intervalId: '',
            redeemInfoVisible: false,
            requestStart: false
        }
    },
    components: {
        Breadcrumb,
        RedeemInfoIcon
    },
    mounted(){
        // UPDATE CURRENT WALLET
        const wallet = {
                address: this.sharedWallet.sharedWalletAddress,
                name: this.sharedWallet.sharedWalletName
            }
        this.$store.commit('UPDATE_CURRENT_WALLET', {wallet})

        this.refresh(true)
        this.ifHasLocalCopayer();
        let that = this;
        this.intervalId = setInterval(() => {
            this.refresh(false)
        }, this.interval)
    },
    beforeDestroy(){
        clearInterval(this.intervalId)
    },
    computed: {
        ...mapState({
             balance: state => state.CurrentWallet.balance
        })
    },
    methods:{
        handleBack() {
            this.$router.push({name: 'Wallets'})
        },
        getTransactions() {
            const url = this.network === 'TestNet' ? 'https://polarisexplorer.ont.io' : 'https://explorer.ont.io';
            return this.axios.get(url + '/api/v1/explorer/address/' + this.sharedWallet.sharedWalletAddress + '/10/1').then(response => {
            if (response.status === 200 && response.data && response.data.Result) {
                const txlist = response.data.Result.TxnList
                const completed = txlist.map(t => {
                    const asset = t.TransferList[0].AssetName.toUpperCase(); 
                    let amount = asset === 'ONT' ? parseInt(t.TransferList[0].Amount)
                                : Number(t.TransferList[0].Amount).toFixed(9)
                    if(t.TransferList[0].FromAddress === this.sharedWallet.sharedWalletAddress) {
                        amount = '-' + amount;
                    } else {
                        amount = '+' + amount;
                    }
                    return {
                        txHash: t.TxnHash,
                        asset,
                        amount: amount
                    }
                })
                this.completedTx = completed;
                return true;
            } else {
                console.log(response)
                return false;
            }
            }).catch(err=> {
                console.log(err);
                this.$message.error(this.$t('dashboard.getTransErr'))
                return false; // fetch tx history failed
            })
        },
        getBalance() {
            const urlNode = this.network === 'TestNet' ? 'https://polarisexplorer.ont.io' : 'https://explorer.ont.io';
            const url = `${urlNode}/api/v1/explorer/address/balance/${this.sharedWallet.sharedWalletAddress}`
            return axios.get(url).then(res => {
                const balance = {}
            if (res.data.Result) {
                for (let r of res.data.Result) {
                    if (r.AssetName === 'ong') {
                        balance.ong = r.Balance;
                    }
                    if (r.AssetName === 'waitboundong') {
                        balance.waitBoundOng = r.Balance;
                    }
                    if (r.AssetName === 'unboundong') {
                        balance.unboundOng = r.Balance;
                    }
                    if (r.AssetName === 'ont') {
                        balance.ont = r.Balance;
                    }
                }
                //pending tx has redeem tx,set unbound ong to 0;
                for(const tx of this.pendingTx) {
                    if(tx.receiveaddress === tx.sendaddress && tx.assetName === 'ONG' &&
                    (tx.amount - this.unboundOng) == 0)  {
                        balance.unboundOng = 0;
                    }
                }
                this.$store.commit('UPDATE_NATIVE_BALANCE', {
                    balance
                })
            }
                return true;
            }).catch(err => {
                 this.$message.error(this.$t('dashboard.getBalanceErr'))
                 return false;
            })

        },
        getExchangeCurrency() {
        const currency = 'ont'
        const goaltype = 'USD'
        const amount = this.balance.ont;
        const url = `https://service.onto.app/S3/api/v1/onto/exchangerate/reckon/${currency}/${goaltype}/${amount}`;
        axios.get(url).then(res => {
            console.log(res)
            if(res.data.Result) {
                this.balance.ontValue = res.data.Result.Money
            }
        })
      },
        getPendingTx() {
            const sharedAddress = this.sharedWallet.sharedWalletAddress
            // const assetName = 'ONT'
            const timeStamp = new Date().getTime();
            const net = localStorage.getItem('net')
            const ontPassNode = net === 'TEST_NET' ? ONT_PASS_NODE : ONT_PASS_NODE_PRD
            const url = ontPassNode + ONT_PASS_URL.QueryPendingTransfer
            this.axios.get(url, {
                params: {
                    sharedAddress,
                    // assetName,
                    beforeTimeStamp: timeStamp
                }
            }).then(res => {
                console.log(res)
                this.pendingTx = res.data.SigningSharedTransfers.map(p => {
                    if(p.assetName.toLowerCase() ==='ong') {
                        p.amount = new BigNumber(p.amount).div(1e9).toFixed(9)
                    }
                    return p;
                })
            }).catch(err => {
                console.log(err);
                this.$message.error(this.$t('common.networkErr'))
            })
        },
        toCopayerDetail() {
            this.$router.push({path:'/sharedWallet/copayers'})
        },
        refresh(showLoading) {
            if(showLoading) {
                this.$store.dispatch('showLoadingModals')
            } 
            if(this.requestStart) {
                return;
            }
            this.requestStart = true;
            Promise.all([
                this.getTransactions(),
                this.getBalance(),
                this.getPendingTx()
            ]).then(res => {
                this.requestStart = false;
                this.$store.dispatch('hideLoadingModals')
            })
            
        },
        back() {
            this.$router.push({name:'Dashboard'})
        },
        showTransferBox() {
            if(Number(this.balance.ong) < 0.01) {
                this.$message.warning(this.$t('common.ongNoEnough'))
                return;
            }
            this.$store.commit('CLEAR_CURRENT_TRANSFER');
            
            this.$store.commit('UPDATE_TRANSFER_REDEEM_TYPE', {type: false});
            this.$router.push({path:'/sharedWallet/sendTransfer'})
        },
        showReceive() {
            this.$router.push({path:'/commonWalletReceive/sharedWallet'})
        },
        pendingTxDetail(tx) {
            this.$store.commit('UPDATE_PENDINGTX', {pendingTx: tx})
            if(tx.receiveaddress === tx.sendaddress && tx.assetName === 'ONG') {
                this.$store.commit('UPDATE_TRANSFER_REDEEM_TYPE', {type: true});
            }
            this.$router.push('/sharedWallet/pendingTxHome')
        },
        ifHasLocalCopayer() {
            var that = this;
                const coPayers = this.sharedWallet.coPayers;
                const localCopayers = []
                dbService.find({type:'CommonWallet'}, function (err, accounts) {
                    if (err) {
                        console.log(err)
                        that.$message.error(err)
                        return;
                    }
                    for (let cp of coPayers) {
                        for (let ac of accounts) {
                            if (cp.address === ac.address) {
                                localCopayers.push(ac.wallet)
                            }
                        }
                    }
                    if (localCopayers.length > 0) {
                        that.hasLocalCopayer = true;
                    } else {
                        that.hasLocalCopayer = false;
                    }
                })
        },
        checkMoreTx() {
            let url = `https://explorer.ont.io/address/${this.sharedWallet.sharedWalletAddress}/10/1`
            if(this.network === 'TestNet') {
                url += '/testnet'
            }
            let win = new BrowserWindow({width: 1280, height: 800, center: true});
            win.on('closed', () => {
            win = null
            })
            win.loadURL(url)
        },
        showTxDetail(txHash) {
            let url = `https://explorer.ont.io/transaction/${txHash}`
            if(this.network === 'TestNet') {
                url += '/testnet'
            }
            let win = new BrowserWindow({width: 1280, height: 800, center: true});
            win.on('closed', () => {
                win = null
                })
            win.loadURL(url)
        },
      copy() {
            this.$copyText(this.sharedWallet.sharedWalletAddress);
            this.$message.success(this.$t('common.copied'))
      },
      redeemOng() {
          if(this.balance.unboundOng == 0) {
            this.redeemInfoVisible = true;
            return;
          }
          if(Number(this.balance.ong) < 0.01) {
                this.$message.warning(this.$t('common.ongNoEnough'))
                return;
            }
            this.$store.commit('CLEAR_CURRENT_TRANSFER');
            this.$store.commit('UPDATE_TRANSFER_REDEEM_TYPE', {type: true});
            
            const redeem = {
                claimableOng : this.balance.unboundOng,
                balance: this.balance.ong
            }
            this.$store.commit('UPDATE_CURRENT_REDEEM', {redeem: redeem})
            this.$router.push({path:'/sharedWallet/sendTransfer'})
      },
      handleModalOk() {
        this.redeemInfoVisible = false;
      },
      showPaxMgmt() {
          this.$router.push({path: '/sharedWallet/paxMgmt'})
      },
      showTxMgmt() {
          this.$router.push({path: '/sharedWallet/txMgmt'})
      },
      checkMoreOep4() {
        this.$router.push({name: 'Oep4Home'})
      }
    }
}
</script>


