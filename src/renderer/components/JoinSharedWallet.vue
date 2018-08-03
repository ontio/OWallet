<template>
    <div>
        <h2>Join Shared Wallet</h2>
        <div class="boxOuter">
            <div class="box1">
                <div class="form-group">
                    <label for="label">Shared Wallet Address</label>
                    <input type="text" class="form-control" id="label" v-model="sharedWalletAddress" placeholder="Enter wallet address">
                </div>
                <button @click="querySharedWallet" class="btn btn-info">Query</button>
                <button @click="back" class="btn btn-success">Back</button>
            </div>


            <div class="box2" v-if="sharedWallet">
                <div class="form-group">
                    <label for="label">Shared Wallet Name</label>
                    <input type="text" class="form-control" id="label" v-model="sharedWallet.sharedWalletName" disabled>
                </div>
                <div class="form-group">
                    <label for="label">Total Number of Copayers</label>
                    <input type="text" class="form-control" id="label" v-model="sharedWallet.totalNumber" disabled>
                </div>
                <div class="form-group">
                    <label for="label">Required Number of Copayers</label>
                    <input type="text" class="form-control" id="label" v-model="sharedWallet.requiredNumber" disabled>
                </div>
                <div class="form-group">
                    <label for="label">Addresses of all Copayers</label>
                    <ul class="pkul">
                        <li v-for="(item, index) in sharedWallet.coPayers">
                            <div class="copayerItem">
                                <p>Name: {{ item.name }}</p>
                                <p>Address: {{ item.address}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <button class="btn btn-info" v-if="showJoinBtn" @click="decryptToJoin">Join</button>
            </div>

            <div class="box3" v-if="noSuchWallet">
                No shared wallet with this address.
            </div>
        </div>

    <div class="modal fade devlop-modal" id="decryptPassword" tabindex="-1" role="dialog" >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="">Enter Password</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
              <div>
                  <div class="form-group">
                    <label for="label">Your Wallet Address</label>
                    <p>{{accountToJoin && accountToJoin.address}}</p>
                </div>
                <div class="form-group">
                    <label for="label">Your Wallet Password</label>
                    <input type="password" class="form-control" id="label" v-model="password" >
                </div>

              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary deploy-dialog-btn-close" data-dismiss="modal">Cancel</button>
            <button class="btn btn-success" @click="decryptPass">Confirm</button>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
import axios from 'axios';
import {ONT_PASS_NODE,ONT_PASS_NODE_PRD, ONT_PASS_URL, DEFAULT_SCRYPT} from '../../core/consts'
import dbService from '../../core/dbService'
import {Crypto} from 'ontology-ts-sdk'
import $ from 'jquery'
export default {
    name: 'JoinSharedWallet',
    data () {
        return {
            sharedWalletAddress: '',
            sharedWalletName: '',
            sharedWallet: null,
            noSuchWallet: false,
            showJoinBtn: false,
            accountToJoin: {
                address: ''
            },
            password:''
        }
    },
    methods: {
        querySharedWallet() {
            const net = localStorage.getItem('net')
            const ontPassNode = net === 'TEST_NET' ? ONT_PASS_NODE : ONT_PASS_NODE_PRD
            axios.get(ontPassNode+ONT_PASS_URL.QuerySharedWallet, {
                params: {
                    sharedWalletAddress: this.sharedWalletAddress
                }
            }).then(res => {
                if(res.status === 200) {
                    this.sharedWallet = res.data
                    this.decideShowJoin()
                    this.noSuchWallet = false;
                } else {
                    this.noSuchWallet = true;
                }
            }).catch(err => {
                this.noSuchWallet = true;
            })
        },
        decideShowJoin() {
            if (this.sharedWallet) {
                var that = this;
                const coPayers = this.sharedWallet.coPayers;
                dbService.wallet.find({}, function (err, accounts) {
                    if (err) {
                        console.log(err)
                        return;
                    }
                    for (let cp of coPayers) {
                        for (let ac of accounts) {
                            if (cp.address === ac.address) {
                                that.showJoinBtn = true;
                                that.accountToJoin = ac;
                                return;
                            }
                        }
                    }
                })
            }
            this.showJoinBtn = false;
            this.accountToJoin = null;
        },
        back() {
            this.$router.push({name: 'Wallets'})
        },
        decryptToJoin() {
            $('#decryptPassword').modal('show')
        },
        decryptPass() {
            const enc = new Crypto.PrivateKey(this.accountToJoin.key);
            const address = new Crypto.Address(this.accountToJoin.address);
            const salt = this.accountToJoin.salt;
            try {
                enc.decrypt(this.password, address, salt, DEFAULT_SCRYPT);
            }catch(err) {
                alert('You password is incorrect.')
                return;
            }
            alert('Join success!')
            //TODO： Jump to account state page
        }
    }
}
</script>

<style>
.boxOuter {
    padding: 15px;
    width:60%;
}
.box1 {
    margin-bottom: 15px;
}
.copayerItem {

}
.copayerItem p {
    margin-bottom: 3px;
}
</style>
