<template>
    <div>
        <h2>Send Transaction</h2>
        <div class="formContainer">
            <form @submit.prevent="">
                <div class="form-group">
                    <label>Transaction Data</label>
                    <textarea name="" class="txDataText form-control" wrap="virtual" v-model="txData"></textarea>
                </div>
                <p>Current network: {{network}}</p>
                <button @click="sendTx" class="btn btn-info">Send Transaction</button>
                <button @click="back" class="btn btn-success">Back</button>
            </form>
        </div>
        <div class="sendSuccess" v-if="checkLink">
            <p class="successText">Then transaction has been sent successfully.</p>
            <p> The transaction hash is:</p>
            <textarea name="" id="" rows="2" v-model="txHash" disabled></textarea>
            <p>You can check the transaction result by this
                <a v-bind:href="checkLink">link.</a>
            </p>
            <button @click="back" class="btn btn-success">Back</button>
        </div>
    </div>

</template>

<script>
  import { MAIN_NET, TEST_NET } from '../../core/consts'
  import { RestClient } from 'ontology-ts-sdk'

  export default {
    name: 'SendTransaction',
    data () {
      const net = localStorage.getItem('net')
      const network = net === 'TEST_NET' ? 'TestNet' : 'Main net'
      return {
        txData: '',
        txHash: '',
        checkLink: '',
        network: network
      }
    },

    methods: {
      sendTx () {
        if (!this.txData) {
          return
        }
        let url = ''
        const net = localStorage.getItem('net')
        if (net === 'TEST_NET') {
          url = TEST_NET + ':20334'
        } else {
          url = MAIN_NET + ':20334'
        }
        const rest = new RestClient(url)
        rest.sendRawTransaction(this.txData.trim()).then(res => {
          if (res.Error === 0) {
            this.txHash = res.Result
            let link = `https://explorer.ont.io/transaction/${res.Result}`
            if (net === 'TEST_NET') {
              link += '/testnet'
            }
            this.checkLink = link
            alert('Transaction has bee sent.')
          } else {
            const result = 'Error Code: ' + res.Error + ', Error Desc: ' + res.Desc
            alert('Transaction sent failed.Please try later.' + result)
          }
        })
      },
      back () {
        // this.$router.push({name:'Dashboard'})
        this.$router.back()
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

    .txDataText {
        height: 260px;
    }

    .sendSuccess {
        float: left;
        border: 1px solid #dddddd;
        width: 40%;
        margin: 15px;
        padding: 15px;
        margin-top: 50px;
    }

    .sendSuccess textarea {
        width: 100%;
    }

    .successText {
        color: green;
        font-size: 20px;
    }
</style>
