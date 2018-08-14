<template>
    <div>
        <h2>Sign Multi Address Transaction</h2>
        <div>
            <div class="formContainer">
                <form @submit.prevent="">
                    <div class="form-group">
                        <label for="label">Transaction to sign</label>
                        <textarea name="" id="" wrap="virtual" v-model="txData" @change="deserializeTx"
                                  class="txDataText form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="label">All Related Public keys</label>
                        <button class="btn btn-sm btn-info" @click="addPk">Add</button>
                        <ul class="pkul">
                            <li v-for="(item, index) in pkItems">
                                <div class="pkItem">
                                    <textarea type="text" name="" class="pkInput" v-model="item.value"></textarea>
                                    <button class="btn btn-sm btn-defaut" @click="deletePk(index)">Delete</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="form-group">
                        <label for="label">Required Signature Number</label>
                        <input type="number" class="form-control" id="label" @change="changeSigNum" v-model="sigNum">
                    </div>


                    <div class="notice">
                        <span>Notice:</span>
                        <p class="text-danger">1. Please make sure your PC is absolutely safe.</p>
                        <p class="text-danger">2. Please make sure your local sign service is running.</p>
                    </div>
                    <button @click="signTx" class="btn btn-info">Sign Transaction</button>
                    <button @click="back" class="btn btn-success">Back</button>
                </form>
            </div>
            <div class="createSuccess">
                <p class="successText" v-if="signedTx">Sign transaction successed.</p>
                <p> Signed transaction: </p>
                <textarea name="" id="signedTx" rows="10" v-model="signedTx" class="successTx" readonly></textarea>
                <button id="copyBtn" @click="copyTx" class="btn btn-primary"
                        data-clipboard-target="#signedTx"><i class="fa fa-copy"></i> Copy
                </button>
                <button @click="toSend" class="btn btn-primary">Go to send transaction</button>

            </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import ClipboardJS from 'clipboard'

  export default {
    name: 'SignMultiAddrTx',
    data () {
      return {
        sigNum: 2,
        pkItems: [{value: ''}],
        txData: '',
        signedTx: '',
        signatureNum: 0,
        sigPublicKeys: []
      }
    },
    mounted () {
      var clipboard = new ClipboardJS('#copyBtn')

      clipboard.on('success', function (e) {
        console.info('Action:', e.action)
        console.info('Text:', e.text)
        console.info('Trigger:', e.trigger)

        e.clearSelection()
      })

      clipboard.on('error', function (e) {
        console.error('Action:', e.action)
        console.error('Trigger:', e.trigger)
      })
    },
    methods: {
      back () {
        this.$router.push({name: 'Wallets'})
      },
      changeSigNum () {
        this.sigNum = parseInt(this.sigNum)
      },
      addPk () {
        this.pkItems.push({value: ''})
      },
      deletePk (index) {
        const pks = this.pkItems.slice()
        pks.splice(index, 1)
        this.pkItems = pks
      },
      signTx () {
        const url = 'http://localhost:20000/cli'
        const m = this.sigNum
        const pks = this.pkItems.map(p => p.value)
        const body = {
          qid: '1',
          method: 'sigmutilrawtx',
          params: {
            raw_tx: this.txData.trim(),
            m: m,
            pub_keys: pks
          }
        }
        if (m < 2 || pks.length <= 0 || !this.txData) {
          alert('Please input correct values.')
          return
        }
        axios.post(url, body).then(res => {
          console.log(res)
          if (res.data.error_code === 0) {
            const signedTx = res.data.result.signed_tx
            this.signedTx = signedTx
          } else {
            alert('Sign transaction failed. ' + res.data.error_info)
          }
        }).catch(err => {
          if (err) {
            console.info(err)
          }
          alert('Please make sure you already started the local sign service')
        })
      },
      copyTx () {

      },
      toSend () {
        this.$router.push({name: 'SendTransaction'})
      },
      deserializeTx () {
        if (this.txData) {
          try {
            const txObj = Ont.Transaction.deserialize(this.txData.trim())
            console.log(txObj)
            this.signatureNum = txObj.sigs.length
            if (txObj.sigs.length > 0) {
              this.sigPublicKeys = txObj.sigs[0].pubKeys
              const pkItems = this.sigPublicKeys.map(p => { return {value: p.key} })
              this.pkItems = pkItems
              this.sigNum = txObj.sigs[0].M
            }
          } catch (e) {
            this.signatureNum = 0
            this.sigPublicKeys = []
            console.log(e)
          }
        }
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

    .pkul {
        list-style: none;
        padding-left: 0;
    }

    .pkItem {
        margin-bottom: 5px;
        float: left;
        width: 100%;
    }

    .pkItem button {
        margin: 10px;
        float: left;
    }

    .pkInput {
        width: 80%;
        float: left;
        font-size: 14px;
    }

    .sigPkInput {
        width: 100%;
        float: left;
        font-size: 14px;
    }

    .successTx {
        width: 100%;
    }

    .txDataText {
        height: 230px;
    }

    .notice {
        margin-bottom: 10px;
    }

    .notice p {
        font-family: SourceSansPro;
        margin-bottom: 5px;
    }
</style>

