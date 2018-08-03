<template>
    <div>
        <h2>Create Multi Sign Addr</h2>
        <div class="formContainer">
            <form class="form-horizontal" @submit.prevent="">
                <div class="form-group">
                    <label for="label">Shared Wallet Name</label>
                    <input type="text" class="form-control" id="label" v-model="label" placeholder="Wallet name">
                </div>
                <div class="form-group">
                    <label for="pkNum">Total Number of Copayers</label>
                    <input type="number" class="form-control" id="pkNum" @change="changePknum" v-model.lazy="pkNum">
                </div>
                <div class="form-group">
                    <label for="sigNum">Required Number of Copayers</label>
                    <input type="number" class="form-control" id="pkNum" @change="changeSigNum" v-model.lazy="sigNum">
                </div>
                <div class="form-group">
                    <label for="">Public keys</label>
                    <ul class="pkul">
                        <li v-for="(item, index) in pkItems">
                            <div class="pkItem">
                                <input type="text" class="form-control" v-model="item.name"
                                :placeholder="'Name of Copayer' + (index+1) ">
                                <textarea type="text" name="" class="pkInput" v-model="item.value"></textarea>
                                <button class="btn btn-sm btn-defaut" @click="deletePk(index)">Delete</button>
                            </div>
                        </li>
                    </ul>
                </div>


                <button @click="createMultiSignAddr" class="btn btn-info">Create</button>
                <button @click="back" class="btn btn-success">Back</button>
            </form>
        </div>
        <div class="createSuccess" v-if="multiAddr">
            <p class="successText">Create multi sign address successed.</p>
            <p> Multi sign address: {{ multiAddr }} </p>
            <button @click="back" class="btn btn-success">Back</button>
        </div>
    </div>
</template>

<script>
import { Crypto } from 'ontology-ts-sdk';
export default {
    name: 'CreateMultiSignAddr',
    data() {
        return {
            label: '',
            pkNum:1,
            sigNum:1,
            pkItems:[{value:'', name:''}],
            multiAddr : ''
        }
    },
    methods: {
        changeSigNum() {
            this.sigNum = parseInt(this.sigNum);
        },
        changePknum() {
            this.pkNum = parseInt(this.pkNum);
            if ( this.pkNum &&  this.sigNum && this.sigNum > this.pkNum) {
                alert('Related public key number should be bigger than signature number.');
                this.pkNum = 0;
                return;
            }
            if ( this.pkNum && this.pkNum < this.pkItems.length) {
                alert('Public key number is not correct.');
                this.pkNum = 0;
                return;
            }
            if (this.pkNum && this.pkNum > this.pkItems.length) {
                const diff = this.pkNum - this.pkItems.length;
                for (let i = 0; i < diff; i++) {
                    this.pkItems.push({value:'', name:''});
                }
            }
        },
        deletePk(index) {
            const pks = this.pkItems.slice();
            pks.splice(index, 1);
            this.pkItems = pks;
        },
        createMultiSignAddr() {
            for (const i of this.pkItems) {
                if ( !i.value) {
                    alert('Please input all the public keys.');
                    return;
                }
            }
            if (this.pkNum && this.sigNum && this.pkItems.length === this.pkNum) {
                const pks = this.pkItems.map((p) => new Crypto.PublicKey(p.value));
                const multiAddr = Crypto.Address.fromMultiPubKeys(this.sigNum, pks);
                const sharedAddress = multiAddr.toBase58();
                const copayers = this.pkItems.map(pk =>  {
                    return {
                        name: pk.name,
                        publickey: pk.value,
                        address: Crypto.Address.fromPubKey(new Crypto.PublicKey(pk.value)).toBase58()
                    }
                })
                const body = {
                    "sharedWalletAddress": sharedAddress,
                    "sharedWalletName": this.label,
                    "totalNumber": this.pkNum,
                    "requiredNumber": this.sigNum,
                    "coPayers":copayers
                }
                //save shared wallet to ontpass
                this.$store.dispatch('createSharedWallet', body).then(res => {
                    this.multiAddr = sharedAddress;
                }, err => {
                    console.log(err)
                })

            } else {
                alert('Please input correct values.')
                return;
            }
        },
        back() {
          this.$router.push({name:'Wallets'})
      }
    }
}
</script>

<style>
.formContainer {
    width: 50%;
    padding:15px;
    float:left;
}

.createSuccess {
    float:left;
    border: 1px solid #dddddd;
    width: 40%;
    margin:15px;
    padding:15px;
}
.successText {
    color: green;
    font-size: 20px;
}

.pkul {
    list-style:none;
    padding-left: 0;
}

.pkItem {
  margin-bottom: 20px;
  float: left;
  width: 100%;
}

.pkItem button {
    margin:10px;
    float: left;
}
.pkItem input {
    width: 80%;
    margin-bottom:5px;
}
.pkInput {
  width: 80%;
  float: left;
}
</style>
