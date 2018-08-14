<template>
    <div>
        <h2>Create Multi Sign Transfer Transaction</h2>
        <div class="formContainer">
            <form @submit.prevent="">
                <div class="fromContainer">
                    <div class="form-group">
                        <label for="label">Sender Address</label>
                        <input type="text" class="form-control" id="label" v-model="from">
                    </div>
                    <div class="form-group">
                        <label for="">Balance of Sender Address</label>
                        <button class="btn btn-sm btn-primary"
                                @click="refreshBalance">Refresh
                        </button>
                        <p>ONT: {{ont}}</p>
                        <p>ONG: {{ong}}</p>
                    </div>
                </div>

                <div class="form-group">
                    <label for="exampleInputEmail1">Receiver Address</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" v-model="to">
                </div>
                <div class="form-group">
                    <label>Gas Price</label>
                    <input type="text" class="form-control" v-model="gasPrice">
                </div>
                <div class="form-group">
                    <label>Gas Limit</label>
                    <input type="text" class="form-control" v-model="gasLimit">
                </div>
                <div class="form-group">
                    <label>Amount</label>
                    <div class="selectContainer">
                        <input type="text" class="form-control" v-model="amount">
                        <div class="selectAsset">
                            <select name="" v-model="asset" class="form-control">
                                <option value="ONT">ONT</option>
                                <option value="ONG">ONG</option>
                            </select>
                        </div>
                    </div>

                </div>

                <button @click="createTx" class="btn btn-info">Create</button>
                <button @click="back" class="btn btn-success">Back</button>
            </form>
        </div>
        <div class="createSuccess" v-if="multiSignTx">
            <p class="successText">Create multi sign transaction successed.</p>
            <p> Multi sign transaction: </p>
            <textarea name="" id="" rows="10" v-model="multiSignTx" class="successTx" disabled></textarea>
            <button @click="toSign" class="btn btn-success">To sign</button>
        </div>
    </div>
</template>

<script>
  import { GAS_LIMIT, GAS_PRICE, MAIN_NET, TEST_NET } from '../../core/consts'
  import { Crypto, OntAssetTxBuilder, RestClient } from 'ontology-ts-sdk'
  import { BigNumber } from 'bignumber.js'

  export default {
    name: 'CreateMultiSignTx',
    data () {
      return {
        from: '',
        to: '',
        gasPrice: GAS_PRICE,
        gasLimit: GAS_LIMIT,
        amount: '',
        multiSignTx: '',
        ont: 0,
        ong: 0,
        asset: 'ONT'
      }
    },
    methods: {
      refreshBalance () {
        if (!this.from || this.from.length !== 34) {
          return
        }
        let url = ''
        const net = localStorage.getItem('net')
        if (net === 'TEST_NET') {
          url = TEST_NET + ':20334'
        } else {
          url = MAIN_NET + ':20334'
        }

        const restClient = new RestClient(url)
        const from = new Crypto.Address(this.from)
        restClient.getBalance(from).then(res => {
          this.ont = res.Result.ont
          this.ong = (new BigNumber(res.Result.ong)).div(1e9).toFixed(9)
        })
      },
      toSign () {
        this.$router.push({name: 'SignMultiAddrTx'})
      },
      back () {
        this.$router.push({name: 'Wallets'})
      },
      createTx () {
        const from = new Crypto.Address(this.from)
        const to = new Crypto.Address(this.to)
        let amount = this.amount
        if (this.asset === 'ONG') {
          amount = new BigNumber(amount).multipliedBy(1e9)
        }
        const tx = OntAssetTxBuilder.makeTransferTx(this.asset, from, to, amount, this.gasPrice, this.gasLimit, from)
        const multiSignTx = tx.serialize()
        this.multiSignTx = multiSignTx
      }
    }
  }
</script>

<style>
    .formContainer {
        width: 50%;
        padding: 15px;
        float: left;
    }

    .createSuccess {
        float: left;
        border: 1px solid #dddddd;
        width: 40%;
        margin: 15px;
        padding: 15px;
    }

    .successText {
        color: green;
        font-size: 20px;
    }

    .successTx {
        width: 100%;
    }

    .fromContainer {
        border: 1px solid #35bfdf;
        padding: 10px;
        margin-bottom: 10px;
    }

    .selectContainer {
        position: relative;
    }

    .selectAsset {
        width: 100px;
        position: absolute;
        right: 0;
        top: 0px;
    }
</style>
